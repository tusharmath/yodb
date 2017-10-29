/**
 * Created by tushar on 29/10/17.
 */

import {Transform, TransformOptions} from 'stream'

/**
 * Creates a new NodeJS based {Transform} stream
 * @param {(chunk: (Buffer | string | any), encoding: string) => Promise<any>} fn
 * @param {"stream".internal.TransformOptions} options
 * @return {"stream".internal.Transform}
 */
export const createTransform = (
  fn: (chunk: Buffer | string | any, encoding: string) => Promise<any>,
  options?: TransformOptions
) => {
  return new Transform(
    Object.assign(
      {
        transform(
          chunk: any,
          encoding: string,
          callback: (e: Error | null, d?: any) => void
        ) {
          fn(chunk, encoding)
            .then(data => callback(null, data))
            .catch(err => callback(err))
        }
      },
      options
    )
  )
}
