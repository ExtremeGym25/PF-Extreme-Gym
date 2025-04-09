import { config as dotenvConfig } from 'dotenv';
import { registerAs } from '@nestjs/config';

dotenvConfig({ path: '.env' });
const config = {
  type: 'postgres',
  host: `${process.env.DB_HOST}` || 'postgresdb',
  username: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  port: `${process.env.DB_PORT}`,
  entities: ['dist/**/*.entity{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: true,
  //dropSchema: true,
};

export default registerAs('typeorm', () => config);
