/**
 * Created by tushar on 04/11/17.
 */

import * as assert from 'assert'
import {Block, MAX_BLOCK_SIZE} from "../src/block";

const TEST_DIGEST = '4c462d6dd59d782386bb1cdad0060c70'
const TEST_DATA = Buffer.from('APPLE')

describe('Node', () => {
  it('should have data', () => {
    const actual = new Block(TEST_DATA).data
    const expected = TEST_DATA
    assert.equal(actual, expected)
  })


  describe('constructor()', () => {
    it('should throw an error on invalid params', () => {
      assert.throws(() => {
        new Block(new Buffer(MAX_BLOCK_SIZE + 1))
      })
    })
  })

  describe('digest()', () => {
    it('should return md5', () => {
      const actual = new Block(TEST_DATA).digest()
      const expected = TEST_DIGEST
      assert.strictEqual(actual, expected)
    })
    it('should use content', () => {
      const logA = new Block(Buffer.from('A'))
      const logB = new Block(Buffer.from('B'))
      assert.notEqual(logA.digest(), logB.digest())
    })
  })
})
