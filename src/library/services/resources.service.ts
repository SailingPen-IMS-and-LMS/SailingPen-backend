import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { PrismaClient, ResourceType } from '@prisma/client';
import { FileUploader } from '../../utils/FileUploader';
import { CreateImageOrDocumentResourceDto } from '../dto/create-image-or-document-resource.dto';
import { CreateVideoResourceDto } from '../dto/create-video.dto';
import { CloudFlareStreamUploadResult } from '../../types/library/resource-types';

@Injectable()
export class ResourcesService {
  prisma: PrismaClient;

  constructor(
    private readonly fileUploader: FileUploader,
    private readonly configService: ConfigService,
  ) {
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

    const existingResource = await this.prisma.resource.findFirst({
      where: {
        folder_id: folderId,
        name: file.originalName,
      },
    });
    let newName = file.originalName;
    if (existingResource) {
      // change name by appending a unique id
      const uniqueId = Date.now();
      newName = `${uniqueId}-${file.originalName}`;
    }

    file.originalName = newName;

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

  async getResources(userId: string, folderId: number) {
    return this.prisma.resource.findMany({
      where: {
        folder_id: Number(folderId),
        LibraryFolder: {
          tutor: {
            user_id: userId,
          },
        },
      },
    });
  }

  private getResourceType(mimeType: string): ResourceType | null {
    if (mimeType.startsWith('image')) {
      return ResourceType.image;
    } else if (mimeType.includes('pdf')) {
      return ResourceType.document;
    }
    return null;
  }

  async createVideoResource(
    userId: string,
    folderId: number,
    { file }: CreateVideoResourceDto,
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

    const existingResource = await this.prisma.resource.findFirst({
      where: {
        folder_id: folderId,
        name: file.originalName,
      },
    });
    let newName = file.originalName;
    if (existingResource) {
      // change name by appending a unique id
      const uniqueId = Date.now();
      newName = `${uniqueId}-${file.originalName}`;
    }

    const formData = new FormData();
    const blob = new Blob([file.buffer], { type: file.mimetype });
    formData.append('file', blob, file.originalName);

    const cloudflareAccountId = this.configService.get<string>(
      'CLOUDFLARE_ACCOUNT_ID',
    );
    const cloudflareSecretKey = this.configService.get<string>(
      'CLOUDFLARE_SECRET_KEY',
    );
    console.log(
      `Account ID = ${cloudflareAccountId},API Key = ${cloudflareSecretKey}`,
    );

    try {
      const response = await axios.post<CloudFlareStreamUploadResult>(
        `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/stream`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${cloudflareSecretKey}`,
          },
          onUploadProgress(progressEvent) {
            console.log(progressEvent.progress);
          },
        },
      );

      console.log(response.data);

      const videoURL = response.data.result.preview.replace('watch', 'iframe');

      await this.prisma.resource.create({
        data: {
          name: newName,
          url: videoURL,
          type: ResourceType.video,
          folder_id: folderId,
          thumbnail_url: response.data.result.thumbnail,
        },
      });

      // return all the child resources of the parent folder
      return this.prisma.resource.findMany({
        where: {
          folder_id: folderId,
        },
      });
    } catch (e) {
      const error = e as AxiosError;
      console.log(error.response?.data);
      throw new InternalServerErrorException({
        statusCode: 500,
        message: error.message,
      });
    }
  }
}
