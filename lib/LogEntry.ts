/**
 * Created by tushar on 24/10/17.
 */

import pad = require('pad')
export const MAX_LOG_SIZE = 10 * 1024 // 10kb
export const MAX_LOG_HEADER_SIZE = 512 // 512byte

export type LogHeader = {
  size: number
  tail?: number
}
export class LogEntry {
  constructor(readonly data: Buffer, private tailLogEntry?: number) {
    if (data.length > MAX_LOG_SIZE - MAX_LOG_HEADER_SIZE) {
      throw Error(
        `Message is longer than allowed limit of ${MAX_LOG_SIZE} bytes`
      )
    }
  }

  static fromBuffer(buffer: Buffer) {
    const {size} = JSON.parse(
      buffer.slice(0, MAX_LOG_HEADER_SIZE).toString('utf-8')
    )
    const start = MAX_LOG_HEADER_SIZE
    const data = buffer.slice(start, start + size)
    return new LogEntry(data)
  }

  header(): LogHeader {
    return {
      size: this.data.length,
      tail: this.tailLogEntry
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
