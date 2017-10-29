/**
 * Created by tushar on 29/10/17.
 */

import * as path from 'path'
import {dirName, fileName} from './utils'

export const hash = (dir: string, hash: string) =>
  path.resolve(dir, 'objects', dirName(hash), fileName(hash))
export const head = (dir: string) => path.resolve(dir, 'refs', 'HEAD')
export const lock = (dir: string) => path.resolve(dir, 'LOCK')
export const defaultDir = () => path.resolve(process.cwd(), '.yodb')
