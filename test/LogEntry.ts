/**
 * Created by tushar on 24/10/17.
 */

import * as assert from 'assert'
import {
  LogEntry,
  MAX_LOG_HEADER_SIZE,
  MAX_LOG_SIZE,
  ROOT_ENTRY
} from '../lib/LogEntry'

describe('LogEntry', () => {
  it('should have data', () => {
    const message = 'HELLO WORLD'
    const actual = new LogEntry(Buffer.from(message), '').data
    const expected = message
    assert.equal(actual.toString('utf-8'), expected)
  })

  it('should throw an error on large messages', () => {
    assert.throws(() => {
      new LogEntry(new Buffer(MAX_LOG_SIZE), '')
    })
    assert.throws(() => {
      new LogEntry(new Buffer(MAX_LOG_SIZE - MAX_LOG_HEADER_SIZE / 2), '')
    })
  })

  it('should convert to and fro between buffers', () => {
    const message = 'APPLE'
    const log = new LogEntry(new Buffer(message), '')
    const actual = LogEntry.fromBuffer(log.toBuffer()).data.toString('utf-8')
    const expected = message
    assert.equal(actual, expected)
  })

  describe('toBuffer()', () => {
    it('should save data in the end', () => {
      const buffer = new Buffer('APPLE')
      const log = new LogEntry(buffer, '')
      const actual = log.toBuffer().length
      const expected = buffer.length + MAX_LOG_HEADER_SIZE
      assert.equal(actual, expected)
    })
  })

  describe('header()', () => {
    it('should return header data', () => {
      const buffer = new Buffer('APPLE')
      const log = new LogEntry(buffer, '12345')
      const actual = log.header()
      const expected = {
        parent: '12345',
        size: 5
      }
      assert.deepEqual(actual, expected)
    })
  })

  describe('digest', () => {
    it('should return header data', () => {
      const buffer = new Buffer('APPLE')
      const log = new LogEntry(buffer, '12345')
      const actual = log.digest
      const expected =
        '55562347f437d65829303cf6307e71acf8b84a020989dd218f31586eeafd01a9'
      assert.deepEqual(actual, expected)
    })
  })

  describe('dirName()', () => {
    it('should return the first two letters', () => {
      const buffer = new Buffer('APPLE')
      const log = new LogEntry(buffer, ROOT_ENTRY)
      assert.equal(log.dirName(), '55')
    })
  })

  describe('fileName()', () => {
    it('should skip the first two letters', () => {
      const buffer = new Buffer('APPLE')
      const log = new LogEntry(buffer, ROOT_ENTRY)
      assert.equal(
        log.fileName(),
        '562347f437d65829303cf6307e71acf8b84a020989dd218f31586eeafd01a9'
      )
    })
  })
})
