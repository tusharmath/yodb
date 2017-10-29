/**
 * Created by tushar on 25/10/17.
 */

import * as fs from 'fs-extra'
import {DataNode, DBNode} from './db-nodes'
import {ROOT_NODE} from './root-node'
import * as path from './file-paths'
import {readHead} from './head'
import {commit} from './commit'

export class LogManager {
  constructor(private dir: string) {}

  async commit<T>(message: T): Promise<string> {
    return await commit(this.dir, message)
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
