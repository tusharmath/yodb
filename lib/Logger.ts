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

  static async create(file: string) {
    const logger = new FileLogger(file)
    await logger.open()
    return logger
  }

  async close() {
    this.getFD()
    await fs.close(this.getFD())
    this.isOpened = false
  }

  async append(data: Buffer) {
    const position = this.writePosition
    this.writePosition += data.length
    await fs.appendFile(this.getFD(), data)
    return position
  }

  private getFD() {
    if (this.isOpened === false) {
      throw Error('Logger needs to be opened first')
    }
    return this.fd
  }

  async read(position: number, length: number): Promise<Buffer> {
    const buff = new Buffer(length)
    const {buffer} = await fs.read(this.getFD(), buff, 0, buff.length, position)
    return buffer
  }

  async purge() {
    if (this.isOpened) await this.close()
    if (await fs.pathExists(this.file)) await fs.unlink(this.file)
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
