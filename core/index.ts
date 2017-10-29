/**
 * Created by tushar on 25/10/17.
 */

import {DBNode} from './lib/db-nodes'
import {readHead} from './lib/head'
import {commit} from './lib/commit'
import {catDataNode} from './lib/cat-node'
import {logSlice} from './lib/log-slice'

export class YoDb {
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
    return logSlice(this.dir, {start, end})
  }
}
