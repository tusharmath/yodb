/**
 * Created by tushar on 24/10/17.
 */

import * as assert from 'assert'
import {Commit, MAX_LOG_HEADER_SIZE, MAX_LOG_SIZE} from '../lib/Commit'

describe('Commit', () => {
  it('should have data', () => {
    const content = 'HELLO WORLD'
    const actual = new Commit(content, '').content
    const expected = content
    assert.equal(actual, expected)
  })

  it('should convert to and fro between buffers', () => {
    const content = 'APPLE'
    const log = new Commit(content, '')
    const actual = Commit.fromBuffer(log.toBuffer()).content
    const expected = content
    assert.equal(actual, expected)
  })

  describe('toBuffer()', () => {
    it('should save data in the end', () => {
      const log = new Commit('APPLE', '')
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
      const log = new Commit('APPLE', '12345')
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
      const log = new Commit('APPLE', '12345')
      const actual = log.digest()
      const expected =
        '020b243f8f29dcaa400508eaab31819fedae9aa276cdb1a5d16a8a8572b5068e'
      assert.deepEqual(actual, expected)
    })
  })
})
