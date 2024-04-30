import { WebSocketServer } from 'ws'
import url from 'url'

const wss = new WebSocketServer({ port: 3334 })

// Store connections by URL
const connectionsByUrl = new Map()

wss.on('connection', (ws, req) => {
    console.log('Client connected')
    const parsedUrl = url.parse(req.url, true)
    const userName = parsedUrl.query.user_name
    const urlQ = parsedUrl.query.url

    // Initialize the array for this URL if it doesn't exist
    if (!connectionsByUrl.has(urlQ)) {
        connectionsByUrl.set(urlQ, [])
    }

    // Add the new connection to the list for this URL
    const connections = connectionsByUrl.get(urlQ)
    connections.push(ws)

    // Broadcast a message to all clients connected to the same URL
    broadcastMessage(urlQ, `New player connected: ${userName}`)

    ws.on('message', (message) => {
        console.log(`Received message from ${userName} (${urlQ}): ${message}`)
        broadcastMessage(urlQ, message)
    })

    ws.on('close', () => {
        console.log('Client disconnected')
        // Remove the connection from the list
        const connections = connectionsByUrl.get(urlQ);
        const index = connections.indexOf(ws)
        if (index !== -1) {
            connections.splice(index, 1)
        }
        // Broadcast a message to all clients connected to the same URL
        broadcastMessage(urlQ, `Player disconnected: ${userName}`)
    });
});

function broadcastMessage(url, message) {
    const connections = connectionsByUrl.get(url)
    if (connections) {
        connections.forEach(ws => {
            ws.send(message.toString())
        })
    }
}
