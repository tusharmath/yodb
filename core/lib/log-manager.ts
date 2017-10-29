/**
 * Created by tushar on 25/10/17.
 */

import * as fs from 'fs-extra'
import {DataNode, DBNode} from './db-nodes'
import {ROOT_NODE} from './root-node'
import * as path from './file-paths'
import {writeNode} from './node-writer'
import {getLock, releaseLock} from './db-lock'

export class LogManager {
  constructor(private dir: string) {}

  async commit<T>(message: T): Promise<string> {
    getLock(this.dir)
    const node = new DataNode(await this.head(), message)
    const hash = await writeNode(this.dir, node)
    await fs.ensureFile(path.head(this.dir))
    await fs.writeFile(path.head(this.dir), hash)
    releaseLock(this.dir)
    return hash
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
