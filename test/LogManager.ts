/**
 * Created by tushar on 25/10/17.
 */
import * as path from 'path'
import * as assert from 'assert'
import {LogManager} from "../lib/LogManager";
import {ROOT_ENTRY} from "../lib/LogEntry";

const disk = path.resolve(__dirname, '.yodb')
describe('LogManager', function () {
  beforeEach(async function () {
    this.logger = new LogManager(disk)
  })

  afterEach(async function () {
    await this.logger.purge()
  })

  describe('head()', async function () {
    it('should return ROOT if nothing is written', async function () {
      const log = this.logger
      const head = await log.head()
      assert.equal(head, ROOT_ENTRY)
    })

    it('should return head digest', async function () {
      const log = this.logger
      await log.commit({a: 1})
      const head = await log.head()
      assert.equal(head, '015abd7f5cc57a2dd94b7590f04ad8084273905ee33ec5cebeae62276a97f862')
    })
  })
})
