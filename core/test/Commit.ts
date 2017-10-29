/**
 * Created by tushar on 24/10/17.
 */

import * as assert from 'assert'
import {Commit, MAX_LOG_HEADER_SIZE, MAX_LOG_SIZE} from '../lib/Commit'

const TEST_DIGEST = '2d86ca126688af1984556e74343c2982'
const TEST_DATA = Buffer.from('APPLE')

describe('Commit', () => {
  it('should have data', () => {
    const actual = new Commit(TEST_DIGEST, TEST_DATA).data
    const expected = TEST_DATA
    assert.equal(actual, expected)
  })

  it('should have parent', () => {
    const actual = new Commit(TEST_DIGEST, TEST_DATA).parent
    const expected = TEST_DIGEST
    assert.equal(actual, expected)
  })

  it('should convert to and fro between buffers', () => {
    const commit = new Commit(TEST_DIGEST, TEST_DATA)
    const actual = Commit.fromBuffer(commit.toBuffer())
    const expected = commit
    assert.deepEqual(actual, expected)
  })

  describe('constructor()', () => {
    it('should throw an error on invalid params', () => {
      assert.throws(() => {
        new Commit('', new Buffer(''))
      })
      assert.throws(() => {
        new Commit('', new Buffer(MAX_LOG_SIZE))
      })
      assert.throws(() => {
        new Commit(
          '',
          new Buffer(MAX_LOG_SIZE - MAX_LOG_HEADER_SIZE / 2)
        ).toBuffer()
      })
    })
  })

  describe('digest()', () => {
    it('should use content', () => {
      const logA = new Commit(TEST_DIGEST, Buffer.from('A'))
      const logB = new Commit(TEST_DIGEST, Buffer.from('B'))
      assert.notEqual(logA.digest(), logB.digest())
    })

    it('should use parent', () => {
      const logA = new Commit('2d86ca126688af1984556e74343c2982', Buffer.from('A'))
      const logB = new Commit('2d86ca126688af1984556e74343c2981', Buffer.from('A'))
      assert.notEqual(logA.digest(), logB.digest())
    })
  })
})
