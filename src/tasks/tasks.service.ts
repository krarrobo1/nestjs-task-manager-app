import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksStatus } from './task-status-enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {}
    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise <Task[]>{
        return this.taskRepository.getTasks(filterDto, user);
    }

    async createTask(
        createTaskDto: CreateTaskDto, 
        user: User,
        )
        : Promise<Task> {
       return await this.taskRepository.createTask(createTaskDto, user);
    }

    async getTaskById(id: number, user: User): Promise<Task> {
       const found = await this.taskRepository.findOne({where: { id, userId: user.id }});
       if(!found) throw new NotFoundException(`Task with ID ${id} not found`);
       return found;
    }

    async deleteTaskById(id: number, user: User): Promise<void> {
        let result = await this.taskRepository.delete({ id, userId: user.id });
        if(result.affected === 0) throw new NotFoundException(`Task with ID ${id} not found`)
    }

    async updateTaskStatus(id: number, status: TasksStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();
        return task;
    }
}