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
    const content = 'HELLO WORLD'
    const actual = new LogEntry(content, '').content
    const expected = content
    assert.equal(actual, expected)
  })

  it('should convert to and fro between buffers', () => {
    const content = 'APPLE'
    const log = new LogEntry(content, '')
    const actual = LogEntry.fromBuffer(log.toBuffer()).content
    const expected = content
    assert.equal(actual, expected)
  })

  describe('toBuffer()', () => {
    it('should save data in the end', () => {
      const log = new LogEntry('APPLE', '')
      const actual = log.toBuffer().length
      assert.equal(actual, '519')
    })

    it('should throw an error on large contents', () => {
      assert.throws(() => {
        new LogEntry(new Buffer(MAX_LOG_SIZE), '').toBuffer()
      })
      assert.throws(() => {
        new LogEntry(
          new Buffer(MAX_LOG_SIZE - MAX_LOG_HEADER_SIZE / 2),
          ''
        ).toBuffer()
      })
    })
  })

  describe('header()', () => {
    it('should return header data', () => {
      const log = new LogEntry('APPLE', '12345')
      const actual = log.header()
      const expected = {
        parent: '12345',
        size: 7
      }
      assert.deepEqual(actual, expected)
    })
  })

  describe('digest()', () => {
    it('should return header data', () => {
      const log = new LogEntry('APPLE', '12345')
      const actual = log.digest()
      const expected =
        '020b243f8f29dcaa400508eaab31819fedae9aa276cdb1a5d16a8a8572b5068e'
      assert.deepEqual(actual, expected)
    })
  })

  describe('dirName()', () => {
    it('should return the first two letters', () => {
      const buffer = new Buffer('APPLE')
      const log = new LogEntry(buffer, ROOT_ENTRY)
      assert.equal(log.dir(), '54')
    })
  })

  describe('fileName()', () => {
    it('should skip the first two letters', () => {
      const buffer = new Buffer('APPLE')
      const log = new LogEntry(buffer, ROOT_ENTRY)
      assert.equal(
        log.file(),
        '28557e2ab9ffc0aacd13d473cc6fda99acb9988ec43dcad4f1005752c3113e'
      )
    })
  })
})
