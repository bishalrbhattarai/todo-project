import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TodoStatusEnum } from '../enums/todo-status.enum';

@Schema({
  timestamps: true,
})
export class Todo {
  @Prop()
  title: string;

  @Prop({
    type: String,
    enum: Object.values(TodoStatusEnum),
    default: TodoStatusEnum.PENDING,
  })
  status: TodoStatusEnum;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: string;
}

export type TodoDocument = Todo & Document;
export const TodoSchema = SchemaFactory.createForClass(Todo);
