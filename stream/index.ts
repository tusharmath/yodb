/**
 * Created by tushar on 29/10/17.
 */

import {Stream, Transform, TransformOptions} from 'stream'

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

/**
 * Converts a stream into a promise
 * @param {"stream".internal.Stream} stream
 * @return {Promise}
 */
export const wait = (stream: Stream) => {
  return new Promise((resolve, reject) => {
    stream.on('end', resolve)
    stream.on('error', reject)
  })
}
