/**
 * Created by tushar on 25/10/17.
 */

import * as fs from 'fs-extra'
import {LogEntry, ROOT_ENTRY} from './LogEntry'
import * as path from 'path'
import {dirName, fileName} from './Utility'

export class LogManager {
  constructor(private dir: string) {}

  async commit<T>(message: T): Promise<string> {
    const head = await this.head()
    const log = new LogEntry(message, head)
    const hash = log.digest()
    const file = this.objectPath(hash)
    await fs.ensureFile(file)
    await fs.writeFile(file, log.toBuffer())
    await fs.writeFile(this.headPath(), hash)
    return hash
  }

  private objectPath(hash: string): string {
    return path.resolve(this.dir, 'objects', dirName(hash), fileName(hash))
  }

  private headPath(): string {
    return path.resolve(this.dir, 'HEAD')
  }

  async head(): Promise<string> {
    try {
      const buffer = await fs.readFile(this.headPath())
      return buffer.toString()
    } catch (e) {
      return ROOT_ENTRY
    }
  }

  async purge() {
    await fs.emptyDir(this.dir)
  }

  async catHash(hash: string): Promise<LogEntry<any>> {
    const buffer = await fs.readFile(this.objectPath(hash))
    return LogEntry.fromBuffer(buffer)
  }

  async logs(start: number, end: number) {
    const data = []
    let head = await this.head()
    let i = 0
    while (i <= end && head !== ROOT_ENTRY) {
      const log = await this.catHash(head)
      if (i >= start && i < end) data.push(head)
      head = log.header().parent
      i++
    }
    return data
  }
}
