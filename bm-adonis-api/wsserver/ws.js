import { WebSocketServer, WebSocket } from 'ws'

const wss = new WebSocketServer({ port: 3334 })

let clients = new Set()

function broadcast(data) {
  clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
  })
}

// Handle new connections
wss.on('connection', (ws) => {
  console.log('Client connected')
  clients.add(ws)

  // Handle incoming messages
  ws.on('message', (message) => {
      console.log(`Received: ${message}`)
      const binaryData = Buffer.from(message, 'hex');
      const decoder = new TextDecoder('utf-8');
      const text = decoder.decode(binaryData);
      broadcast(text) // Broadcast the message to all clients
  });

  // Handle disconnections
  ws.on('close', () => {
      console.log('Client disconnected')
      clients.delete(ws)
  })
})

