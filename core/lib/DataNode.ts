/**
 * Created by tushar on 29/10/17.
 */
import {buftoj, jtobuf} from './Utility'
import {Node} from './Node'

export class DataNode<T> extends Node {
  constructor(readonly parent: string, readonly message: T) {
    super(parent, jtobuf(message))
  }
  static fromBuffer(buffer: Buffer) {
    const node = Node.fromBuffer(buffer)
    return new DataNode(node.parent, buftoj(node.data))
  }
}
