import { Column, Entity ,OneToMany,PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from 'bcrypt'
import { Task } from "src/tasks/task.entity";

@Entity()
@Unique(['username'])

export class User{
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    username:string
    @Column()
    password:string
    
    @OneToMany(type =>Task,task => task.user,{eager:true})
    tasks:Task[]

}