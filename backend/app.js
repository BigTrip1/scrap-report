import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'http'
import { Server } from 'socket.io'

import socket from './controllers/socket.js'

const app = express()

app.use(cors())

const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = path.dirname(__filename) // get the name of the directory

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
