/**
 * Created by tushar on 24/10/17.
 */
import * as assert from 'assert'
import {getTableID, HashTable, MAX_TABLE_SIZE} from '../lib/HashTable'

describe('HashTable', () => {
  describe('MAX_TABLE_SIZE', () => {
    it('should have all bits set to 1', () => {
      const actual = MAX_TABLE_SIZE.toString(16)
      const expected = 'ffffffff'
      assert.equal(actual, expected)
    })
  })
  describe('insertItem()', () => {
    it('should insert items into the database', async () => {
      const table = new HashTable()
      await table.insertItem('AAA', '123')
      await table.insertItem('BBB', '321')
      const actual = await table.getItem('AAA')
      const expected = '123'
      assert.equal(actual, expected)
    })
  })

  describe('getTableID()', () => {
    it('should return a location in the array', () => {
      const actual = getTableID('HELLO WORLD')
      const expected = 2021574509
      assert.equal(actual, expected)
    })
  })
})
