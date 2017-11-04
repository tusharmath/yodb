/**
 * Created by tushar on 04/11/17.
 */
import {Block} from "./block";
import * as path from './path-utils'
import * as fs from 'fs-extra'


export const write = async (dir: string, buffer: Buffer): Promise<string> => {
  const block = new Block(buffer)
  const digest = block.digest();
  const loc = path.digest(dir, digest)
  await fs.ensureFile(loc)
  await fs.writeFile(loc, block.data)
  return digest
}
