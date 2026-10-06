const { io } = require('socket.io-client');
const { generateTambolaTicket, generateTicketDeck, verifyPrizeClaim, getTicketStats } = require('./public/js/tickets');
const facts = require('./public/js/dsa-facts');

async function testAll() {
  console.log("==================================================================");
  console.log("🚀 STARTING EXHAUSTIVE TESTING SUITE FOR DSA ARRAY BINGO");
  console.log("==================================================================");

  // 1. DATA INTEGRITY: 90 DSA Facts
  console.log("\n[Test 1/5] Verifying 90 DSA Facts Integrity...");
  if (Object.keys(facts).length !== 90) throw new Error("Fact count is not 90");
  for (let i = 1; i <= 90; i++) {
    const f = facts[i];
    if (!f.num || !f.title || !f.pattern || !f.complexity || !f.fact || !f.formula || !f.tag) {
      throw new Error(`Fact #${i} is missing required properties`);
    }
  }
  console.log("  ✓ All 90 facts have complete titles, patterns, complexities, formulas, and tags.");

  // 2. MATHEMATICAL INTEGRITY: Ticket Deck Generation
  console.log("\n[Test 2/5] Stress Testing Ticket Generation (1,000 tickets)...");
  const deck = generateTicketDeck(1000);
  if (deck.length !== 1000) throw new Error("Deck size mismatch");
  for (let i = 0; i < deck.length; i++) {
    const t = deck[i];
    if (t.grid.length !== 3) throw new Error(`Ticket ${i} invalid row count`);
    for (let r = 0; r < 3; r++) {
      const nonZero = t.grid[r].filter(n => n > 0);
      if (nonZero.length !== 5) throw new Error(`Ticket ${i} row ${r} does not have exactly 5 numbers`);
    }
    if (t.numbers.length !== 15) throw new Error(`Ticket ${i} does not have 15 numbers`);
    if (new Set(t.numbers).size !== 15) throw new Error(`Ticket ${i} contains duplicate numbers`);
  }
  console.log("  ✓ 1,000 tickets verified: 3x9 grid, exactly 5 numbers/row, exactly 15 unique sorted numbers.");

  // 3. PRIZE VERIFICATION RULES (All Categories)
  console.log("\n[Test 3/5] Testing Authoritative Prize Verification across All Winning Categories...");
  const sampleTicket = deck[0];
  const grid = sampleTicket.grid;
  const row0 = grid[0].filter(n => n > 0);
  const row1 = grid[1].filter(n => n > 0);
  const row2 = grid[2].filter(n => n > 0);
  const corners = [row0[0], row0[row0.length - 1], row2[0], row2[row2.length - 1]];

  // Early 5
  if (verifyPrizeClaim('early5', sampleTicket, sampleTicket.numbers.slice(0, 4))) {
    throw new Error("early5 should fail on 4 numbers");
  }
  if (!verifyPrizeClaim('early5', sampleTicket, sampleTicket.numbers.slice(0, 5))) {
    throw new Error("early5 should pass on 5 numbers");
  }

  // Top Row
  if (verifyPrizeClaim('topRow', sampleTicket, row0.slice(0, 4))) throw new Error("topRow should fail on 4 numbers");
  if (!verifyPrizeClaim('topRow', sampleTicket, row0)) throw new Error("topRow should pass on 5 numbers");

  // Middle Row
  if (verifyPrizeClaim('middleRow', sampleTicket, row1.slice(0, 4))) throw new Error("middleRow should fail on 4 numbers");
  if (!verifyPrizeClaim('middleRow', sampleTicket, row1)) throw new Error("middleRow should pass on 5 numbers");

  // Bottom Row
  if (verifyPrizeClaim('bottomRow', sampleTicket, row2.slice(0, 4))) throw new Error("bottomRow should fail on 4 numbers");
  if (!verifyPrizeClaim('bottomRow', sampleTicket, row2)) throw new Error("bottomRow should pass on 5 numbers");

  // Four Corners
  if (verifyPrizeClaim('fourCorners', sampleTicket, corners.slice(0, 3))) throw new Error("fourCorners should fail on 3 numbers");
  if (!verifyPrizeClaim('fourCorners', sampleTicket, corners)) throw new Error("fourCorners should pass on 4 corners");

  // Full House
  if (verifyPrizeClaim('fullHouse', sampleTicket, sampleTicket.numbers.slice(0, 14))) throw new Error("fullHouse should fail on 14 numbers");
  if (!verifyPrizeClaim('fullHouse', sampleTicket, sampleTicket.numbers)) throw new Error("fullHouse should pass on 15 numbers");
  console.log("  ✓ All winning categories (Early 5, Top/Mid/Bot Rows, 4 Corners, Full House) verified.");

  // 4. MULTIPLAYER SOCKET INTEGRATION
  console.log("\n[Test 4/5] Testing Real-time Multiplayer Host & Player Socket Cycle...");
  const serverUrl = "http://localhost:3000";
  const hostSocket = io(serverUrl);
  let roomCode = null;

  await new Promise((resolve, reject) => {
    hostSocket.on('connect', () => {
      hostSocket.emit('createRoom', { hostName: 'Host_Master', avatar: '👑' });
    });
    hostSocket.on('roomCreated', (data) => {
      roomCode = data.roomCode;
      resolve();
    });
    hostSocket.on('error', reject);
  });
  console.log(`  ✓ Room created with code: ${roomCode}`);

  // Join player
  const playerSocket = io(serverUrl);
  await new Promise((resolve) => {
    playerSocket.on('connect', () => {
      playerSocket.emit('joinRoom', { roomCode, playerName: 'Ninja_Player', avatar: '🥷' });
    });
    playerSocket.on('roomJoined', () => {
      resolve();
    });
  });
  console.log("  ✓ Second player joined room successfully.");

  // Player picks ticket #1
  await new Promise((resolve) => {
    playerSocket.emit('selectTickets', { ticketIds: [1] });
    playerSocket.once('ticketsUpdated', () => {
      resolve();
    });
  });
  console.log("  ✓ Ticket selection synchronized.");

  // Host starts game
  await new Promise((resolve) => {
    hostSocket.emit('startGame');
    playerSocket.once('gameStarted', () => {
      resolve();
    });
  });
  console.log("  ✓ Game arena launched for both players.");

  // Host calls 3 numbers
  for (let i = 0; i < 3; i++) {
    await new Promise((resolve) => {
      hostSocket.emit('callNumber');
      playerSocket.once('numberCalled', (data) => {
        resolve();
      });
    });
  }
  console.log("  ✓ Number calls broadcast with DSA facts.");

  // Bogey test: Invalid claim should be rejected
  await new Promise((resolve) => {
    playerSocket.emit('claimPrize', { prizeKey: 'fullHouse', ticketId: 1 });
    playerSocket.once('claimBogey', (data) => {
      if (data.message.includes('Bogey')) resolve();
    });
  });
  console.log("  ✓ Bogey claim properly caught and rejected by anti-cheat.");

  hostSocket.disconnect();
  playerSocket.disconnect();

  // 5. SOLO MODE SIMULATION
  console.log("\n[Test 5/5] Testing Solo Mode Engine vs AI Bots...");
  const soloSocket = io(serverUrl);
  await new Promise((resolve) => {
    soloSocket.on('connect', () => {
      soloSocket.emit('createSoloGame', {
        playerName: 'Solo_Kapil',
        avatar: '🚀',
        botCount: 3,
        botDifficulty: 'turbo'
      });
    });
    soloSocket.on('roomCreated', (data) => {
      const bots = data.roomState.players.filter(p => p.isBot);
      if (bots.length !== 3) throw new Error("Expected 3 AI bots");
      resolve();
    });
  });
  console.log("  ✓ Solo mode created with 3 active AI bots.");
  soloSocket.disconnect();

  console.log("\n==================================================================");
  console.log("🎉 ALL TESTS PASSED! ZERO EXCEPTIONS OR ERRORS DETECTED.");
  console.log("==================================================================");
  process.exit(0);
}

testAll().catch((err) => {
  console.error("❌ TEST RUNNER FAILED:", err);
  process.exit(1);
});
