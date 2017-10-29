/**
 * Created by tushar on 29/10/17.
 */
import {readHead} from './head'
import {ROOT_NODE} from './root-node'
import {catDataNode} from './cat-node'

export type Range = {
  start: number
  end: number
}
export const logSlice = async (dir: string, range: Range) => {
  const data = []
  let head = await readHead(dir)
  let i = 0
  while (i <= range.end && head !== ROOT_NODE) {
    const log = await catDataNode(dir, head)
    if (i >= range.start && i < range.end) data.push(head)
    head = log.parent
    i++
  }
  return data
}
