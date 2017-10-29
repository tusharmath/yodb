/**
 * Created by tushar on 25/10/17.
 */

import {DBNode} from './db-nodes'
import {readHead} from './head'
import {commit} from './commit'
import {catDataNode} from './cat-node'
import {logSlice} from './log-slice'
import * as path from './file-paths'
import {Writable} from 'stream'

export class YoDb extends Writable {
  constructor(private dir: string = path.defaultDir()) {
    super()
  }

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
