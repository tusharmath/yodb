/**
 * Created by tushar on 24/10/17.
 */

import * as fs from 'fs-extra'

export interface Logger {
  append(data: Buffer): Promise<number>
  read(position: number, length: number): Promise<Buffer>
}

export class FileLogger implements Logger {
  private fd: number
  private isOpened = false
  private writePosition: number

  constructor(private file: string) {}

  async open() {
    this.fd = await fs.open(this.file, 'w+')
    this.isOpened = true
    const {size} = await fs.stat(this.file)
    this.writePosition = size
  }

  async close() {
    this.assertOpen()
    await fs.close(this.fd)
    this.isOpened = false
  }

  async append(data: Buffer) {
    this.assertOpen()
    const position = this.writePosition
    this.writePosition += data.length
    await fs.appendFile(this.fd, data)
    return position
  }

  private assertOpen() {
    if (this.isOpened === false) {
      throw Error('Logger needs to be opened first')
    }
  }

  async read(position: number, length: number): Promise<Buffer> {
    this.assertOpen()
    const buff = new Buffer(length)
    const {buffer} = await fs.read(this.fd, buff, 0, buff.length, position)
    return buffer
  }
}

export class MemoryLogger implements Logger {
  private list: Array<Buffer> = []
  append(data: Buffer): Promise<number> {
    this.list.push(data)
    return Promise.resolve(this.list.length - 1)
  }

  read(position: number): Promise<Buffer> {
    return Promise.resolve(this.list[position])
  }
}
