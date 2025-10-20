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
    function checkReady () {
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
