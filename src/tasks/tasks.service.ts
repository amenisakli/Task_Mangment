import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Repository } from 'typeorm';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>
  ) { }
  async getTasks(filterDto: GetTaskFilterDto,user:User): Promise<Task[]> {
    const queryBuilder = this.taskRepository.createQueryBuilder('task')
   queryBuilder.where('task.userId = :userId',{userId:user.id});
    if (filterDto.status) {
      queryBuilder.andWhere('task.status = :status', { status: filterDto.status });
    }
    if (filterDto.search) {
      queryBuilder.andWhere('task.title LIKE :search OR task.description LIKE :search ', { search: `%${filterDto.search}%` });
    }
    const tasks = await queryBuilder.getMany();
    return tasks;
  }
  async getTaskById(id: number,user:User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id , userId:user.id } })
    if (!found) {
      throw new NotFoundException(`Task is not found with Id "${id}"`)
    }
    return found
  }
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      status: TaskStatus.OPEN,
      user: user
    });
    return this.taskRepository.save(task); // Changed from tasks to task
  }
  
  async deleteTask(id: number,user:User): Promise<void> {
    const result = await this.taskRepository.delete({id , userId:user.id})
  }
  async updateTask(id: number, status: TaskStatus,user:User): Promise<Task> {
    const task = await this.getTaskById(id,user)
    task.status = status
    return this.taskRepository.save(task)
  }
}


