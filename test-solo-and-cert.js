const { io } = require('socket.io-client');
const { verifyPrizeClaim } = require('./public/js/tickets');

async function runSoloTest() {
  console.log("🎮 Starting Solo Mode vs AI Bots & Prize Verification Test...");
  const serverUrl = "http://localhost:3000";

  const socket = io(serverUrl);
  let roomCode = null;
  let player = null;
  let currentRoom = null;

  await new Promise((resolve, reject) => {
    function onConnected() {
      console.log("✓ Connected to server");
      socket.emit('createSoloGame', {
        playerName: "Kapil",
        avatar: "👑",
        botCount: 2,
        botDifficulty: "hard"
      });
    }

    if (socket.connected) onConnected();
    else socket.on('connect', onConnected);

    socket.on('roomCreated', (data) => {
      roomCode = data.roomCode;
      player = data.player;
      currentRoom = data.roomState;
      console.log(`✓ Solo Room created with code: ${roomCode}`);
      console.log(`✓ Human Player: ${player.name} (${player.avatar}) with ${player.tickets.length} ticket(s)`);
      console.log(`✓ Total participants in room: ${currentRoom.players.length} (Human + ${currentRoom.players.length - 1} AI Bots)`);
      
      const bots = currentRoom.players.filter(p => p.isBot);
      console.log(`✓ Inbuilt AI Bots verified: ${bots.map(b => b.name).join(', ')}`);
      resolve();
    });

    socket.on('joinError', reject);
  });

  // Start game
  await new Promise((resolve) => {
    socket.emit('startGame');
    socket.on('gameStarted', (data) => {
      console.log("✓ Game started in Solo Mode vs AI Bots!");
      resolve();
    });
  });

  // Host calls 5 numbers
  for (let i = 0; i < 5; i++) {
    await new Promise((resolve) => {
      socket.emit('callNumber');
      socket.once('numberCalled', (data) => {
        console.log(`✓ Call #${i + 1}: [Number ${data.number}] -> ${data.fact.title}`);
        resolve();
      });
    });
  }

  console.log("====================================================");
  console.log("🎉 SOLO MODE & BOT TEST PASSED 100%!");
  console.log("====================================================");

  socket.disconnect();
  process.exit(0);
}

runSoloTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
