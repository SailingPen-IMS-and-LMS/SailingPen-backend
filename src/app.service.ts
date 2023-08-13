import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { Express } from 'express';
import * as AWS from 'aws-sdk';

@Injectable()
export class AppService {
  prisma: PrismaClient;

  AWS_S3_BUCKET = 'sailingpen-dev-bucket';
  s3 = new AWS.S3({
    accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
    secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
  });

  constructor(private readonly configService: ConfigService) {
    this.prisma = new PrismaClient();
  }

  async uploadFile(
    file: Express.Multer.File,
    options: {
      prefix: string;
      folder: string;
    },
  ) {
    console.log(file);
    const { originalname } = file;

    return await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      `${options.folder}/${options.prefix}-${originalname}`,
      file.mimetype,
    );
  }

  async s3_upload(
    file: Buffer,
    bucket: string,
    name: string,
    mimetype: string,
  ) {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }
}
