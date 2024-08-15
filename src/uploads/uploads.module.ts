import { Module } from '@nestjs/common';
import { UploadService } from './uploads.service';
import { UploadController } from './uploads.controller';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadsModule {}
