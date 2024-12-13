import express from 'express'
import cors from 'cors'
import path from 'path'
import { createServer } from 'http'
import { Server } from 'socket.io'

import socket from './controllers/socket'

const app = express()

app.use(cors())

app.use(express.static(path.join(__dirname, 'uploads')))

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

// run socket.io
socket(io)

const PORT = 3010

httpServer.listen(PORT, () => {
  console.log(`backend server active on port ${PORT}`)
})
