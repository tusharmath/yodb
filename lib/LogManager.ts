/**
 * Created by tushar on 25/10/17.
 */

import * as fs from 'fs-extra'
import {LogEntry, ROOT_ENTRY} from './LogEntry'
import * as path from 'path'

export class LogManager {
  constructor(private dir: string) {}
  async commit<T>(message: T) {
    const log = new LogEntry(message, await this.head())
    const file = this.objectPath(log)
    await fs.ensureFile(file)
    await fs.writeFile(file, log.toBuffer())
    await fs.writeFile(this.headPath(), log.digest())
    return log.digest()
  }

  private objectPath(log: LogEntry<any>) {
    return path.resolve(this.dir, 'objects', log.dir(), log.file())
  }

  private headPath() {
    return path.resolve(this.dir, 'head')
  }

  async head() {
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
}
