/**
 * Created by tushar on 24/10/17.
 */

import * as crypto from 'crypto'
import {Logger} from './Logger'
import {LogEntry, MAX_LOG_SIZE} from './LogEntry'

export const MAX_BITS = 32
export const MAX_TABLE_SIZE = Math.pow(2, MAX_BITS) - 1
export const MAX_HASH_CHARS = MAX_TABLE_SIZE.toString(16).length
export type BufferLike = Buffer | string

export const getTableID = (data: BufferLike) => {
  const hash = crypto.createHash('sha256')
  hash.update(data)
  return parseInt(hash.digest('hex').slice(0, MAX_HASH_CHARS), 16)
}

export class HashTable {
  private index: Array<number>

  constructor(private db: Logger, maxSize: number = MAX_TABLE_SIZE) {
    this.index = new Array(maxSize)
  }

  async insertItem(key: BufferLike, value: BufferLike) {
    const buffer = typeof value === 'string' ? Buffer.from(value) : value
    const id = getTableID(key)
    const log = new LogEntry(buffer)
    this.index[id] = await this.db.append(log.toBuffer())
  }

  async getItem(key: BufferLike): Promise<Buffer> {
    const id = getTableID(key)
    const log = LogEntry.fromBuffer(
      await this.db.read(this.index[id], MAX_LOG_SIZE)
    )
    return log.data
  }
}
