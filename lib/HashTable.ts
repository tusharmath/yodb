/**
 * Created by tushar on 24/10/17.
 */

import * as crypto from 'crypto'

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
  private table = new Array(MAX_TABLE_SIZE)
  async insertItem(key: BufferLike, value: BufferLike) {
    const id = getTableID(key)
    this.table[id] = value
    return key
  }

  async getItem(key: BufferLike) {
    const id = getTableID(key)
    return this.table[id]
  }
}
