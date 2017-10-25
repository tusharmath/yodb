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

  it('should throw an error on large contents', () => {
    assert.throws(() => {
      new LogEntry(new Buffer(MAX_LOG_SIZE), '')
    })
    assert.throws(() => {
      new LogEntry(new Buffer(MAX_LOG_SIZE - MAX_LOG_HEADER_SIZE / 2), '')
    })
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

  describe('digest', () => {
    it('should return header data', () => {
      const log = new LogEntry('APPLE', '12345')
      const actual = log.digest
      const expected =
        '08a5621c50e13f24ed076b6845e5681fc5bf371fb61832f6163319bc2bfc73b3'
      assert.deepEqual(actual, expected)
    })
  })

  describe('dirName()', () => {
    it('should return the first two letters', () => {
      const buffer = new Buffer('APPLE')
      const log = new LogEntry(buffer, ROOT_ENTRY)
      assert.equal(log.dirName(), 'd7')
    })
  })

  describe('fileName()', () => {
    it('should skip the first two letters', () => {
      const buffer = new Buffer('APPLE')
      const log = new LogEntry(buffer, ROOT_ENTRY)
      assert.equal(
        log.fileName(),
        'a43ace186d22c0c1d7b6d7242b53f0b0358ea06e741adbd07f2e84ed31721c'
      )
    })
  })
})
