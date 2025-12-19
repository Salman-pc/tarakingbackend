const express = require('express')
const http = require('http')
const socketIo = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})
const trips = new Map()
const connections = new Map() // Track user types

io.on('connection', (socket) => {
    console.log('🔗 User connected - Socket ID:', socket.id)
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg)
    })

    socket.on('provider:start', (data) => {
        const tripId = data.tripId;
        console.log('🚗 Provider started tracking - Trip:', tripId, 'Socket:', socket.id);
        connections.set(socket.id, { type: 'provider', tripId, name: data.provider?.name });
        trips.set(tripId, { providerId: socket.id, ...data });
        socket.join(tripId);
        io.to(tripId).emit('trip:started', data);
        
        // Send initial provider location if available
        if (data.lat && data.lng) {
            io.to(tripId).emit('provider:location', { lat: data.lat, lng: data.lng, timestamp: Date.now() });
            console.log('📍 Sent initial provider location to customer');
        }
        
        console.log('📢 Emitted trip:started to room:', tripId);
        console.log('📊 Active connections:', Array.from(connections.entries()).map(([id, info]) => `${info.type}:${id.slice(-4)}`));
    });

    socket.on('provider:location', (data) => {
        const { tripId, lat, lng } = data;
        console.log('📍 Provider location update - Trip:', tripId, 'Lat:', lat, 'Lng:', lng);
        io.to(tripId).emit('location:update', { lat, lng, timestamp: Date.now() });
        console.log('📢 Broadcasted location to room:', tripId);
    });

    socket.on('customer:join', (tripId) => {
        console.log('👤 Customer joined - Trip:', tripId, 'Socket:', socket.id);
        connections.set(socket.id, { type: 'customer', tripId });
        socket.join(tripId);
        const trip = trips.get(tripId);
        if (trip) {
            console.log('✅ Sending trip data to customer:', trip);
            socket.emit('trip:data', trip);
        } else {
            console.log('⚠️ No trip data found for:', tripId);
        }
        console.log('📊 Active connections:', Array.from(connections.entries()).map(([id, info]) => `${info.type}:${id.slice(-4)}`));
    });

    socket.on('customer:location', (data) => {
        const { tripId, lat, lng } = data;
        console.log('📍 Customer location update - Trip:', tripId, 'Lat:', lat, 'Lng:', lng);
        io.to(tripId).emit('customer:location', { lat, lng, timestamp: Date.now() });
        console.log('📢 Broadcasted customer location to room:', tripId);
    });

    socket.on('trip:end', (tripId) => {
        console.log('🛑 Trip ended:', tripId);
        io.to(tripId).emit('trip:ended');
        trips.delete(tripId);
    });

    socket.on('disconnect', () => {
        const userInfo = connections.get(socket.id);
        if (userInfo) {
            console.log(`🔌 ${userInfo.type} disconnected - Socket: ${socket.id}`);
            connections.delete(socket.id);
        } else {
            console.log('🔌 Unknown user disconnected - Socket:', socket.id);
        }
        console.log('📊 Remaining connections:', Array.from(connections.entries()).map(([id, info]) => `${info.type}:${id.slice(-4)}`));
    })
})


server.listen(3000, () => {
    console.log('server is running on port 3000')
})