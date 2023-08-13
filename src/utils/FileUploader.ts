import { MemoryStoredFile } from 'nestjs-form-data';
import { Injectable } from '@nestjs/common';
import { S3Client, S3ClientConfig, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid4 } from 'uuid';
import { File } from '@web-std/file';

@Injectable()
export class FileUploader {
  AWS_S3_BUCKET = 'sailingpen-dev-bucket';

  config: S3ClientConfig = {
    // accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY'),
    // secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    region: 'ap-south-1',
  };

  s3 = new S3Client(this.config);

  async uploadFile(
    file: MemoryStoredFile,
    options: {
      folder: string;
    },
  ) {
    // console.log(file);
    const { originalName } = file;
    console.log(`originalName: ${originalName}`);

    const randomBytes = uuid4();
    const fileName = `${options.folder}/${randomBytes}-${originalName}`;

    return await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      fileName,
      file.mimetype,
    );
  }

  async uploadFileWithFileObject(
    file: File,
    options: {
      folder: string;
    },
  ) {
    // console.log(file);

    const originalName = file.name;
    const buffer = Buffer.from(await file.arrayBuffer());
    const type = file.type;

    const randomBytes = uuid4();
    const fileName = `${options.folder}/${randomBytes}-${originalName}`;

    return await this.s3_upload(buffer, this.AWS_S3_BUCKET, fileName, type);
  }

  async s3_upload(
    file: Buffer,
    bucket: string,
    name: string,
    mimetype: string,
  ) {
    const params = new PutObjectCommand({
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ContentType: mimetype,
    });

    try {
      await this.s3.send(params);
      // get public url
      const url = `https://${bucket}.s3.ap-south-1.amazonaws.com/${name}`;
      return url;
    } catch (e) {
      console.log(e);
    }
  }
}
