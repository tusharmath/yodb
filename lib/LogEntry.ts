/**
 * Created by tushar on 24/10/17.
 */

import * as crypto from 'crypto'
import pad = require('pad')
export const MAX_LOG_SIZE = 10 * 1024 // 10kb
export const MAX_LOG_HEADER_SIZE = 512 // 512byte

export type LogHeader = {
  size: number
  parent: string
}

export const ROOT_ENTRY = '<--###ROOT#ENTRY###-->'

export class LogEntry {
  readonly digest: string

  constructor(readonly data: Buffer, private parent: string) {
    if (data.length > MAX_LOG_SIZE - MAX_LOG_HEADER_SIZE) {
      throw Error(
        `Message is longer than allowed limit of ${MAX_LOG_SIZE} bytes`
      )
    }

    const hash = crypto.createHash('sha256')
    hash.update(data)
    this.digest = hash.digest().toString('hex')
  }

  static fromBuffer(buffer: Buffer) {
    const {size, parent} = JSON.parse(
      buffer.slice(0, MAX_LOG_HEADER_SIZE).toString('utf-8')
    ) as LogHeader
    const start = MAX_LOG_HEADER_SIZE
    const data = buffer.slice(start, start + size)
    return new LogEntry(data, parent)
  }

  header(): LogHeader {
    return {
      size: this.data.length,
      parent: this.parent
    }
  }

  toBuffer() {
    // header
    const header = pad(JSON.stringify(this.header()), MAX_LOG_HEADER_SIZE)
    const headerBuffer = new Buffer(MAX_LOG_HEADER_SIZE)
    headerBuffer.write(header, 0, MAX_LOG_HEADER_SIZE, 'utf-8')

    // data
    const dataBuffer = new Buffer(this.data)
    return Buffer.concat([headerBuffer, dataBuffer])
  }
}
