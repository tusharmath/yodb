/**
 * Created by tushar on 25/10/17.
 */
import {UTF8} from '../encodings'

export const fileName = (hash: string) => hash.slice(2)
export const dirName = (hash: string) => hash.slice(0, 2)
export const jtobuf = (data: any) => Buffer.from(JSON.stringify(data), UTF8)
export const buftoj = (buffer: Buffer) => JSON.parse(buffer.toString(UTF8))
