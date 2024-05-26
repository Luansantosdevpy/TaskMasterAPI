import 'reflect-metadata';
import express from 'express';
import { Server } from 'http';
import Logger from './utils/logs/Logger';
import dbConfig from './config/db';
import mongoose from 'mongoose';

export default class App {
  public express: express.Application = express();

  private server: Server;

  public initialize = async (): Promise<void> => {
    await this.connectToMongoDB();
    await this.middlewares();
  };

  public start = (port: number, appName: string): void => {
    this.server = this.express.listen(port, '0.0.0.0', () => {
      Logger.info(`${appName} listening on port ${port}!`);
    });
  };

  public stop = (): void => {
    this.server.close();
  };

  private middlewares = async (): Promise<void> => {
    this.express.use(express.json());
  };

  private async connectToMongoDB(): Promise<void> {
    try {
      const { uri, options } = dbConfig;
      await mongoose.connect(uri, options);
      Logger.info('Connected to MongoDB');
    } catch (error) {
      Logger.error('Error connecting to MongoDB:', error);
      process.exit(1);
    }
  }
}
