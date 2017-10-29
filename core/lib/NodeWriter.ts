/**
 * Created by tushar on 29/10/17.
 */

import * as fs from 'fs-extra'
import * as paths from './Paths'
import {DBNode} from "./DBNode";


/**
 * Save a dbNode and saves it on the disk
 * @param {string} dir
 * @param {DBNode} node
 * @return {Promise<string>}
 */
export const writeNode = async (dir: string, node: DBNode) => {
  const hash = node.digest();
  const file = paths.hash(dir, hash);
  await fs.ensureFile(file)
  await fs.writeFile(file, node.toBuffer())
  return hash
}
