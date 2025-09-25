import { Transform } from 'class-transformer';
import { ObjectId } from 'mongodb';

export function TransformObjectId() {
  return Transform(({ value }) => {
    if (value instanceof ObjectId) {
      return value;
    }

    if (typeof value === 'string' || value?._bsontype === 'ObjectID') {
      return new ObjectId(value);
    }
    return value;
  });
}
