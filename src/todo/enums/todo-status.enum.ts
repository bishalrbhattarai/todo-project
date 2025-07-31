import { registerEnumType } from '@nestjs/graphql';

export enum TodoStatusEnum {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(TodoStatusEnum, {
  name: 'TodoStatusEnum',
  description: 'The status of a todo item',
});
