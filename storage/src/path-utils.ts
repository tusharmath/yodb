/**
 * Created by tushar on 29/10/17.
 */

import * as path from 'path'

const fileName = (hash: string) => hash.slice(2)
const dirName = (hash: string) => hash.slice(0, 2)

export const digest = (dir: string, hash: string) =>
  path.resolve(dir, 'objects', dirName(hash), fileName(hash))

export const defaultDir = () => path.resolve('~', '.yodb')
