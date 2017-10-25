/**
 * Created by tushar on 25/10/17.
 */
import * as fs from 'fs-extra'
import {FileManager} from './FileManager'

export class IndexBuffer extends FileManager {
  constructor(file: string) {
    super(file, 'w+')
  }

  static create(file: string) {
    return new IndexBuffer(file)
  }

  async read(length: number): Promise<Buffer> {
    const rBuffer = new Buffer(length)
    const {buffer} = await fs.read(this.getFD(), rBuffer, 0, rBuffer.length, 0)
    return buffer
  }

  async write(buffer: Buffer): Promise<void> {
    await fs.write(this.getFD(), buffer, 0, buffer.length, 0)
  }
}
