import { Db } from 'mongodb';
import { MongodbService } from '../src/mongodb/mongodb.service';
import { randomString } from '../src/shared/utils';

export const randomDbProvider = {
  provide: Db,
  useFactory: async (mongodbService: MongodbService) => {
    return mongodbService.getMongoClient().then((c) => c.db('test-' + randomString()));
  },
  inject: [MongodbService],
};
