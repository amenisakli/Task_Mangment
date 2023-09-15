import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipe/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorators';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) { }
  @Get()
  async getTasks(
    @Query() filterDto: GetTaskFilterDto,
    @GetUser() user: User
  ) {
    const tasks = await this.tasksService.getTasks(filterDto, user);
    return tasks;
  }
  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTasDto: CreateTaskDto,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.createTask(createTasDto, user)
  }
  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user)
  }
  @Delete('/:id')
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user:User
  ): Promise<void> {
    return this.tasksService.deleteTask(id,user)
  }
  @Patch('/:id/status')
  @UsePipes(ValidationPipe)
  updateTask(
    @Param('id',ParseIntPipe) id:number,
    @Body('status' , TaskStatusValidationPipe)status:TaskStatus,
    @GetUser() user:User): Promise<Task> {
    return this.tasksService.updateTask(id,status,user)
  }
}
