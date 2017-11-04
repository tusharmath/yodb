/**
 * Created by tushar on 04/11/17.
 */

import * as path from './path-utils'
import * as writer from './block-writer'
import * as reader from './block-reader'

export class Storage {
  constructor(private dir = path.defaultDir()) {}

  async write(buffer: Buffer): Promise<string> {
    return await writer.write(this.dir, buffer)
  }

  async read(digest: string): Promise<Buffer> {
    return reader.read(this.dir, digest)
  }
}
