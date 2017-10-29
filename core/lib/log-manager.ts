/**
 * Created by tushar on 25/10/17.
 */

import * as fs from 'fs-extra'
import {DataNode, DBNode} from './db-nodes'
import {ROOT_NODE} from './root-node'
import * as path from './file-paths'
import {writeNode} from './node-writer'
import {getLock, releaseLock} from './db-lock'
import {readHead, writeHead} from './head'

export class LogManager {
  constructor(private dir: string) {}

  async commit<T>(message: T): Promise<string> {
    const dir = this.dir
    getLock(dir)
    const node = new DataNode(await readHead(dir), message)
    const hash = await writeNode(dir, node)
    await fs.ensureFile(path.head(dir))
    await writeHead(dir, hash)
    releaseLock(dir)
    return hash
  }

  head() {
    return readHead(this.dir)
  }

  async catHash(hash: string): Promise<DBNode> {
    const buffer = await fs.readFile(path.hash(this.dir, hash))
    return DataNode.fromBuffer(buffer)
  }

  async logs(start: number, end: number) {
    const data = []
    const dir = this.dir
    let head = await readHead(dir)
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
