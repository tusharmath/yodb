/**
 * Created by tushar on 24/10/17.
 */

type NodeCallback<T> = (err: Error | null, result: T) => void
interface RandomAccessFile {
  write(pos: number, buff: Buffer, cb: (err: Error, buff: Buffer) => void): void
  read(start: number, count: number, cb: NodeCallback<Buffer>): void
  close(cb: NodeCallback<void>): void
}

declare module 'random-access-file' {
  function RAF(path: string): RandomAccessFile
  export = RAF
}
