// Thread is the anonymous of Conversation
import { Conversation } from '../entity/Conversations'
import { AppDataSource } from '../database/data-source'
import { Thread_Types } from '../database/Enums'
import { User } from '../entity/User'
import UserService from './User.service'
import { TypeORMError } from 'typeorm'
import { Message } from '../entity/Message'
import handleTypeOrmError from '../utils/handleTypeOrmError'
import { ThreadParticipant } from '../entity/ThreadParticipants'
class ThreadService {
  async find(threadId: string) {
    try {
      const thread = await AppDataSource.getRepository(Conversation).findOne({
        where: { id: threadId },
      })
      return thread
    } catch (error) {
      handleTypeOrmError(error, 'Error finding thread')
    }
  }

  async create(name: string, type: Thread_Types, createdBy: User) {
    try {
      const thread = new Conversation()
      thread.name = name
      thread.type = type
      thread.createdBy = createdBy

      const savedThread = await AppDataSource.getRepository(Conversation).save(
        thread
      )

      const threadParticipant = new ThreadParticipant()
      threadParticipant.thread = savedThread
      threadParticipant.user = createdBy

      await AppDataSource.getRepository(ThreadParticipant).save(
        threadParticipant
      )

      return savedThread
    } catch (error) {
      handleTypeOrmError(error, 'Error creating thread')
    }
  }

  async findUsers(threadId: string) {
    try {
      const thread = await AppDataSource.getRepository(Conversation).findOne({
        where: { id: threadId },
        relations: ['participants', 'participants.user'],
      })
      if (!thread) throw new Error('Thread not found')
      return thread.participants?.map((tp) => tp.user)
    } catch (error) {
      handleTypeOrmError(error, 'Error finding Users of Thread')
    }
  }

  // Find All Messages

  async findMessages(threadId: string, limit: number = 50, offset: number = 0) {
    try {
      const messages = AppDataSource.createQueryBuilder(Message, 'message')
        .innerJoin('message.thread', 'thread', 'thread.id = :threadId', {
          threadId,
        })
        .leftJoinAndSelect('message.sender', 'sender')
        .leftJoinAndSelect('message.attachments', 'attachments')
        .leftJoinAndSelect('message.reactions', 'reactions')
        .leftJoinAndSelect('reactions.user', 'reactionUser')
        .orderBy('message.createdAt', 'DESC')
        .limit(limit)
        .offset(offset)
        .getMany()

      return messages
    } catch (error) {
      handleTypeOrmError(error, 'Error finding Messages of Thread')
    }
  }

  // Add User to thread

  async addUserToThread(threadId: string, userId: string) {
    try {
      const thread = await this.find(threadId)
      if (!thread) throw new Error('Thread not found')
      const userToAdd = await UserService.find(userId)
      if (!userToAdd) throw new Error('User not found')
      const threadParticipant = new ThreadParticipant()
      threadParticipant.thread = thread
      threadParticipant.user = userToAdd
      const savedThreadParticipant = await AppDataSource.getRepository(
        ThreadParticipant
      ).save(threadParticipant)
      return savedThreadParticipant
    } catch (error) {
      handleTypeOrmError(error, 'Error adding User to Thread')
    }
  }
}

export default new ThreadService()
