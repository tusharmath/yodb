/**
 * Created by tushar on 29/10/17.
 */

import * as path from './file-paths'
import * as fs from 'fs-extra'

export const getLock = (dir: string) => {
  const lockFile = path.lock(dir)
  if (fs.existsSync(lockFile)) {
    throw new TypeError('Only one commit at a time can be made')
  }
  fs.ensureFileSync(lockFile)
}

export const releaseLock = (dir: string) => {
  fs.unlinkSync(path.lock(dir))
}
