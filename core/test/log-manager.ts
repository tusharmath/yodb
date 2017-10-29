/**
 * Created by tushar on 25/10/17.
 */
import * as path from 'path'
import * as assert from 'assert'
import * as fs from 'fs-extra'
import {YoDb} from '../index'
import {ROOT_NODE} from '../lib/root-node'
import {DataNode} from '../lib/db-nodes'

const disk = path.resolve(__dirname, '.yodb')

const TEST_DATA = {a: 1}
const TEST_DATA_DIGEST = '80e8e7d6834b2b50b98e2f934ce1a20e'
describe('YoDb', function() {
  beforeEach(async function() {
    this.logger = new YoDb(disk)
  })

  afterEach(async function() {
    await fs.remove(disk)
  })

  describe('head()', function() {
    it('should return ROOT if nothing is written', async function() {
      const log = this.logger
      const head = await log.head()
      assert.equal(head, ROOT_NODE)
    })

    it('should return head digest', async function() {
      const log = this.logger
      await log.commit(TEST_DATA)
      const head = await log.head()
      assert.equal(head, TEST_DATA_DIGEST)
    })

    it('should create a file inside /refs', async function() {
      const headPath = path.resolve(disk, 'refs', 'HEAD')
      const currentHead = await fs.access(headPath).catch(() => false)
      assert.ok(!currentHead)
      await this.logger.commit(TEST_DATA)
      await fs.access(headPath)
    })
  })

  describe('logs()', function() {
    it('should return a range of data', async function() {
      await this.logger.commit(0)
      const hash1 = await this.logger.commit(1)
      const hash2 = await this.logger.commit(2)
      await this.logger.commit(3)
      await this.logger.commit(4)
      const actual = await this.logger.logs(2, 4)
      assert.deepEqual(actual, [hash2, hash1])
    })

    it('should handle out of ranges', async function() {
      const hash = await this.logger.commit(0)
      const actual = await this.logger.logs(0, Infinity)
      assert.deepEqual(actual, [hash])
    })

    it('should handle empty files', async function() {
      const actual = await this.logger.logs(0, Infinity)
      assert.deepEqual(actual, [])
    })
  })

  describe('catHash()', function() {
    it('should read data using digest', async function() {
      const hash = await this.logger.commit(TEST_DATA)
      const actual = await this.logger.catHash(hash)
      const expected = new DataNode(ROOT_NODE, TEST_DATA)
      assert.deepEqual(actual, expected)
    })
  })

  describe('commit()', function() {
    it('should throw if multiple commits are being done simultaneously', async function() {
      const err = await Promise.all([
        this.logger.commit('HELLO'),
        this.logger.commit('WORLD')
      ]).catch(err => err)
      assert.equal(err.message, 'Only one commit at a time can be made')
    })
  })
})
