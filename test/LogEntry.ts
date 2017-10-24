/**
 * Created by tushar on 24/10/17.
 */

import * as assert from 'assert'
import {LogEntry, MAX_LOG_HEADER_SIZE, MAX_LOG_SIZE} from '../lib/LogEntry'

describe('LogEntry', () => {
  it('should have data', () => {
    const message = 'HELLO WORLD'
    const actual = new LogEntry(Buffer.from(message)).data
    const expected = message
    assert.equal(actual.toString('utf-8'), expected)
  })

  it('should throw an error on large messages', () => {
    assert.throws(() => {
      new LogEntry(new Buffer(MAX_LOG_SIZE))
    })
    assert.throws(() => {
      new LogEntry(new Buffer(MAX_LOG_SIZE - MAX_LOG_HEADER_SIZE / 2))
    })
  })

  it('should convert to and fro between buffers', () => {
    const message = 'APPLE'
    const log = new LogEntry(new Buffer(message))
    const actual = LogEntry.fromBuffer(log.toBuffer()).data.toString('utf-8')
    const expected = message
    assert.equal(actual, expected)
  })

  describe('toBuffer()', () => {
    it('should save data in the end', () => {
      const buffer = new Buffer('APPLE')
      const log = new LogEntry(buffer)
      const actual = log.toBuffer().length
      const expected = buffer.length + MAX_LOG_HEADER_SIZE
      assert.equal(actual, expected)
    })
  })

  describe('header()', () => {
    it('should return header data', () => {
      const buffer = new Buffer('APPLE')
      const log = new LogEntry(buffer, 12345)
      const actual = log.header()
      const expected = {
        tail: 12345,
        size: 5
      }
      assert.deepEqual(actual, expected)
    })
  })
})
