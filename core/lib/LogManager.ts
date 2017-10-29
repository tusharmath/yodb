/**
 * Created by tushar on 25/10/17.
 */

import * as fs from 'fs-extra'
import {Node} from './Node'
import {ROOT_NODE} from './RootNode'
import {DataNode} from './DataNode'
import * as path from './Paths'

export class LogManager {
  private isLocked = false
  constructor(private dir: string) {}

  async commit<T>(message: T): Promise<string> {
    this.assertLock()
    this.lock()
    const head = await this.head()
    const log = new DataNode(head, message)
    const hash = log.digest()
    const file = path.hash(this.dir, hash)
    await Promise.all([fs.ensureFile(file), fs.ensureFile(path.head(this.dir))])
    await Promise.all([
      fs.writeFile(file, log.toBuffer()),
      fs.writeFile(path.head(this.dir), hash)
    ])
    this.unlock()
    return hash
  }

  private lock() {
    fs.ensureFileSync(path.lock(this.dir))
    this.isLocked = true
  }

  private unlock() {
    fs.unlinkSync(path.lock(this.dir))
    this.isLocked = false
  }

  private assertLock() {
    if (this.isLocked) {
      throw new TypeError('Only one commit at a time can be made')
    }
  }

  async head(): Promise<string> {
    try {
      const buffer = await fs.readFile(path.head(this.dir))
      return buffer.toString()
    } catch (e) {
      return ROOT_NODE
    }
  }

  async catHash(hash: string): Promise<Node> {
    const buffer = await fs.readFile(path.hash(this.dir, hash))
    return DataNode.fromBuffer(buffer)
  }

  async logs(start: number, end: number) {
    const data = []
    let head = await this.head()
    let i = 0
    while (i <= end && head !== ROOT_NODE) {
      const log = await this.catHash(head)
      if (i >= start && i < end) data.push(head)
      head = log.parent
      i++
    }
    return data
  }
}
