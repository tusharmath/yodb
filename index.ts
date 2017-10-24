/**
 * Created by tushar on 24/10/17.
 */

import * as path from 'path'
import {HashTable} from './lib/HashTable'

export const ROOT_PATH = path.resolve('~/.yodb')
export const DB_PATH = path.resolve(ROOT_PATH, 'db')
export const META_PATH = path.resolve(ROOT_PATH, 'meta')

const table = new HashTable()

export const insertItem = async (key: Buffer, value: Buffer) => {
  return table.insertItem(key, value)
}

export const getItem = async (key: Buffer) => {
  return table.getItem(key)
}
