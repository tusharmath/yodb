/**
 * Created by tushar on 25/10/17.
 */

import * as fs from 'fs-extra'
import {DBNode} from './DBNode'
import {ROOT_NODE} from './RootNode'
import {DataNode} from './DataNode'
import * as path from './Paths'
import {writeNode} from "./NodeWriter";

export class LogManager {
  private isLocked = false
  constructor(private dir: string) {}

  async commit<T>(message: T): Promise<string> {
    this.assertLock()
    this.lock()
    const node = new DataNode(await this.head(), message)
    const hash = await writeNode(this.dir, node)
    await fs.ensureFile(path.head(this.dir))
    await fs.writeFile(path.head(this.dir), hash)
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

  async catHash(hash: string): Promise<DBNode> {
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
