/**
 * Created by tushar on 24/10/17.
 */

import {FileLogger} from '../lib/Logger'
import * as path from 'path'
import * as assert from 'assert'
import {AssertionError} from 'assert'

const testFilePath = path.resolve(__dirname, '__data__')

const throws = async (fn: () => Promise<any>, message?: string) => {
  let errored = null
  try {
    await fn()
  } catch (err) {
    errored = err
  } finally {
    if (!errored) {
      throw new AssertionError({message: 'Expected to throw'})
    } else if (message && errored.message !== message) {
      assert.equal(message, errored.message)
    }
  }
}

describe('FileLogger', function() {
  beforeEach(function() {
    this.logger = new FileLogger(testFilePath)
  })

  afterEach(async function() {
    await this.logger.purge()
  })

  describe('open()', function() {
    it('should open', async function() {
      await this.logger.open()
    })
  })

  describe('close()', function() {
    it('should close', async function() {
      await throws(
        async () => await this.logger.close(),
        'Logger needs to be opened first'
      )
    })
  })

  describe('append()', function() {
    beforeEach(async function() {
      await this.logger.open()
    })
    it('should append buffer content', async function() {
      const positions = await Promise.all([
        this.logger.append(new Buffer('Hello')),
        this.logger.append(new Buffer('World'))
      ])
      assert.deepEqual(positions, [0, 5])
    })
  })
  describe('read()', function() {
    beforeEach(async function() {
      await this.logger.open()
    })
    it('should read buffer content', async function() {
      const messages = ['Hello', 'World', 'What', 'Is', 'Going', 'On']
      const buffers = messages.map(i => new Buffer(i, 'utf-8'))
      const positions = await Promise.all(
        buffers.map(i => this.logger.append(i))
      )
      const actual = await Promise.all(
        positions.map((name, i) => this.logger.read(name, buffers[i].length))
      )
      assert.deepEqual(actual.map(i => i.toString('utf-8')), messages)
    })
  })
})
