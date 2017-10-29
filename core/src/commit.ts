/**
 * Created by tushar on 29/10/17.
 */
import {getLock, releaseLock} from './db-lock'
import {DataNode} from './db-nodes'
import {readHead, writeHead} from './head'
import {writeNode} from './node-writer'
import * as fs from 'fs-extra'
import * as path from './file-paths'

export const commit = async <T>(dir: string, message: T) => {
  getLock(dir)
  const node = new DataNode(await readHead(dir), message)
  const hash = await writeNode(dir, node)
  await fs.ensureFile(path.head(dir))
  await writeHead(dir, hash)
  releaseLock(dir)
  return hash
}
