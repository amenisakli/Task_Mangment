import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';


@Injectable()
export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatus = [
    TaskStatus.DONE,
    TaskStatus.IN_PROGRES,
    TaskStatus.OPEN,
  ];

  transform(value: any) {
    if (!this.isStatusValid(value)) {
      throw new BadRequestException('Statut de tâche non valide.');
    }
    return value;
  }

  private isStatusValid(status: any) {
    return this.allowedStatus.includes(status);
  }
}
