import express from 'express'
import chatRouter from './routes/chat.route.js'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

/**
 * @route GET /health
 * @desc Health check endpoint
 * @returns {string} A message indicating the server is healthy
 * @example { "server_status": "Healthy" }
 */
app.get('/health', async (req, res) => {
  res.status(200).json({ server_status: 'Healthy' })
})

app.use('/api/v1/chats', chatRouter)

export default app
