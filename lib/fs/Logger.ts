/**
 * Created by tushar on 24/10/17.
 */

import * as fs from 'fs-extra'
import {FileManager} from './FileManager'

export interface Logger {
  append(data: Buffer): Promise<number>
  read(position: number, length: number): Promise<Buffer>
}

export class FileLogger extends FileManager implements Logger {
  private writePosition: number

  constructor(path: string) {
    super(path, 'w+')
  }

  async open() {
    await super.open()
    const {size} = await this.stat()
    this.writePosition = size
    return this
  }

  static async create(file: string) {
    const logger = new FileLogger(file)
    return await logger.open()
  }

  async append(data: Buffer) {
    const position = this.writePosition
    this.writePosition += data.length
    await fs.appendFile(this.getFD(), data)
    return position
  }

  async read(position: number, length: number): Promise<Buffer> {
    const buff = new Buffer(length)
    const {buffer} = await fs.read(
      this.getFD(),
      buff,
      0,
      buff.length,
      position
    )
    return buffer
  }
}
