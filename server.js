import express from 'express'
import next from 'next'
import { createServer } from 'http'
import { Server } from 'socket.io'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })

const handle = app.getRequestHandler()

app.prepare().then(async () => {
  const server = express()
  const httpServer = createServer(server)
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log('socket id just connected', socket.id)

    // ! web socket actions start

    socket.on('dpuUpdating', (data) => {
      // console.log('Recieved from API Started::', data)
      io.emit('dpuUpdating', data)
    })

    // ! web socket actions end

    //on disconnect
    socket.on('disconnect', () => {
      console.log('socket disconnected', socket.id)
    })
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  const PORT = process.env.PORT || 3000
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})
