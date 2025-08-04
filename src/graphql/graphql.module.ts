import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { GraphQLError } from 'graphql';
import { Request } from 'express';
import { UserType } from 'src/user/types/user.type';

export interface ExtendedRequest extends Request {
  user: UserType;
}
export interface GqlContext {
  req: ExtendedRequest;
  res: Response;
}

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      subscriptions: {
        'graphql-ws': true,
      },
      context: ({ req, res }): GqlContext => ({ req, res }),
      formatError: (error: GraphQLError) => {
        return {
          message: error.message,
          locations: error.locations,
          path: error.path,
          code: error.extensions?.code,
          details: error.extensions?.originalError || [],
        };
      },
    }),
  ],
})
export class GraphqlModule {}
