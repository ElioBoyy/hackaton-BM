import { WebSocketServer } from 'ws'
import url from 'url'

const wss = new WebSocketServer({ port: 3334 })

const connectionsByUrl = new Map()

wss.on('connection', (ws, req) => {
  console.log('Client connected')
  const parsedUrl = url.parse(req.url, true)
  const userName = parsedUrl.query.user_name
  const urlQ = parsedUrl.query.url
  console.log(`User name from query parameter: ${userName}`)

  ws.on('message', (message) => {
    if (urlQ) {
      console.log(`Received message from ${urlQ}: ${message}`)
      broadcastToSamePage(message, urlQ, ws)
    } else {
      console.log(`Client connected to ${urlQ}`)
    
      if (!connectionsByUrl.has(urlQ)) {
        connectionsByUrl.set(urlQ, [])
      }
      connectionsByUrl.get(urlQ).push(ws)
    }
  })

  ws.on('close', () => {
    console.log('Client disconnected')
    if (urlQ) {
      try {
        const connections = connectionsByUrl.get(urlQ)
        const index = connections.indexOf(ws)
        if (index !== -1) {
          connections.splice(index, 1)
        }
      } catch (e) {
        console.log('Error removing client connection')
      }
    }
  })
})

function broadcastToSamePage(message, url) {
  const connections = connectionsByUrl.get(url)
  if (connections) {
    connections.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message)
      }
    })
  }
}
