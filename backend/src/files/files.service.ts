import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import File from './file.model';
import { MinioService } from 'nestjs-minio-client';
import * as crypto from 'crypto';

@Injectable()
export class FilesService {
  private readonly bucketName = process.env.MINIO_BUCKET_NAME;
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly minio: MinioService,
  ) {}

  async getAllFiles(): Promise<File[]> {
    return await this.fileRepository.find();
  }

  async uploadFiles(files: Array<Express.Multer.File>): Promise<File[]> {
    return await Promise.all(
      files.map(async (file): Promise<File> => {
        // upload to minio
        const timestamp = Date.now().toString();
        const hashedFileName = crypto
          .createHash('md5')
          .update(timestamp)
          .digest('hex');
        const extension = file.originalname.substring(
          file.originalname.lastIndexOf('.'),
          file.originalname.length,
        );
        const fileName = hashedFileName + extension;

        try {
          await this.minio.client.putObject(
            this.bucketName,
            fileName,
            file.buffer,
          );
        } catch (err) {
          console.log(err);
        }
        let newFile = this.fileRepository.create({
          originalFileName: file.originalname,
          bucketFileName: fileName,
          link: `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${this.bucketName}/${fileName}`,
        });

        return await this.fileRepository.save(newFile);
      }),
    );
  }

  async downloadFile(fileName: string) {
    return this.minio.client.getObject(this.bucketName, fileName);
  }
}
