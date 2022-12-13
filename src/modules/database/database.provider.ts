import * as mongoose from 'mongoose';
import { env } from 'process';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(
        'mongodb+srv://hamzahashmioffice:Hashmi.007@nestjs-boilerplate.cmu9sib.mongodb.net/?retryWrites=true&w=majority',
      ),
  },
];
