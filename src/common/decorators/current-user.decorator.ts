import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlContext } from 'src/graphql/graphql.module';
import { UserType } from 'src/user/types/user.type';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserType => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext<GqlContext>().req;
    return request.user as UserType;
  },
);
