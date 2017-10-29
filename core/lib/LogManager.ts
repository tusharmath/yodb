/**
 * Created by tushar on 25/10/17.
 */

import * as fs from 'fs-extra'
import {Commit} from './Commit'
import * as path from 'path'
import {dirName, fileName, jtobuf} from './Utility'

export const ROOT_ENTRY = [
  ['0000', '0000', '0000', '0000'].join(''),
  ['0000', '0000', '0000', '0000'].join('')
].join('')

export class LogManager {
  private isLocked = false
  constructor(private dir: string) {}

  async commit<T>(message: T): Promise<string> {
    this.assertLock()
    this.lock()
    const head = await this.head()
    const log = new Commit(head, jtobuf(message))
    const hash = log.digest()
    const file = this.objectPath(hash)
    await fs.ensureFile(file)
    await fs.ensureFile(this.headPath())
    await fs.writeFile(file, log.toBuffer())
    await fs.writeFile(this.headPath(), hash)
    this.unlock()
    return hash
  }

  private lock() {
    fs.ensureFileSync(this.lockPath())
    this.isLocked = true
  }

  private unlock() {
    fs.unlinkSync(this.lockPath())
    this.isLocked = false
  }

  private assertLock() {
    if (this.isLocked) {
      throw new TypeError('Only one commit at a time can be made')
    }
  }

  private objectPath(hash: string): string {
    return path.resolve(this.dir, 'objects', dirName(hash), fileName(hash))
  }

  private headPath(): string {
    return path.resolve(this.dir, 'refs', 'HEAD')
  }

  private lockPath(): string {
    return path.resolve(this.dir, 'LOCK')
  }

  async head(): Promise<string> {
    try {
      const buffer = await fs.readFile(this.headPath())
      return buffer.toString()
    } catch (e) {
      return ROOT_ENTRY
    }
  }

  async catHash(hash: string): Promise<Commit> {
    const buffer = await fs.readFile(this.objectPath(hash))
    return Commit.fromBuffer(buffer)
  }

  async logs(start: number, end: number) {
    const data = []
    let head = await this.head()
    let i = 0
    while (i <= end && head !== ROOT_ENTRY) {
      const log = await this.catHash(head)
      if (i >= start && i < end) data.push(head)
      head = log.parent
      i++
    }
    return data
  }
}
