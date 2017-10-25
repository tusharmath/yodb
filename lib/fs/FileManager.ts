/**
 * Created by tushar on 25/10/17.
 */

import * as fs from 'fs-extra'

export class FileManager {
  private fd: number
  private isOpened = false
  constructor(private file: string, private mode: string) {}

  async open() {
    this.fd = await fs.open(this.file, this.mode)
    this.isOpened = true
    return this
  }

  async stat () {
    return await fs.stat(this.file)
  }

  async close() {
    this.getFD()
    await fs.close(this.getFD())
    this.isOpened = false
  }

  getFD() {
    if (this.isOpened === false) {
      throw Error('Logger needs to be opened first')
    }
    return this.fd
  }
  async purge() {
    if (this.isOpened) await this.close()
    if (await fs.pathExists(this.file)) await fs.unlink(this.file)
  }
}
