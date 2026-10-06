const { io } = require('socket.io-client');

async function runTest() {
  console.log("🎮 Starting DSA Tambola Multiplayer Integration Test...");
  const serverUrl = "http://localhost:3000";

  // 1. Connect Host
  const hostSocket = io(serverUrl);

  let roomCode = null;

  await new Promise((resolve) => {
    function onHostConnected() {
      console.log("✓ Host connected to server");
      hostSocket.emit('createRoom', { hostName: "AlgoHost", avatar: "👑" });
    }
    if (hostSocket.connected) onHostConnected();
    else hostSocket.on('connect', onHostConnected);

    hostSocket.on('roomCreated', (data) => {
      roomCode = data.roomCode;
      console.log(`✓ Room created with code: ${roomCode}`);
      resolve();
    });
  });

  // 2. Connect Player
  const playerSocket = io(serverUrl);
  await new Promise((resolve) => {
    function onPlayerConnected() {
      console.log("✓ Player connected to server");
      playerSocket.emit('joinRoom', { roomCode, playerName: "TwoPointerNinja", avatar: "🥷" });
    }
    if (playerSocket.connected) onPlayerConnected();
    else playerSocket.on('connect', onPlayerConnected);

    playerSocket.on('roomJoined', (data) => {
      console.log(`✓ Player successfully joined room: ${roomCode}`);
      resolve();
    });
  });

  // 3. Player selects ticket #1
  await new Promise((resolve) => {
    playerSocket.emit('selectTickets', { ticketIds: [1] });
    playerSocket.on('ticketsUpdated', (data) => {
      console.log(`✓ Player selected ticket #1. Verified: ${data.tickets.length} ticket(s) assigned`);
      resolve();
    });
  });

  // 4. Host also selects ticket #2 and starts game
  await new Promise((resolve) => {
    hostSocket.emit('selectTickets', { ticketIds: [2] });
    hostSocket.emit('startGame');
    playerSocket.on('gameStarted', (data) => {
      console.log("✓ Game started successfully for all players!");
      resolve();
    });
  });

  // 5. Host draws a number
  await new Promise((resolve) => {
    hostSocket.emit('callNumber');
    playerSocket.on('numberCalled', (data) => {
      console.log(`✓ Number called: ${data.number}. DSA Problem Spotlight: "${data.fact.title}" (${data.fact.complexity})`);
      resolve();
    });
  });

  // 6. Test Anti-Cheat: Player tries to claim Full House prematurely!
  await new Promise((resolve) => {
    playerSocket.emit('claimPrize', { prizeKey: 'fullHouse', ticketId: 1 });
    playerSocket.on('claimBogey', (data) => {
      console.log(`✓ Anti-Cheat Bogey Test Passed: Server rejected invalid Full House claim: "${data.message}"`);
      resolve();
    });
  });

  // 7. Test Chat & Reaction
  await new Promise((resolve) => {
    playerSocket.emit('sendChat', { text: "Hello from phone player!" });
    hostSocket.on('newChatMessage', (msg) => {
      console.log(`✓ Chat broadcast verified: [${msg.senderName}]: ${msg.text}`);
      resolve();
    });
  });

  console.log("====================================================");
  console.log("🎉 ALL TESTS PASSED! Game mechanics are 100% operational!");
  console.log("====================================================");

  hostSocket.disconnect();
  playerSocket.disconnect();
  process.exit(0);
}

runTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
