/**
 * Created by tushar on 04/11/17.
 */

import * as fs from 'fs-extra'
import * as path from './path-utils'

export const read = async (dir: string, digest: string): Promise<Buffer> => {
  const loc = path.digest(dir, digest)
  return await fs.readFile(loc)
}
