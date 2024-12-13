import io from 'socket.io-client'

const socket = io(process.env.BACKEND_SERVER_URL)

export default socket
