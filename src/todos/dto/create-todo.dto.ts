import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Status } from '@prisma/client';

export class CreateTodoDto {
  @ApiProperty({
    example: 'Complete homework',
    description: 'The title of the todo item',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Finish the math assignment by Friday',
    description: 'A brief description of the todo item',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: '2024-08-30T23:59:59.000Z',
    description: 'The deadline for completing the todo item',
  })
  @IsDateString()
  deadline: string;

  @ApiProperty({
    example: 'HIGH',
    description: 'The importance level of the todo item',
  })
  @IsEnum(Status)
  @IsNotEmpty()
  importance: Status;

  @ApiProperty({
    example: '12345',
    description: 'The ID of the user who owns the todo item',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: false,
    description: 'Whether the todo item has been completed',
  })
  @IsBoolean()
  isCompleted: boolean;
}
