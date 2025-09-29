import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.CHECKOUT_DB_HOST || 'checkout-db',
  port: parseInt(process.env.CHECKOUT_DB_PORT || '5432', 10),
  username: process.env.CHECKOUT_DB_USERNAME || 'postgres',
  password: process.env.CHECKOUT_DB_PASSWORD || 'postgres',
  database: process.env.CHECKOUT_DB_NAME || 'checkout_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
};
