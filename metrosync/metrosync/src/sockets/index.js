const { Server } = require('socket.io');

let ioInstance = null;

// stationId -> count of connected sockets currently in that room
const viewerCounts = new Map();

// socketId -> current stationId (or null), so we know which room to leave
const socketStation = new Map();

function incrementViewers(stationId) {
  const next = (viewerCounts.get(stationId) || 0) + 1;
  viewerCounts.set(stationId, next);
  return next;
}

function decrementViewers(stationId) {
  const current = viewerCounts.get(stationId) || 0;
  const next = Math.max(0, current - 1);
  if (next === 0) {
    viewerCounts.delete(stationId);
  } else {
    viewerCounts.set(stationId, next);
  }
  return next;
}

function roomName(stationId) {
  return `station:${stationId}`;
}

function initSocket(httpServer, corsOrigins) {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: corsOrigins,
      methods: ['GET', 'POST'],
    },
  });

  ioInstance.on('connection', (socket) => {
    socketStation.set(socket.id, null);

    socket.on('joinStation', (stationId) => {
      if (!stationId) return;

      const previousStationId = socketStation.get(socket.id);

      // Leave the previous room (if any) and update its viewer count.
      if (previousStationId && previousStationId !== stationId) {
        socket.leave(roomName(previousStationId));
        const remaining = decrementViewers(previousStationId);
        ioInstance.to(roomName(previousStationId)).emit('presenceUpdate', {
          stationId: previousStationId,
          viewers: remaining,
        });
      }

      // Join the new room.
      socket.join(roomName(stationId));
      socketStation.set(socket.id, stationId);
      const viewers = incrementViewers(stationId);
      ioInstance.to(roomName(stationId)).emit('presenceUpdate', { stationId, viewers });
    });

    socket.on('disconnect', () => {
      const stationId = socketStation.get(socket.id);
      if (stationId) {
        const remaining = decrementViewers(stationId);
        ioInstance.to(roomName(stationId)).emit('presenceUpdate', { stationId, viewers: remaining });
      }
      socketStation.delete(socket.id);
    });
  });

  return ioInstance;
}

function getIO() {
  return ioInstance;
}

module.exports = { initSocket, getIO };
