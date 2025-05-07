import { TypeORMError } from 'typeorm'
import { AppDataSource } from '../database/data-source'
import { User } from '../entity/User'
import { createPasswordHash } from '../utils/bcrypt'
import { Conversation } from '../entity/Conversations'
class UserService {
  async find(index: string) {
    // Find One User
    try {
      const user = await AppDataSource.getRepository(User).findOne({
        where: {
          id: index,
        },
      })
      return user
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new Error('Error finding user: ' + error.message)
      } else if (error instanceof Error) {
        throw new Error('Error finding User: ' + error?.message)
      } else {
        throw new Error('Error finding User: ' + error)
      }
    }
  }
  // Create User
  async create(
    username: string,
    email: string,
    password: string,
    displayName?: string,
    avatarUrl?: string
  ) {
    try {
      if (!displayName) {
        displayName = username
      }
      const passwordHash = await createPasswordHash(password)
      const user = new User()
      user.username = username
      user.email = email
      user.displayName = displayName
      user.passwordHash = passwordHash
      if (avatarUrl) {
        user.avatarUrl = avatarUrl
      }
      const savedUser = await AppDataSource.getRepository(User).save(user)
      return savedUser
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new Error('Error creating user: ' + error.message)
      } else if (error instanceof Error) {
        throw new Error('Error creating user: ' + error.message)
      } else {
        throw new Error('Error creating user: ' + error)
      }
    }
  }

  async findThreads(userId: string, limit: number = 20, offset: number = 0) {
    try {
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id: userId },
        relations: ['threads', 'threads.thread'],
        order: {
          updatedAt: 'DESC',
        },
      })

      const threads = await AppDataSource.createQueryBuilder(
        Conversation,
        'thread'
      )
        .innerJoin(
          'thread.participants',
          'filterTp',
          'filterTp.user_id = :userId',
          { userId }
        )
        .leftJoinAndSelect('thread.participants', 'tp')
        .leftJoinAndSelect('tp.user', 'participantUser')
        .leftJoinAndSelect('thread.createdBy', 'creator')
        .orderBy('thread.updated_at', 'DESC')
        .limit(limit)
        .offset(offset)
        .getMany()

      return threads
    } catch (error) {}
  }
}

export default new UserService()
