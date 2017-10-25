/**
 * Created by tushar on 24/10/17.
 */
import * as assert from 'assert'
import {getTableID, HashTable, MAX_TABLE_SIZE} from '../lib/HashTable'
import {FileLogger} from '../lib/fs/Logger'
import * as path from 'path'

const testFilePath = path.resolve(__dirname, '__data__')

describe('HashTable', function() {
  beforeEach(async function() {
    this.logger = await FileLogger.create(testFilePath)
  })
  afterEach(async function() {
    await this.logger.purge()
  })

  describe('MAX_TABLE_SIZE', function() {
    it('should have all bits set to 1', function() {
      const actual = MAX_TABLE_SIZE.toString(16)
      const expected = 'ffffffff'
      assert.equal(actual, expected)
    })
  })
  describe('insertItem()', function() {
    it('should insert items into the database', async function() {
      const table = new HashTable(this.logger)
      await table.insertItem('AAA', '123')
      await table.insertItem('BBB', '321')
      const actual = await table.getItem('AAA')
      const expected = '123'
      assert.equal(actual, expected)
    })
  })

  describe('getTableID()', function() {
    it('should return a location in the array', function() {
      const actual = getTableID('HELLO WORLD')
      const expected = 2021574509
      assert.equal(actual, expected)
    })
  })
})
