/**
 * Created by tushar on 24/10/17.
 */

import * as crypto from 'crypto'
import {HEX} from '../encodings'

export const HASH_ALGORITHM = 'md5'
export const MAX_LOG_SIZE = 10 * 1024 // 10kb
export const MAX_LOG_HEADER_SIZE = 32 // 32bytes because md5 is 32 bytes

const assertDataSize = (content: Buffer) => {
  if (content.length > MAX_LOG_SIZE - MAX_LOG_HEADER_SIZE) {
    throw Error(`Message is longer than allowed limit of ${MAX_LOG_SIZE} bytes`)
  }
}

const assertParentSize = (hash: string) => {
  if (hash.length !== 32) {
    throw Error(`Invalid parent node: ${hash}`)
  }
}

export class Commit {
  /**
   * Creates a serializable Commit
   * @param {string} parent - hash of the parent node
   * @param {Buffer} data - data buffer
   */
  constructor(readonly parent: string, readonly data: Buffer) {
    assertDataSize(data)
    assertParentSize(parent)
  }

  digest() {
    const hash = crypto.createHash(HASH_ALGORITHM)
    hash.update(this.toBuffer())
    return hash.digest().toString(HEX)
  }

  static fromBuffer(buffer: Buffer) {
    const parent = buffer.slice(0, MAX_LOG_HEADER_SIZE / 2).toString(HEX)
    const data = buffer.slice(MAX_LOG_HEADER_SIZE / 2)
    return new Commit(parent, data)
  }

  toBuffer() {
    return Buffer.concat([Buffer.from(this.parent, HEX), this.data])
  }
}
