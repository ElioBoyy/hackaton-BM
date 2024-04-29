import { WebSocketServer } from 'ws'
import url from 'url'

const wss = new WebSocketServer({ port: 3334 })

const connectionsByUrl = new Map()

wss.on('connection', (ws, req) => {
  console.log('Client connected')
  const parsedUrl = url.parse(req.url, true)
  const userName = parsedUrl.query.user_name
  console.log(`User name from query parameter: ${userName}`)

  ws.on('message', (message) => {
    if (ws.url) {
      console.log(`Received message from ${ws.url}: ${message}`)
      broadcastToSamePage(message, ws.url)
    } else {
      console.log(`Client connected to ${ws.url}`)
    
      if (!connectionsByUrl.has(ws.url)) {
        connectionsByUrl.set(ws.url, [])
      }
      connectionsByUrl.get(ws.url).push(ws)
    }
  })

  ws.on('close', () => {
    console.log('Client disconnected')
    if (ws.url) {
      const connections = connectionsByUrl.get(ws.url)
      const index = connections.indexOf(ws)
      if (index !== -1) {
        connections.splice(index, 1)
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