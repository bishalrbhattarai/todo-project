import { InputType } from '@nestjs/graphql';
import { OffsetPaginationInput } from 'src/common/dtos/inputs/offset-pagination.input';

@InputType()
export class GetUsersInput extends OffsetPaginationInput {}
