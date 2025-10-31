// tests/webSocket.test.js
const { io: Client } = require('socket.io-client');
const { httpserver, io } = require('../src/main');
const mongoose = require('mongoose');

const PORT = 4001;

// Use env variable SOCKET_HOST if provided, otherwise fallback to localhost

const HOST = process.env.SOCKET_HOST || 'localhost';
const SOCKET_URL = `http://${HOST}:${PORT}/tic-tac-toe`;

let client1;
let client2;

beforeAll((done) => {
  httpserver.listen(PORT);
  done();
}, 10000);

beforeEach((done) => {
    client1 = new Client(SOCKET_URL);
    client1.on('connect', done);
})

afterEach((done) => {
  if (client1?.connected) client1.disconnect();
  if (client2?.connected) client2.disconnect();
  done();
});

afterAll(async () => {
  await mongoose.disconnect();
  await new Promise((resolve) => io.close(resolve));
  await new Promise((resolve) => httpserver.close(resolve));
})

describe('WebSocket connection', () => {
  test('should connect client1 successfully', () => {
    expect(client1.connected).toBe(true);
  });

  test('should broadcast messages to all clients in the same room', (done) => {
    const message = { text: 'Hello everyone!' };

    console.log(io.of("/tic-tac-toe").adapter.rooms, "rooms number");

    // Connect second client
    client2 = new Client(SOCKET_URL);

    client2.on('message', (data) => {
      expect(data).toEqual(message);
      done();
    });

    client2.on('connect', () => {
        io.of('/tic-tac-toe').to("room2").emit('message', message);
    });
  });
});

describe('WebSocket disconnection', () => {

  test('should decrease socket count and update rooms correctly on disconnect', (done) => {
    const roomNamespace = io.of('/tic-tac-toe');

    // Connect second client
    client2 = new Client(SOCKET_URL);

    client2.on('connect', () => {
      // Wait a tick for the server to add clients to rooms
        const socketsBefore = roomNamespace.sockets.size;
        const roomsBefore = roomNamespace.adapter.rooms.size;

        expect(socketsBefore).toBe(2);
        expect(roomsBefore).toBe(1);

        // Disconnect client2
        });

        client2.disconnect();

        // Wait a tick for disconnect events to propagate
        setImmediate(() => {
          const socketsAfter = roomNamespace.sockets.size;
          const roomsAfter = roomNamespace.adapter.rooms.size;

          expect(socketsAfter).toBe(1);

          // Room should persist if at least one client remains
          expect(roomsAfter).toBeGreaterThanOrEqual(1);

          done();
    });
  }, 10000);

 test(
    'should destroy room when all clients leave',
    (done) => {
      const roomNamespace = io.of('/tic-tac-toe');

      // Connect second client
      client2 = new Client(SOCKET_URL);

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
          }, 5000);
        });
      });
    },
    10000
  );
});


