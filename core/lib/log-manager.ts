/**
 * Created by tushar on 25/10/17.
 */

import {DBNode} from './db-nodes'
import {ROOT_NODE} from './root-node'
import {readHead} from './head'
import {commit} from './commit'
import {catDataNode} from './cat-node'

export class LogManager {
  constructor(private dir: string) {}

  async commit<T>(message: T): Promise<string> {
    return await commit(this.dir, message)
  }

  head() {
    return readHead(this.dir)
  }

  async catHash(hash: string): Promise<DBNode> {
    return await catDataNode(this.dir, hash)
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
