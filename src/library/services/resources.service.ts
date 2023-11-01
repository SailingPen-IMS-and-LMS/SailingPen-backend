import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { ResourceType } from '@prisma/client';
import { FileUploader } from '../../utils/FileUploader';
import { CreateImageOrDocumentResourceDto } from '../dto/create-image-or-document-resource.dto';
import { CreateVideoResourceDto } from '../dto/create-video.dto';
import { CloudFlareStreamUploadResult } from '../../types/library/resource-types';
import { PrismaService } from '../../prisma.service';
import { File } from '@web-std/file';
import {Readable} from 'stream'

@Injectable()
export class ResourcesService {
  constructor(
    private readonly fileUploader: FileUploader,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) { }

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
    const resources = await this.prisma.resource.findMany({
      where: {
        folder_id: Number(folderId),
        LibraryFolder: {
          tutor: {
            user_id: userId,
          },
        },
      },
    });

    const cloudflareAccountId = this.configService.get<string>(
      'CLOUDFLARE_ACCOUNT_ID',
    );
    const cloudflareSecretKey = this.configService.get<string>(
      'CLOUDFLARE_SECRET_KEY',
    );

    for (const resource of resources) {
      if (resource.type === ResourceType.video) {
        const signedTokenResult = await axios.post(`https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/stream/${resource.video_id}/token`, {}, {
          headers: {
            'Authorization': `Bearer ${cloudflareSecretKey}`,
          }
        })
        const signedToken = signedTokenResult.data.result.token as string;
        resource.url = resource.url.replace(resource.video_id || '', signedToken)
      }

    }

    return resources;
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


      const videoURL = response.data.result.preview.replace('watch', 'iframe');
      const videoId = response.data.result.uid;

      // require signed url to view video
      await axios.post(
        `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/stream/${videoId}`,
        {
          uid: videoId,
          requireSignedURLs: true,
        },
        {
          headers: {
            Authorization: `Bearer ${cloudflareSecretKey}`,
          },
        },
      );


      const signedTokenResult = await axios.post(`https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/stream/${videoId}/token`, {
        exp: Math.floor(Date.now() / 1000) + (5*60)
      }, {
        headers: {
          'Authorization': `Bearer ${cloudflareSecretKey}`,
          'Content-Type': 'application/json'
        }
      })
      const signedToken = signedTokenResult.data.result.token as string;
      const signedThumbnailURL = response.data.result.thumbnail.replace(videoId, signedToken)


      // get the thumbnail from signed url and convert it to a File object
      const thumbnailResponse = await axios.get(signedThumbnailURL, {
        responseType: 'arraybuffer'
      });

      const imageBuffer = Buffer.from(thumbnailResponse.data as ArrayBuffer);
      const imageStream = new Readable();
      imageStream.push(imageBuffer);
      imageStream.push(null);

      const thumbnailBlob = new Blob([imageBuffer], { type: 'image/jpeg' });


      // convert blob to file
      const thumbnailFile = new File([thumbnailBlob], `${videoId}_thumbnail.jpg`, {
        type: 'image/jpeg',
      });



      const thumbnailURL = await this.fileUploader.uploadFileWithFileObject(thumbnailFile, {
        "folder": "videos/thumbnails"
      })



      await this.prisma.resource.create({
        data: {
          name: newName,
          url: videoURL,
          type: ResourceType.video,
          folder_id: folderId,
          thumbnail_url: thumbnailURL,
          video_id: videoId,
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
      throw new InternalServerErrorException({
        statusCode: 500,
        message: error.message,
      });
    }
  }
}
