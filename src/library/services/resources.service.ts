import {
  Injectable,
  InternalServerErrorException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaClient, ResourceType } from '@prisma/client';
import { FileUploader } from '../../utils/FileUploader';
import { CreateImageOrDocumentResourceDto } from '../dto/create-image-or-document-resource.dto';

@Injectable()
export class ResourcesService {
  prisma: PrismaClient;

  constructor(private readonly fileUploader: FileUploader) {
    this.prisma = new PrismaClient();
  }

  async createResource(
    userId: string,
    folderId: number,
    { file }: CreateImageOrDocumentResourceDto,
  ) {
    const parentFolder = await this.prisma.libraryFolder.findFirst({
      where: {
        tutor: {
          user_id: userId,
        },
        id: folderId,
      },
      include: {
        tutor: true,
      },
    });
    if (!parentFolder) {
      throw new ForbiddenException(`You don't have access to this folder`);
    }

    const tutorId = parentFolder.tutor_id;

    const url = await this.fileUploader.uploadFile(file, {
      folder: `tutors/${tutorId}/resources/${folderId}`,
    });

    if (!url) {
      throw new InternalServerErrorException(
        "Couldn't upload file, please try again later",
      );
    }

    const resourceType = this.getResourceType(file.mimeType);
    if (!resourceType) {
      throw new BadRequestException('Invalid file type');
    }

    await this.prisma.resource.create({
      data: {
        name: file.originalName,
        url: url,
        type: resourceType,
        folder_id: folderId,
      },
    });

    // return all the child resources of the parent folder
    return this.prisma.resource.findMany({
      where: {
        folder_id: folderId,
      },
    });
  }

  private getResourceType(mimeType: string): ResourceType | null {
    if (mimeType.startsWith('image')) {
      return ResourceType.image;
      return ResourceType.video;
    } else if (mimeType.includes('pdf')) {
      return ResourceType.document;
    }
    return null;
  }
}
