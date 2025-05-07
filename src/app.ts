import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
})

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
)
app.use(helmet())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// Add Socket Connection

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

app.get('/', (req, res) => {
  res.send('Hello World')
})

// Handle Errors in Routes
import errorHandler from './utils/errorHandler'
app.use(errorHandler)

export { app as default, httpServer as server }
