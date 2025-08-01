import { Module } from '@nestjs/common';
import { TodoResolver } from './todo.resolver';
import { TodoService } from './services/todo.service';
import { TodoRepository } from './repositories/todo.repository';
import { UserModule } from 'src/user/user.module';
import { DatabaseModule } from 'src/common/database/database.module';
import { Todo, TodoSchema } from './schemas/todo.schema';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
    forwardRef(() => UserModule),
  ],
  providers: [TodoResolver, TodoService, TodoRepository],
  exports: [TodoService],
})
export class TodoModule {}
