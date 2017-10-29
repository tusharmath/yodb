/**
 * Created by tushar on 29/10/17.
 */
import {buftoj, jtobuf} from './Utility'
import {DBNode} from './DBNode'

export class DataNode<T> extends DBNode {
  constructor(readonly parent: string, readonly message: T) {
    super(parent, jtobuf(message))
  }
  static fromBuffer(buffer: Buffer) {
    const node = DBNode.fromBuffer(buffer)
    return new DataNode(node.parent, buftoj(node.data))
  }
}
