import { PipeTransform, BadRequestException } from "@nestjs/common";
import { TasksStatus } from '../task-status-enum';

export class TasksStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        TasksStatus.OPEN,
        TasksStatus.DONE,
        TasksStatus.IN_PROGRESS
    ];

    transform(value: any) {
        value = value.toUpperCase();
        if (!this.isStatusValid(value)) throw new BadRequestException(`${value} is an invalid status`);
        return value;
    };

    private isStatusValid(status: any) {
        const idx = this.allowedStatuses.indexOf(status);
        return idx !== -1;
    };

}