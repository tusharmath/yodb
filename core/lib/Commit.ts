/**
 * Created by tushar on 24/10/17.
 */

import * as crypto from 'crypto'
import pad = require('pad')

export const MAX_LOG_SIZE = 10 * 1024 // 10kb
export const MAX_LOG_HEADER_SIZE = 512 // 512byte
const HASH_ALGORITHM = 'md5'

export type LogHeader = {
  size: number
  parent: string
}


export class Commit<T> {
  constructor(readonly content: T, private parent: string) {}

  private getContentBuffer() {
    const buffer = new Buffer(JSON.stringify(this.content))
    if (buffer.length > MAX_LOG_SIZE - MAX_LOG_HEADER_SIZE) {
      throw Error(
        `Message is longer than allowed limit of ${MAX_LOG_SIZE} bytes`
      )
    }
    return buffer
  }

  digest() {
    const hash = crypto.createHash(HASH_ALGORITHM)
    hash.update(JSON.stringify(this.content) + this.parent)
    return hash.digest().toString('hex')
  }

  static fromBuffer<T>(buffer: Buffer) {
    const {size, parent} = JSON.parse(
      buffer.slice(0, MAX_LOG_HEADER_SIZE).toString('utf-8')
    ) as LogHeader
    const start = MAX_LOG_HEADER_SIZE
    const data = buffer.slice(start, start + size).toString('utf-8')
    return new Commit<T>(JSON.parse(data), parent)
  }

  header(): LogHeader {
    return {
      size: this.getContentBuffer().length,
      parent: this.parent
    }
  }

  toBuffer() {
    // header
    const header = pad(JSON.stringify(this.header()), MAX_LOG_HEADER_SIZE)
    const headerBuffer = new Buffer(MAX_LOG_HEADER_SIZE)
    headerBuffer.write(header, 0, MAX_LOG_HEADER_SIZE, 'utf-8')

    // data
    return Buffer.concat([headerBuffer, this.getContentBuffer()])
  }
}