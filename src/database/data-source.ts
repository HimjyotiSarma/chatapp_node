import 'reflect-metadata'
import { DataSource } from 'typeorm'
// Import all your entities here

export const AppDataSource = new DataSource({
  type: 'postgres', // Your database type (e.g., postgres, mysql)
  host: 'localhost',
  port: 5432,
  username: 'test',
  password: 'test',
  database: 'test_db',
  synchronize: true, // Set to false in production
  logging: true,
  entities: ['src/entity/**/*.ts'], // Path to your entities
  migrations: ['src/database/migrations/**/*.ts'], // Path to your migrations
  subscribers: [],
})
