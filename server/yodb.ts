/**
 * Created by tushar on 29/10/17.
 */

import * as net from 'net'
import * as ip from 'ip'

const atob = (str: string) => new Buffer(str).toString('base64')
export const dbURL = () =>
  'yodb://' + atob(ip.address() + ':' + server.address().port)

const server = net.createServer(function(sock) {
  sock.end('Hello world\n')
})
server.listen(0, () => {
  console.log('Started ' + dbURL())
})
