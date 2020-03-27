import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { TasksStatus } from './task-status-enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksStatusValidationPipe } from './pipes/tasks-status-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService){}

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
        @GetUser() user: User,
    
    ): Promise<Task[]> {
        return this.tasksService.getTasks(filterDto, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,
        )
        : Promise<Task> {
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
        ) : Promise <Task>{
        return this.tasksService.getTaskById(id, user);
    }
    @Delete('/:id')
    deleteTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
        ){
        return this.tasksService.deleteTaskById(id, user);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TasksStatusValidationPipe) status: TasksStatus,
        @GetUser() user: User
        ) : Promise<Task>
    {
        return this.tasksService.updateTaskStatus(id, status, user);
    }
   
}
