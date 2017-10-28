/**
 * Created by tushar on 24/10/17.
 */

import * as assert from 'assert'
import {Commit, MAX_LOG_HEADER_SIZE, MAX_LOG_SIZE} from '../lib/Commit'

const TEST_DATA = 'APPLE'
const TEST_DATA_DIGEST =
  '020b243f8f29dcaa400508eaab31819fedae9aa276cdb1a5d16a8a8572b5068e'

describe('Commit', () => {
  it('should have data', () => {
    const actual = new Commit(TEST_DATA, '').content
    const expected = TEST_DATA
    assert.equal(actual, expected)
  })

  it('should convert to and fro between buffers', () => {
    const log = new Commit(TEST_DATA, '')
    const actual = Commit.fromBuffer(log.toBuffer()).content
    const expected = TEST_DATA
    assert.equal(actual, expected)
  })

  describe('toBuffer()', () => {
    it('should save data in the end', () => {
      const log = new Commit(TEST_DATA, '')
      const actual = log.toBuffer().length
      assert.equal(actual, '519')
    })

    it('should throw an error on large contents', () => {
      assert.throws(() => {
        new Commit(new Buffer(MAX_LOG_SIZE), '').toBuffer()
      })
      assert.throws(() => {
        new Commit(
          new Buffer(MAX_LOG_SIZE - MAX_LOG_HEADER_SIZE / 2),
          ''
        ).toBuffer()
      })
    })
  })

  describe('header()', () => {
    it('should return header data', () => {
      const log = new Commit(TEST_DATA, '12345')
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
      const log = new Commit(TEST_DATA, '12345')
      const actual = log.digest()
      const expected = TEST_DATA_DIGEST
      assert.deepEqual(actual, expected)
    })
  })
})
