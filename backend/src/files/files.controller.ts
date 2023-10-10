import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FilesService } from './files.service';
import File from './file.model';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<File[]> {
    return this.filesService.uploadFiles(files);
  }

  @Get()
  async getFiles(): Promise<File[]> {
    return this.filesService.getAllFiles();
  }

  @Get('/:bucketFileName')
  async download(
    @Param('bucketFileName') bucketFileName: string,
    @Res() res: Response,
  ) {
    const readerStream = await this.filesService.downloadFile(bucketFileName);
    readerStream.on('data', (chunk) => {
      res.write(chunk, 'binary');
    });
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename=' + bucketFileName,
    });
    readerStream.on('end', () => {
      res.end();
    });
    readerStream.on('error', () => {
      throw new HttpException(
        'Error downloading file',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    });
  }
}
