import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TodosService {
  constructor(private readonly prisma: PrismaService) {}
  async create(payload: CreateTodoDto, user) {
    const newTodo = await this.prisma.todo.create({
      data: {
        title: payload.title,
        description: payload.description,
        deadline: payload.deadline,
        importance: payload.importance,
        userId: user.id,
        isCompleted: payload.isCompleted,
      },
    });
    return newTodo;
  }

  async findAll(user) {
    return await this.prisma.todo.findMany({ where: { userId: user.id } });
  }

  async findOne(id: string) {
    const todo = await this.prisma.todo.findFirst({ where: { id: id } });
    if (!todo) throw new BadRequestException('Invalid id provided!');
    return await this.prisma.todo.findFirst({ where: { id } });
  }

  async update(id: string, payload: UpdateTodoDto) {
    const todo = await this.findOne(id);
    if (!todo) {
      throw new BadRequestException('Todo not found');
    }
    const updatedTodo = await this.prisma.todo.update({
      where: { id: id },
      data: {
        title: payload.title,
        description: payload.description,
        deadline: payload.deadline,
        importance: payload.importance,
        isCompleted: payload.isCompleted,
      },
    });
    return updatedTodo;
  }

  async remove(id: string) {
    const todo = await this.findOne(id);
    if (!todo) {
      throw new BadRequestException('Todo not found');
    }
    const deletedTodo = await this.prisma.todo.delete({ where: { id: id } });
    return deletedTodo;
  }
}
