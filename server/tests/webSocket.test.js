// tests/webSocket.test.js
const { io: Client } = require('socket.io-client');
const { httpserver, io } = require('../src/main');
const mongoose = require('mongoose');

const PORT = 4001;
let client1;
let client2;

beforeAll((done) => {
  httpserver.listen(PORT, () => {
    client1 = new Client(`http://localhost:${PORT}/tic-tac-toe`);
    client1.on('connect', done);
  });
}, 10000);

afterAll(async () => {
  if (client1?.connected) client1.disconnect();
  if (client2?.connected) client2.disconnect();
  await mongoose.disconnect();
  await new Promise((resolve) => io.close(resolve));
  await new Promise((resolve) => httpserver.close(resolve));
});

describe('WebSocket connection', () => {
  test('should connect client1 successfully', () => {
    expect(client1.connected).toBe(true);
  });

  test('should broadcast messages to all clients in the same room', (done) => {
    const room = 'room1';
    const message = { text: 'Hello everyone!' };

    // Connect second client
    client2 = new Client(`http://localhost:${PORT}/tic-tac-toe`);

    client2.on('message', (data) => {
      expect(data).toEqual(message);
      done();
    });
    let connectedCount = 1;
    function checkReady() {
      connectedCount += 1;
      if (connectedCount === 2) {
        io.of('/tic-tac-toe').adapter.rooms.set(
          room,
          new Set([client1.id, client2.id])
        );
        io.of('/tic-tac-toe').to(room).emit('message', message);
      }
    }

    client2.on('connect', checkReady);
  });
});

describe('WebSocket disconnection', () => {
  let client2;

  test('should decrease socket count and update rooms correctly on disconnect', (done) => {
    const roomNamespace = io.of('/tic-tac-toe');

    // Connect second client
    client2 = new Client(`http://localhost:${PORT}/tic-tac-toe`);

    client2.on('connect', () => {
      // Wait a tick for the server to add clients to rooms
      setImmediate(() => {
        const socketsBefore = roomNamespace.sockets.size;
        const roomsBefore = roomNamespace.adapter.rooms.size;

        expect(socketsBefore).toBeGreaterThanOrEqual(2);
        expect(roomsBefore).toBeGreaterThanOrEqual(1);

        // Disconnect client2
        client2.disconnect();

        // Wait a tick for disconnect events to propagate
        setImmediate(() => {
          const socketsAfter = roomNamespace.sockets.size;
          const roomsAfter = roomNamespace.adapter.rooms.size;

          expect(socketsAfter).toBe(socketsBefore - 1);

          // Room should persist if at least one client remains
          expect(roomsAfter).toBeGreaterThanOrEqual(1);

          done();
        });
      });
    });
  });

 test(
    'should destroy room when all clients leave',
    (done) => {
      const roomNamespace = io.of('/tic-tac-toe');

      // Connect second client
      client2 = new Client(`http://localhost:${PORT}/tic-tac-toe`);

      client2.on('connect', () => {
        setImmediate(() => {
          // Find a room that starts with 'room'
          const roomsBefore = Array.from(roomNamespace.adapter.rooms.keys()).filter(r =>
            r.startsWith('room')
          );
          expect(roomsBefore.length).toBeGreaterThanOrEqual(1);

          const targetRoom = roomsBefore[1];

          // Disconnect both clients
          client1.disconnect();
          client2.disconnect();

          // Wait a bit for the disconnect events to propagate
          setTimeout(() => {
            const roomsAfter = Array.from(roomNamespace.adapter.rooms.keys()).filter(r =>
              r.startsWith('room')
            );

            // Room should be gone
            expect(roomsAfter.includes(targetRoom)).toBe(false);

            done();
          }, 50); // 50ms delay allows Socket.IO to clean up the room
        });
      });
    },
    10000 // increase test timeout in case network is slow
  );
});

