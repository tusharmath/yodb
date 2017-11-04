/**
 * Created by tushar on 04/11/17.
 */

import * as crypto from 'crypto'

export const HASH_ALGORITHM = 'md5'
export const MAX_BLOCK_SIZE = 10 * 1024 // 10kb
const HEX = 'hex'

export class Block {
  constructor(readonly data: Buffer) {
    if (data.length > MAX_BLOCK_SIZE)
      throw new Error(
        `data.length exceeds max-limit of ${MAX_BLOCK_SIZE} bytes`
      )
  }

  digest(): string {
    const hash = crypto.createHash(HASH_ALGORITHM)
    hash.update(this.data)
    return hash.digest().toString(HEX)
  }
}
