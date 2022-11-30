import io from 'socket.io-client'
import { urlSocket } from '../api/myApiData'

let Socket = io(urlSocket)

export default Socket