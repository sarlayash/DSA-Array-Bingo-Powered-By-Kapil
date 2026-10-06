const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const os = require('os');
const { generateTambolaTicket, generateTicketDeck, verifyPrizeClaim, getTicketStats } = require('./public/js/tickets');
const DSA_FACTS = require('./public/js/dsa-facts');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// DSA themed room name prefixes
const ROOM_PREFIXES = ['SARLAYASH', 'KAPIL', 'ARRAY', 'POINTER', 'VECTOR', 'MATRIX', 'WINDOW', 'KADANE', 'PREFIX', 'STACK'];

function generateRoomCode(isSolo = false) {
  if (isSolo) {
    return `SOLO-${Math.floor(100 + Math.random() * 900)}`;
  }
  const prefix = ROOM_PREFIXES[Math.floor(Math.random() * ROOM_PREFIXES.length)];
  const num = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${num}`;
}

// Global rooms map
const rooms = new Map();

// Standard Winning Categories (Rows, Corners, Early 5, Full House, 2nd Full House)
function createInitialPrizes() {
  return {
    early5: { key: 'early5', name: "Early 5 (Jaldi 5)", icon: "⚡", points: 100, winner: null },
    topRow: { key: 'topRow', name: "Top Row (Line 1)", icon: "🎯", points: 150, winner: null },
    middleRow: { key: 'middleRow', name: "Middle Row (Line 2)", icon: "⚔️", points: 150, winner: null },
    bottomRow: { key: 'bottomRow', name: "Bottom Row (Line 3)", icon: "🛡️", points: 150, winner: null },
    fourCorners: { key: 'fourCorners', name: "Four Corners", icon: "💎", points: 200, winner: null },
    fullHouse: { key: 'fullHouse', name: "Full House (1st Housie)", icon: "👑", points: 500, winner: null },
    fullHouse2: { key: 'fullHouse2', name: "2nd Full House (Runner Up)", icon: "🥈", points: 300, winner: null }
  };
}

// Bot Personalities
const BOT_PERSONAS = [
  { name: '🤖 ByteBot', avatar: '🤖' },
  { name: '⚡ AlgoTron', avatar: '⚡' },
  { name: '🧙 PointerMage', avatar: '🧙' },
  { name: '👾 MatrixDroid', avatar: '👾' },
  { name: '🦊 KadaneFox', avatar: '🦊' }
];

function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  return addresses;
}

// API endpoint to get server info & local IP for phone sharing
app.get('/api/info', (req, res) => {
  res.json({
    brand: "SarlaYash Productions presents DSA Array Bingo Powered By Kapil",
    localIps: getLocalIpAddresses(),
    port: PORT
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  let currentRoomCode = null;

  // 1. Host creates a new multiplayer game room
  socket.on('createRoom', ({ hostName, avatar }) => {
    let roomCode = generateRoomCode();
    while (rooms.has(roomCode)) {
      roomCode = generateRoomCode();
    }

    const deck = generateTicketDeck(60);
    const availableNumbers = [];
    for (let i = 1; i <= 90; i++) availableNumbers.push(i);
    for (let i = availableNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableNumbers[i], availableNumbers[j]] = [availableNumbers[j], availableNumbers[i]];
    }

    const newRoom = {
      code: roomCode,
      hostId: socket.id,
      hostName: hostName || 'Host Master',
      status: 'lobby',
      isSolo: false,
      botDifficulty: 'medium',
      calledNumbers: [],
      currentNumber: null,
      availableNumbers: availableNumbers,
      deck: deck,
      claimedTicketIds: new Set(),
      players: new Map(),
      prizes: createInitialPrizes(),
      callSpeed: 5000,
      autoCallerTimer: null,
      botClaimTimers: [],
      chatMessages: []
    };

    const hostPlayer = {
      id: socket.id,
      name: hostName || 'Host Master',
      avatar: avatar || '👑',
      isHost: true,
      isBot: false,
      tickets: [],
      claimsWon: []
    };
    newRoom.players.set(socket.id, hostPlayer);
    rooms.set(roomCode, newRoom);

    currentRoomCode = roomCode;
    socket.join(roomCode);

    socket.emit('roomCreated', {
      roomCode: roomCode,
      roomState: sanitizeRoomState(newRoom),
      player: hostPlayer
    });
  });

  // 2. Single Player Mode vs Inbuilt Bot Players
  socket.on('createSoloGame', ({ playerName, avatar, botCount = 2, botDifficulty = 'medium' }) => {
    let roomCode = generateRoomCode(true);
    while (rooms.has(roomCode)) {
      roomCode = generateRoomCode(true);
    }

    const deck = generateTicketDeck(60);
    const availableNumbers = [];
    for (let i = 1; i <= 90; i++) availableNumbers.push(i);
    for (let i = availableNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableNumbers[i], availableNumbers[j]] = [availableNumbers[j], availableNumbers[i]];
    }

    const newRoom = {
      code: roomCode,
      hostId: socket.id,
      hostName: playerName || 'Player',
      status: 'lobby',
      isSolo: true,
      botDifficulty: botDifficulty || 'medium',
      calledNumbers: [],
      currentNumber: null,
      availableNumbers: availableNumbers,
      deck: deck,
      claimedTicketIds: new Set(),
      players: new Map(),
      prizes: createInitialPrizes(),
      callSpeed: 4500,
      autoCallerTimer: null,
      botClaimTimers: [],
      chatMessages: []
    };

    // Human player (gets ticket #1 automatically, but can select more)
    const humanPlayer = {
      id: socket.id,
      name: playerName || 'Player',
      avatar: avatar || '💻',
      isHost: true,
      isBot: false,
      tickets: [deck[0]],
      claimsWon: []
    };
    newRoom.claimedTicketIds.add(deck[0].id);
    newRoom.players.set(socket.id, humanPlayer);

    // Create Inbuilt Bots
    const numBots = Math.min(4, Math.max(1, botCount));
    for (let i = 0; i < numBots; i++) {
      const persona = BOT_PERSONAS[i % BOT_PERSONAS.length];
      const botId = `bot-${i + 1}`;
      const botTicket = deck[i + 1];
      newRoom.claimedTicketIds.add(botTicket.id);

      const botPlayer = {
        id: botId,
        name: persona.name,
        avatar: persona.avatar,
        isHost: false,
        isBot: true,
        tickets: [botTicket],
        claimsWon: []
      };
      newRoom.players.set(botId, botPlayer);
    }

    rooms.set(roomCode, newRoom);
    currentRoomCode = roomCode;
    socket.join(roomCode);

    socket.emit('roomCreated', {
      roomCode: roomCode,
      roomState: sanitizeRoomState(newRoom),
      player: humanPlayer
    });
  });

  // 3. Add AI Bot into any existing room
  socket.on('addBot', () => {
    if (!currentRoomCode) return;
    const room = rooms.get(currentRoomCode);
    if (!room || room.hostId !== socket.id) return;

    const availableTickets = room.deck.filter(t => !room.claimedTicketIds.has(t.id));
    if (availableTickets.length === 0) return;

    const botIndex = room.players.size;
    const persona = BOT_PERSONAS[botIndex % BOT_PERSONAS.length];
    const botId = `bot-${Date.now()}`;
    const botTicket = availableTickets[0];
    room.claimedTicketIds.add(botTicket.id);

    const botPlayer = {
      id: botId,
      name: persona.name,
      avatar: persona.avatar,
      isHost: false,
      isBot: true,
      tickets: [botTicket],
      claimsWon: []
    };

    room.players.set(botId, botPlayer);

    io.to(currentRoomCode).emit('playerJoined', {
      player: botPlayer,
      playerCount: room.players.size,
      players: Array.from(room.players.values())
    });

    io.to(currentRoomCode).emit('ticketsUpdated', {
      playerId: botId,
      tickets: [botTicket],
      claimedTicketIds: Array.from(room.claimedTicketIds)
    });
  });

  // 4. Join an existing game room
  socket.on('joinRoom', ({ roomCode, playerName, avatar }) => {
    if (!roomCode) {
      return socket.emit('joinError', { message: 'Room code is required.' });
    }

    const code = roomCode.toUpperCase().trim();
    const room = rooms.get(code);

    if (!room) {
      return socket.emit('joinError', { message: `Room "${code}" not found. Check code or create a new room.` });
    }

    const existingPlayer = room.players.get(socket.id);
    const player = {
      id: socket.id,
      name: playerName ? playerName.trim().substring(0, 20) : `Player_${Math.floor(100 + Math.random() * 900)}`,
      avatar: avatar || '🎮',
      isHost: room.hostId === socket.id,
      isBot: false,
      tickets: existingPlayer ? existingPlayer.tickets : [],
      claimsWon: existingPlayer ? existingPlayer.claimsWon : []
    };

    room.players.set(socket.id, player);
    currentRoomCode = code;
    socket.join(code);

    socket.emit('roomJoined', {
      roomCode: code,
      roomState: sanitizeRoomState(room),
      player: player
    });

    io.to(code).emit('playerJoined', {
      player: player,
      playerCount: room.players.size,
      players: Array.from(room.players.values())
    });
  });

  // 5. Select / Claim ticket(s) from room deck
  socket.on('selectTickets', ({ ticketIds }) => {
    if (!currentRoomCode) return;
    const room = rooms.get(currentRoomCode);
    if (!room) return;

    const player = room.players.get(socket.id);
    if (!player) return;

    for (const t of player.tickets) {
      room.claimedTicketIds.delete(t.id);
    }

    const selectedTickets = [];
    for (const tId of ticketIds) {
      const ticket = room.deck.find(d => d.id === tId);
      if (ticket) {
        selectedTickets.push(ticket);
        room.claimedTicketIds.add(tId);
      }
    }

    player.tickets = selectedTickets;

    io.to(currentRoomCode).emit('ticketsUpdated', {
      playerId: player.id,
      tickets: selectedTickets,
      claimedTicketIds: Array.from(room.claimedTicketIds)
    });
  });

  // 6. Request custom random tickets
  socket.on('requestRandomTickets', ({ count = 1 }) => {
    if (!currentRoomCode) return;
    const room = rooms.get(currentRoomCode);
    if (!room) return;

    const player = room.players.get(socket.id);
    if (!player) return;

    const available = room.deck.filter(t => !room.claimedTicketIds.has(t.id));
    const countToPick = Math.min(count, Math.max(1, available.length));

    for (const t of player.tickets) {
      room.claimedTicketIds.delete(t.id);
    }

    const picked = available.slice(0, countToPick);
    for (const t of picked) {
      room.claimedTicketIds.add(t.id);
    }
    player.tickets = picked;

    io.to(currentRoomCode).emit('ticketsUpdated', {
      playerId: player.id,
      tickets: picked,
      claimedTicketIds: Array.from(room.claimedTicketIds)
    });
  });

  // 7. Host starts game
  socket.on('startGame', () => {
    if (!currentRoomCode) return;
    const room = rooms.get(currentRoomCode);
    if (!room || room.hostId !== socket.id) return;

    room.status = 'playing';
    io.to(currentRoomCode).emit('gameStarted', {
      status: room.status
    });
  });

  // 8. Host draws / calls next number
  socket.on('callNumber', () => {
    if (!currentRoomCode) return;
    const room = rooms.get(currentRoomCode);
    if (!room || room.hostId !== socket.id) return;

    drawNextNumber(room);
  });

  // 9. Host toggles auto caller
  socket.on('toggleAutoCaller', ({ enabled, speed }) => {
    if (!currentRoomCode) return;
    const room = rooms.get(currentRoomCode);
    if (!room || room.hostId !== socket.id) return;

    if (speed && speed >= 2000) {
      room.callSpeed = speed;
    }

    if (enabled) {
      if (room.autoCallerTimer) clearInterval(room.autoCallerTimer);
      drawNextNumber(room);
      room.autoCallerTimer = setInterval(() => {
        if (room.status !== 'playing' || room.availableNumbers.length === 0) {
          clearInterval(room.autoCallerTimer);
          room.autoCallerTimer = null;
          return;
        }
        drawNextNumber(room);
      }, room.callSpeed);

      io.to(currentRoomCode).emit('autoCallerChanged', {
        enabled: true,
        speed: room.callSpeed
      });
    } else {
      if (room.autoCallerTimer) {
        clearInterval(room.autoCallerTimer);
        room.autoCallerTimer = null;
      }
      io.to(currentRoomCode).emit('autoCallerChanged', {
        enabled: false,
        speed: room.callSpeed
      });
    }
  });

  // Helper: Draw next number in room
  function drawNextNumber(room) {
    if (room.availableNumbers.length === 0) {
      room.status = 'finished';
      if (room.autoCallerTimer) {
        clearInterval(room.autoCallerTimer);
        room.autoCallerTimer = null;
      }
      io.to(room.code).emit('gameFinished', {
        message: 'All 90 numbers have been called! Game Over.'
      });
      return;
    }

    const nextNum = room.availableNumbers.pop();
    room.calledNumbers.push(nextNum);
    room.currentNumber = nextNum;

    const fact = DSA_FACTS[nextNum] || {
      num: nextNum,
      title: `Array Memory Cell [${nextNum}]`,
      pattern: "Contiguous Array",
      complexity: "O(1) Access",
      fact: `Number ${nextNum} called! Stored at offset index ${nextNum - 1} in memory buffer.`,
      formula: `arr[${nextNum - 1}]`
    };

    io.to(room.code).emit('numberCalled', {
      number: nextNum,
      calledNumbers: room.calledNumbers,
      remainingCount: room.availableNumbers.length,
      fact: fact
    });

    // Check if AI Bot players qualify for open prizes!
    checkBotClaims(room);
  }

  // AI Bot Prize Checker & Claim Simulator
  function checkBotClaims(room) {
    if (!room || room.status !== 'playing') return;

    for (const player of room.players.values()) {
      if (!player.isBot || !player.tickets || player.tickets.length === 0) continue;
      const ticket = player.tickets[0];

      for (const [key, prize] of Object.entries(room.prizes)) {
        if (prize.winner) continue; // Already won

        if (verifyPrizeClaim(key, ticket, room.calledNumbers)) {
          // Calculate realistic human-like reaction time
          let delay = 2200;
          if (room.botDifficulty === 'easy') delay = 3200 + Math.random() * 2000;
          else if (room.botDifficulty === 'hard') delay = 900 + Math.random() * 800;
          else delay = 1600 + Math.random() * 1200;

          const timerId = setTimeout(() => {
            if (!prize.winner && room.status === 'playing') {
              awardPrize(room, key, player, ticket.id);
            }
          }, delay);

          if (!room.botClaimTimers) room.botClaimTimers = [];
          room.botClaimTimers.push(timerId);
        }
      }
    }
  }

  // Award prize helper
  function awardPrize(room, prizeKey, player, ticketId) {
    const prize = room.prizes[prizeKey];
    if (!prize || prize.winner) return;

    prize.winner = {
      playerId: player.id,
      playerName: player.name,
      avatar: player.avatar,
      ticketId: ticketId,
      isBot: !!player.isBot,
      time: new Date().toLocaleTimeString()
    };

    if (!player.claimsWon) player.claimsWon = [];
    player.claimsWon.push({
      prizeKey: prizeKey,
      prizeName: prize.name,
      ticketId: ticketId,
      points: prize.points
    });

    io.to(room.code).emit('prizeWon', {
      prizeKey: prizeKey,
      prize: prize,
      winner: prize.winner,
      prizes: room.prizes,
      players: Array.from(room.players.values())
    });
  }

  // 10. Player claims a prize (Early 5, Rows, Corners, Full House)
  socket.on('claimPrize', ({ prizeKey, ticketId }) => {
    if (!currentRoomCode) return;
    const room = rooms.get(currentRoomCode);
    if (!room) return;

    const player = room.players.get(socket.id);
    if (!player) return;

    // Normalize prize key aliases (e.g. topLine -> topRow)
    let normalizedKey = prizeKey;
    if (prizeKey === 'topLine') normalizedKey = 'topRow';
    if (prizeKey === 'middleLine') normalizedKey = 'middleRow';
    if (prizeKey === 'bottomLine') normalizedKey = 'bottomRow';

    const prize = room.prizes[normalizedKey] || room.prizes[prizeKey];
    if (!prize) {
      return socket.emit('claimBogey', {
        message: 'Invalid prize category specified.'
      });
    }

    if (prize.winner) {
      return socket.emit('claimBogey', {
        message: `${prize.name} has already been claimed by ${prize.winner.playerName}!`
      });
    }

    const ticket = player.tickets.find(t => t.id === ticketId);
    if (!ticket) {
      return socket.emit('claimBogey', {
        message: 'Ticket not found in your active tickets.'
      });
    }

    const isValid = verifyPrizeClaim(normalizedKey, ticket, room.calledNumbers);

    if (isValid) {
      awardPrize(room, normalizedKey, player, ticket.id);
    } else {
      const stats = getTicketStats(ticket, room.calledNumbers);
      socket.emit('claimBogey', {
        prizeKey: normalizedKey,
        message: `⚠️ Bogey Claim! Your ticket doesn't meet the conditions for ${prize.name} yet. (You have marked ${stats.marked}/15 numbers). Keep playing!`
      });
    }
  });

  // 11. Host resets / restarts the game
  socket.on('restartGame', () => {
    if (!currentRoomCode) return;
    const room = rooms.get(currentRoomCode);
    if (!room || room.hostId !== socket.id) return;

    if (room.autoCallerTimer) {
      clearInterval(room.autoCallerTimer);
      room.autoCallerTimer = null;
    }
    if (room.botClaimTimers) {
      room.botClaimTimers.forEach(t => clearTimeout(t));
      room.botClaimTimers = [];
    }

    const availableNumbers = [];
    for (let i = 1; i <= 90; i++) availableNumbers.push(i);
    for (let i = availableNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableNumbers[i], availableNumbers[j]] = [availableNumbers[j], availableNumbers[i]];
    }

    room.calledNumbers = [];
    room.currentNumber = null;
    room.availableNumbers = availableNumbers;
    room.status = 'lobby';
    room.prizes = createInitialPrizes();

    for (const player of room.players.values()) {
      player.claimsWon = [];
    }

    io.to(currentRoomCode).emit('gameReset', {
      roomState: sanitizeRoomState(room)
    });
  });

  // 12. Chat & live emoji reactions
  socket.on('sendChat', ({ text }) => {
    if (!currentRoomCode || !text) return;
    const room = rooms.get(currentRoomCode);
    if (!room) return;

    const player = room.players.get(socket.id);
    if (!player) return;

    const chatItem = {
      id: Date.now(),
      senderId: player.id,
      senderName: player.name,
      avatar: player.avatar,
      text: text.trim().substring(0, 100),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    room.chatMessages.push(chatItem);
    if (room.chatMessages.length > 50) room.chatMessages.shift();

    io.to(currentRoomCode).emit('newChatMessage', chatItem);
  });

  socket.on('sendReaction', ({ emoji }) => {
    if (!currentRoomCode || !emoji) return;
    const room = rooms.get(currentRoomCode);
    if (!room) return;

    const player = room.players.get(socket.id);
    if (!player) return;

    io.to(currentRoomCode).emit('newReaction', {
      senderName: player.name,
      avatar: player.avatar,
      emoji: emoji
    });
  });

  // Handle Disconnect
  socket.on('disconnect', () => {
    if (!currentRoomCode) return;
    const room = rooms.get(currentRoomCode);
    if (!room) return;

    const leavingPlayer = room.players.get(socket.id);
    if (leavingPlayer) {
      for (const t of leavingPlayer.tickets) {
        room.claimedTicketIds.delete(t.id);
      }
      room.players.delete(socket.id);

      if (room.hostId === socket.id) {
        if (room.autoCallerTimer) {
          clearInterval(room.autoCallerTimer);
          room.autoCallerTimer = null;
        }
        if (room.botClaimTimers) {
          room.botClaimTimers.forEach(t => clearTimeout(t));
          room.botClaimTimers = [];
        }

        const remainingHumans = Array.from(room.players.values()).filter(p => !p.isBot);
        if (remainingHumans.length > 0) {
          const nextHost = remainingHumans[0];
          room.hostId = nextHost.id;
          nextHost.isHost = true;
          io.to(currentRoomCode).emit('newHostAssigned', {
            hostId: nextHost.id,
            hostName: nextHost.name
          });
        } else {
          rooms.delete(currentRoomCode);
          return;
        }
      }

      io.to(currentRoomCode).emit('playerLeft', {
        playerId: socket.id,
        playerName: leavingPlayer.name,
        playerCount: room.players.size,
        players: Array.from(room.players.values()),
        claimedTicketIds: Array.from(room.claimedTicketIds)
      });
    }
  });
});

function sanitizeRoomState(room) {
  return {
    code: room.code,
    hostId: room.hostId,
    hostName: room.hostName,
    status: room.status,
    isSolo: !!room.isSolo,
    calledNumbers: room.calledNumbers,
    currentNumber: room.currentNumber,
    remainingCount: room.availableNumbers.length,
    deck: room.deck,
    claimedTicketIds: Array.from(room.claimedTicketIds),
    players: Array.from(room.players.values()),
    prizes: room.prizes,
    callSpeed: room.callSpeed,
    chatMessages: room.chatMessages
  };
}

server.listen(PORT, '0.0.0.0', () => {
  const ips = getLocalIpAddresses();
  console.log(`====================================================`);
  console.log(`🎬 SARLAYASH PRODUCTIONS PRESENTS`);
  console.log(`🎮 DSA ARRAY BINGO - POWERED BY KAPIL!`);
  console.log(`🌐 Local Web:    http://localhost:${PORT}`);
  ips.forEach(ip => {
    console.log(`📱 Phone Access: http://${ip}:${PORT}`);
  });
  console.log(`====================================================`);
});
