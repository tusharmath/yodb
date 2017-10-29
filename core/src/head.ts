/**
 * Created by tushar on 29/10/17.
 */

import * as fs from 'fs-extra'
import * as path from './file-paths'
import {UTF8} from '../encodings'
import {ROOT_NODE} from './root-node'

export const readHead = async (dir: string): Promise<string> => {
  try {
    const buffer = await fs.readFile(path.head(dir))
    return buffer.toString(UTF8)
  } catch (e) {
    return ROOT_NODE
  }
}

export const writeHead = async (dir: string, hash: string) => {
  await fs.writeFile(path.head(dir), hash)
}
