/**
 * Created by tushar on 29/10/17.
 */

import * as path from './file-paths'
import * as fs from 'fs-extra'
import {DataNode} from './db-nodes'

export const catDataNode = async (dir: string, hash: string) => {
  const buffer = await fs.readFile(path.hash(dir, hash))
  return DataNode.fromBuffer(buffer)
}
