import { Sequelize } from 'sequelize';
import logger from './logger';

const sequelize = new Sequelize(
  process.env.DB_NAME || '',
  process.env.DB_USER || '',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
    logging: false
  }
);

export const connectToDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected successfully');
    await sequelize.sync({ alter: true }); 
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export default sequelize;
