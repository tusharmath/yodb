/**
 * Created by tushar on 25/10/17.
 */

import * as assert from 'assert'
import {dirName, fileName} from '../lib/Utility'

describe('Utility', function() {
  describe('dirName()', () => {
    it('should skip the first two letters', () => {
      assert.equal(dirName('AAABBB'), 'AA')
    })
  })

  describe('fileName()', () => {
    it('should return the first two letters', () => {
      assert.equal(fileName('AAABBB'), 'ABBB')
    })
  })
})
