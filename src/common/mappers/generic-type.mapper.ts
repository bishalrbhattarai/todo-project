import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';

export function convertToGraphQLType<T>(
  document: Document,
  type: new () => T,
): T {
  console.log("Each Document");
  console.log(document);
  const docObject = document.toObject();

  if (docObject._id) {
    docObject.id = docObject._id.toString();
    delete docObject._id;
  }

  return plainToInstance(type, docObject, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });
}
