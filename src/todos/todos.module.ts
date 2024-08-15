import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [TodosController],
  providers: [TodosService],
  imports: [PrismaModule],
})
export class TodosModule {}
