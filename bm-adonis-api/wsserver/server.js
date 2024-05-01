import { WebSocketServer } from 'ws'
import url from 'node:url'

const wss = new WebSocketServer({ port: 3334 })

// Store connections by URL, with each connection associated with its userName
const connectionsByUrl = new Map()

wss.on('connection', (ws, req) => {
  console.log('Client connected')
  const parsedUrl = url.parse(req.url, true)
  const userName = parsedUrl.query.user_name
  const urlQ = parsedUrl.query.url

  if (urlQ === 'game_dashboard') {
    broadcastPlayerCountByGame()
  } else {
    // Initialize the array for this URL if it doesn't exist
    if (!connectionsByUrl.has(urlQ)) {
      connectionsByUrl.set(urlQ, [])
    }

    // Add the new connection to the list for this URL, associating it with its userName
    const connections = connectionsByUrl.get(urlQ)
    if (!connections.some((conn) => conn.userName === userName)) {
      connections.push({ ws, userName })
    }

    // Broadcast a message to all clients connected to the same URL
    broadcastPlayerList(urlQ)

    ws.on('message', (message) => {
      console.log(`Received message from ${userName} (${urlQ}): ${message}`)
      broadcastMessage(urlQ, message)
    })

    ws.on('close', () => {
      console.log('Client disconnected')
      // Remove the connection from the list
      const connectionsDisco = connectionsByUrl.get(urlQ)
      const index = connectionsDisco.findIndex((conn) => conn.ws === ws)
      if (index !== -1) {
        connectionsDisco.splice(index, 1)
      }
      // Broadcast a message to all clients connected to the same URL
      broadcastMessage(urlQ, `{ "PlayerDisconnected": "${userName}" }`)
    })
  }
})

function broadcastMessage(urlM, message) {
  const connections = connectionsByUrl.get(urlM)
  if (connections) {
    connections.forEach((conn) => {
      conn.ws.send(message.toString())
    })
  }
}

function broadcastPlayerList(urlPL) {
  const connections = connectionsByUrl.get(urlPL)
  if (connections) {
    const players = connections.map((conn) => conn.userName).filter(Boolean)
    connections.forEach((conn) => {
      conn.ws.send(JSON.stringify({ type: 'playerList', players }))
    })
  }
}
