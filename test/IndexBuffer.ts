/**
 * Created by tushar on 25/10/17.
 */
import {IndexBuffer} from '../lib/fs/IndexBuffer'
import * as path from 'path'
import * as assert from 'assert'

const testFilePath = path.resolve(__dirname, '__data__')

describe('IndexBuffer', function() {
  beforeEach(async function() {
    this.index = IndexBuffer.create(testFilePath)
    await this.index.open()
  })

  afterEach(async function () {
    await this.index.purge()
  })

  it('should read/write', async function() {
    const message = 'Hello World'
    const buffer = Buffer.from(message)
    await this.index.write(buffer)
    const rBuffer = await this.index.read(buffer.length)
    const actual = rBuffer.toString()
    assert.equal(actual, message)
  })
})
