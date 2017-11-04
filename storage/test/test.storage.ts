/**
 * Created by tushar on 04/11/17.
 */

import * as path from 'path'
import * as assert from 'assert'
import {Storage} from '../src/storage'
import * as fs from 'fs-extra'

const TEST_DATA = 'APPLE'
const disk = path.resolve(__dirname, '.yodb')

describe('YoDb', function() {
  beforeEach(async function() {
    this.storage = new Storage(disk)
  })
  afterEach(async function() {
    await fs.remove(disk)
  })

  it('should be able to read/write', async function() {
    const digest = await this.storage.write(Buffer.from(TEST_DATA))
    const actual = await this.storage.read(digest)
    const expected = TEST_DATA
    assert.strictEqual(actual.toString(), expected)
  })
})
