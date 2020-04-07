import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Db, MongoClient } from 'mongodb';

@Injectable()
export class MongodbService implements OnApplicationShutdown {
  private mongodbUri: string;
  private mongoClient: Promise<MongoClient>;

  constructor(configService: ConfigService) {
    this.mongodbUri = configService.get<string>('MONGODB_URI');
  }

  static dbProvider = {
    provide: Db,
    useFactory: async (mongodbService: MongodbService) => {
      return mongodbService.db();
    },
    inject: [MongodbService],
  };

  getMongoClient(): Promise<MongoClient> {
    if (this.mongoClient) {
      return this.mongoClient;
    }
    this.mongoClient = new MongoClient(this.mongodbUri, { useUnifiedTopology: true }).connect();
    return this.mongoClient;
  }

  db(): Promise<Db> {
    return this.getMongoClient().then((c) => c.db());
  }

  onApplicationShutdown(): any {
    if (this.mongoClient) {
      this.mongoClient.then((c) => c.close());
    }
  }
}
