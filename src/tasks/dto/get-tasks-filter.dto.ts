import { IsIn, IsNotEmpty, IsOptional } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class GetTaskFilterDto{
    @IsOptional()
    @IsIn([TaskStatus.DONE,TaskStatus.OPEN,TaskStatus.IN_PROGRES])
    status:TaskStatus;
    @IsOptional()
    @IsNotEmpty()
    search:string
}