// =====================================================================
// SARLAYASH PRODUCTIONS PRESENTS DSA ARRAY BINGO - POWERED BY KAPIL
// Client Orchestration, AI Bot Multiplayer, Audio Announcements, and Certificates
// =====================================================================

document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  // State
  let myPlayer = {
    id: null,
    name: 'Player',
    avatar: '💻',
    isHost: false,
    tickets: []
  };

  let currentRoom = null;
  let browseTicketIndex = 1;
  let selectedTicketIds = new Set();
  let maxTicketsAllowed = 1;
  let daubedNumbersByTicket = new Map();
  let deferredInstallPrompt = null;
  let localServerIps = [];

  // Certificate & Badge State
  let activeCertTab = 'cert'; // 'cert' | 'badge'
  let latestAwardData = {
    winnerName: 'Kapil',
    prizeName: 'Full House (Grand Winner)',
    prizeKey: 'fullHouse',
    avatar: '👑',
    points: 500,
    certId: `SYP-KAPIL-${Math.floor(10000 + Math.random() * 90000)}-FH`,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  };
  let myWonPrizes = [];

  // ================= DOM ELEMENTS =================
  const views = {
    welcome: document.getElementById('view-welcome'),
    lobby: document.getElementById('view-lobby'),
    game: document.getElementById('view-game')
  };

  // Header Elements
  const roomCodeBadge = document.getElementById('room-code-badge');
  const displayRoomCode = document.getElementById('display-room-code');
  const btnCopyLink = document.getElementById('btn-copy-link');
  const playerProfilePill = document.getElementById('player-profile-pill');
  const playerAvatarBadge = document.getElementById('player-avatar-badge');
  const playerNameBadge = document.getElementById('player-name-badge');
  const btnOpenAwards = document.getElementById('btn-open-awards');
  const btnToggleSound = document.getElementById('btn-toggle-sound');
  const btnToggleVoice = document.getElementById('btn-toggle-voice');
  const btnOpenCodex = document.getElementById('btn-open-codex');
  const btnInstallApp = document.getElementById('btn-install-app');
  const btnToggleFullscreen = document.getElementById('btn-toggle-fullscreen');
  const toastContainer = document.getElementById('toast-container');
  const reactionsContainer = document.getElementById('reactions-container');

  // Welcome View
  const avatarPicker = document.getElementById('avatar-picker');
  const inputPlayerName = document.getElementById('input-player-name');
  const btnOpenSoloModal = document.getElementById('btn-open-solo-modal');
  const btnCreateGame = document.getElementById('btn-create-game');
  const btnJoinGame = document.getElementById('btn-join-game');
  const inputRoomCode = document.getElementById('input-room-code');

  // Solo Setup Modal
  const modalSoloSetup = document.getElementById('modal-solo-setup');
  const btnStartSoloMatch = document.getElementById('btn-start-solo-match');

  // Lobby View
  const lobbyRoomCode = document.getElementById('lobby-room-code');
  const lobbyPlayerCountBadge = document.getElementById('lobby-player-count-badge');
  const lobbyRoleBadge = document.getElementById('lobby-role-badge');
  const lobbyModeBadge = document.getElementById('lobby-mode-badge');
  const btnAddBotLobby = document.getElementById('btn-add-bot-lobby');
  const btnShareModal = document.getElementById('btn-share-modal');
  const previewTicketMount = document.getElementById('preview-ticket-mount');
  const ticketBrowseIndicator = document.getElementById('ticket-browse-indicator');
  const btnPrevTicket = document.getElementById('btn-prev-ticket');
  const btnNextTicket = document.getElementById('btn-next-ticket');
  const btnSelectCurrentTicket = document.getElementById('btn-select-current-ticket');
  const btnRandomTicket = document.getElementById('btn-random-ticket');
  const selectedTicketsList = document.getElementById('selected-tickets-list');
  const selectedTicketCount = document.getElementById('selected-ticket-count');
  const lobbyPlayersList = document.getElementById('lobby-players-list');
  const hostStartPanel = document.getElementById('host-start-panel');
  const playerWaitingPanel = document.getElementById('player-waiting-panel');
  const btnStartGame = document.getElementById('btn-start-game');

  // Arena View
  const callCounter = document.getElementById('call-counter');
  const ballDisplay = document.getElementById('ball-display');
  const currentBallNum = document.getElementById('current-ball-num');
  const arenaHostControls = document.getElementById('arena-host-controls');
  const btnCallNext = document.getElementById('btn-call-next');
  const checkAutoCaller = document.getElementById('check-auto-caller');
  const selectCallSpeed = document.getElementById('select-call-speed');
  const dsaTopicTag = document.getElementById('dsa-topic-tag');
  const dsaComplexityTag = document.getElementById('dsa-complexity-tag');
  const dsaPatternTag = document.getElementById('dsa-pattern-tag');
  const dsaProblemTitle = document.getElementById('dsa-problem-title');
  const dsaProblemFact = document.getElementById('dsa-problem-fact');
  const dsaCodeHint = document.getElementById('dsa-code-hint');
  const btnViewDsaModal = document.getElementById('btn-view-dsa-modal');
  const recentCallsList = document.getElementById('recent-calls-list');
  const checkAutoDaub = document.getElementById('check-auto-daub');
  const gameTicketsContainer = document.getElementById('game-tickets-container');
  const masterBoardGrid = document.getElementById('master-board-grid');
  const boardMarkedCount = document.getElementById('board-marked-count');
  const prizesWonCount = document.getElementById('prizes-won-count');
  const prizesStatusList = document.getElementById('prizes-status-list');
  const arenaPlayerCount = document.getElementById('arena-player-count');
  const arenaPlayersList = document.getElementById('arena-players-list');
  const chatMessagesBox = document.getElementById('chat-messages-box');
  const inputChatText = document.getElementById('input-chat-text');
  const btnSendChat = document.getElementById('btn-send-chat');

  // Modals
  const modalCertificate = document.getElementById('modal-certificate');
  const certCanvasMount = document.getElementById('cert-canvas-mount');
  const btnTabViewCert = document.getElementById('btn-tab-view-cert');
  const btnTabViewBadge = document.getElementById('btn-tab-view-badge');
  const btnDownloadPng = document.getElementById('btn-download-png');
  const btnDownloadPdf = document.getElementById('btn-download-pdf');

  const modalWinner = document.getElementById('modal-winner');
  const modalWinnerAvatar = document.getElementById('modal-winner-avatar');
  const modalWinnerName = document.getElementById('modal-winner-name');
  const modalWinnerPrize = document.getElementById('modal-winner-prize');
  const modalWinnerPoints = document.getElementById('modal-winner-points');
  const btnOpenCertFromWinner = document.getElementById('btn-open-cert-from-winner');

  const modalBogey = document.getElementById('modal-bogey');
  const bogeyReasonText = document.getElementById('bogey-reason-text');

  const modalShare = document.getElementById('modal-share');
  const shareModalRoomCode = document.getElementById('share-modal-room-code');
  const inputShareLink = document.getElementById('input-share-link');
  const btnCopyModalLink = document.getElementById('btn-copy-modal-link');
  const localIpHint = document.getElementById('local-ip-hint');

  const modalCodex = document.getElementById('modal-codex');
  const inputCodexSearch = document.getElementById('input-codex-search');
  const codexCardsContainer = document.getElementById('codex-cards-container');

  const modalInstall = document.getElementById('modal-install');
  const btnTriggerPwaInstall = document.getElementById('btn-trigger-pwa-install');

  // ================= LOCAL STORAGE LOAD =================
  try {
    const savedName = localStorage.getItem('syp_bingo_nickname');
    if (savedName) inputPlayerName.value = savedName;
    const savedAvatar = localStorage.getItem('syp_bingo_avatar');
    if (savedAvatar) {
      myPlayer.avatar = savedAvatar;
      document.querySelectorAll('.avatar-opt').forEach(opt => {
        opt.classList.toggle('selected', opt.dataset.avatar === savedAvatar);
      });
    }
    const savedAwards = localStorage.getItem('syp_bingo_awards');
    if (savedAwards) myWonPrizes = JSON.parse(savedAwards);
  } catch (e) {}

  fetch('/api/info')
    .then(r => r.json())
    .then(data => {
      localServerIps = data.localIps || [];
      updateLocalIpsDisplay(data.port || 3000);
    })
    .catch(() => {});

  const urlParams = new URLSearchParams(window.location.search);
  const roomQuery = urlParams.get('room') || urlParams.get('join');
  if (roomQuery) {
    inputRoomCode.value = roomQuery.toUpperCase().trim();
  }

  initMasterBoard();

  // Avatar Picker
  avatarPicker.addEventListener('click', (e) => {
    const btn = e.target.closest('.avatar-opt');
    if (!btn) return;
    document.querySelectorAll('.avatar-opt').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    myPlayer.avatar = btn.dataset.avatar;
    try { localStorage.setItem('syp_bingo_avatar', myPlayer.avatar); } catch (e) {}
    soundManager.playClick();
  });

  // Ticket count toggle buttons (1, 2, 3)
  document.querySelectorAll('.btn-count').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-count').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      maxTicketsAllowed = parseInt(btn.dataset.count, 10) || 1;
      soundManager.playClick();
      if (selectedTicketIds.size > maxTicketsAllowed) {
        const arr = Array.from(selectedTicketIds).slice(0, maxTicketsAllowed);
        selectedTicketIds = new Set(arr);
        syncSelectedTicketsWithServer();
      }
      updateSelectedTicketsTray();
    });
  });

  function switchView(viewName) {
    Object.keys(views).forEach(k => {
      views[k].classList.remove('active');
    });
    if (views[viewName]) {
      views[viewName].classList.add('active');
    }
  }

  function getPlayerName() {
    const raw = inputPlayerName.value.trim();
    const name = raw || `Player_${Math.floor(100 + Math.random() * 900)}`;
    try { localStorage.setItem('syp_bingo_nickname', name); } catch (e) {}
    return name;
  }

  // ================= SINGLE PLAYER / SOLO VS BOTS =================
  btnOpenSoloModal.addEventListener('click', () => {
    soundManager.playClick();
    modalSoloSetup.classList.remove('hidden');
  });

  // Bot Count and Difficulty Selectors
  document.querySelectorAll('.bot-count-selector .btn-opt-box').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bot-count-selector .btn-opt-box').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      soundManager.playClick();
    });
  });

  document.querySelectorAll('.bot-diff-selector .btn-opt-box').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bot-diff-selector .btn-opt-box').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      soundManager.playClick();
    });
  });

  btnStartSoloMatch.addEventListener('click', () => {
    soundManager.playClick();
    const name = getPlayerName();
    myPlayer.name = name;

    const countBtn = document.querySelector('.bot-count-selector .btn-opt-box.selected');
    const diffBtn = document.querySelector('.bot-diff-selector .btn-opt-box.selected');

    const botCount = countBtn ? parseInt(countBtn.dataset.bots, 10) : 2;
    const botDifficulty = diffBtn ? diffBtn.dataset.diff : 'medium';

    modalSoloSetup.classList.add('hidden');
    if (socket && socket.connected) {
      socket.emit('createSoloGame', {
        playerName: name,
        avatar: myPlayer.avatar,
        botCount: botCount,
        botDifficulty: botDifficulty
      });
    } else {
      startClientSideSoloGame(name, myPlayer.avatar, botCount, botDifficulty);
    }
  });

  // Client-Side Standalone Solo Engine for GitHub Pages / Offline Play
  let clientSoloMode = false;
  let clientBotClaimTimers = [];
  let clientAutoCallerTimer = null;

  function startClientSideSoloGame(playerName, avatar, botCount, botDifficulty) {
    clientSoloMode = true;
    const deck = TambolaTickets.generateTicketDeck(60);
    const available = [];
    for (let i = 1; i <= 90; i++) available.push(i);
    for (let i = available.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [available[i], available[j]] = [available[j], available[i]];
    }

    const humanPlayer = {
      id: 'local-player',
      name: playerName || 'Player',
      avatar: avatar || '💻',
      isHost: true,
      isBot: false,
      tickets: [deck[0]],
      claimsWon: []
    };
    myPlayer = humanPlayer;

    const botPersonas = [
      { name: '🤖 ByteBot', avatar: '🤖' },
      { name: '⚡ AlgoTron', avatar: '⚡' },
      { name: '🧙 PointerMage', avatar: '🧙' }
    ];

    const playersList = [humanPlayer];
    const claimedTicketIds = [deck[0].id];

    for (let i = 0; i < botCount; i++) {
      const persona = botPersonas[i % botPersonas.length];
      const botTicket = deck[i + 1];
      claimedTicketIds.push(botTicket.id);
      playersList.push({
        id: `local-bot-${i + 1}`,
        name: persona.name,
        avatar: persona.avatar,
        isHost: false,
        isBot: true,
        tickets: [botTicket],
        claimsWon: []
      });
    }

    currentRoom = {
      code: 'SOLO-BOTS',
      hostId: 'local-player',
      hostName: playerName,
      status: 'lobby',
      isSolo: true,
      botDifficulty: botDifficulty,
      calledNumbers: [],
      currentNumber: null,
      availableNumbers: available,
      deck: deck,
      claimedTicketIds: claimedTicketIds,
      players: playersList,
      prizes: {
        early5: { key: 'early5', name: "Early 5 (Jaldi 5)", icon: "⚡", points: 100, winner: null },
        topRow: { key: 'topRow', name: "Top Row (Line 1)", icon: "🎯", points: 150, winner: null },
        middleRow: { key: 'middleRow', name: "Middle Row (Line 2)", icon: "⚔️", points: 150, winner: null },
        bottomRow: { key: 'bottomRow', name: "Bottom Row (Line 3)", icon: "🛡️", points: 150, winner: null },
        fourCorners: { key: 'fourCorners', name: "Four Corners", icon: "💎", points: 200, winner: null },
        fullHouse: { key: 'fullHouse', name: "Full House (1st Housie)", icon: "👑", points: 500, winner: null },
        fullHouse2: { key: 'fullHouse2', name: "2nd Full House (Runner Up)", icon: "🥈", points: 300, winner: null }
      },
      callSpeed: 4500
    };

    selectedTicketIds = new Set([deck[0].id]);
    updateHeaderHUD();
    enterLobby();
    showToast("🤖 Client-Side Solo Engine active! Powered By Kapil.");
  }

  function checkClientBotClaims() {
    if (!currentRoom || currentRoom.status !== 'playing') return;
    for (const p of currentRoom.players) {
      if (!p.isBot || !p.tickets || p.tickets.length === 0) continue;
      const t = p.tickets[0];
      for (const [key, prize] of Object.entries(currentRoom.prizes)) {
        if (prize.winner) continue;
        if (TambolaTickets.verifyPrizeClaim(key, t, currentRoom.calledNumbers)) {
          let delay = 2200;
          if (currentRoom.botDifficulty === 'easy') delay = 3500 + Math.random() * 2000;
          else if (currentRoom.botDifficulty === 'hard') delay = 900 + Math.random() * 800;
          else delay = 1700 + Math.random() * 1200;

          const tid = setTimeout(() => {
            if (!prize.winner && currentRoom.status === 'playing') {
              prize.winner = {
                playerId: p.id,
                playerName: p.name,
                avatar: p.avatar,
                ticketId: t.id,
                isBot: true,
                time: new Date().toLocaleTimeString()
              };
              handlePrizeWon(prize, prize.winner);
            }
          }, delay);
          clientBotClaimTimers.push(tid);
        }
      }
    }
  }

  // Add Bot in Lobby
  btnAddBotLobby.addEventListener('click', () => {
    soundManager.playClick();
    if (socket && socket.connected) {
      socket.emit('addBot');
    } else if (clientSoloMode && currentRoom) {
      const botPersonas = [
        { name: '👾 MatrixDroid', avatar: '👾' },
        { name: '🦊 KadaneFox', avatar: '🦊' }
      ];
      const botIndex = currentRoom.players.length;
      const persona = botPersonas[botIndex % botPersonas.length];
      const botTicket = currentRoom.deck[botIndex];
      currentRoom.claimedTicketIds.push(botTicket.id);
      const newBot = {
        id: `local-bot-${Date.now()}`,
        name: persona.name,
        avatar: persona.avatar,
        isHost: false,
        isBot: true,
        tickets: [botTicket],
        claimsWon: []
      };
      currentRoom.players.push(newBot);
      updateLobbyPlayersList(currentRoom.players);
      showToast(`🤖 ${newBot.name} added to match!`);
    }
  });

  // ================= HOST / JOIN GAME =================
  btnCreateGame.addEventListener('click', () => {
    soundManager.playClick();
    const name = getPlayerName();
    myPlayer.name = name;
    socket.emit('createRoom', { hostName: name, avatar: myPlayer.avatar });
  });

  btnJoinGame.addEventListener('click', () => {
    soundManager.playClick();
    const name = getPlayerName();
    const roomCode = inputRoomCode.value.trim().toUpperCase();
    if (!roomCode) {
      showToast('⚠️ Please enter a room code.');
      inputRoomCode.focus();
      return;
    }
    myPlayer.name = name;
    socket.emit('joinRoom', { roomCode, playerName: name, avatar: myPlayer.avatar });
  });

  inputRoomCode.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') btnJoinGame.click();
  });

  // ================= SOCKET EVENT LISTENERS =================
  socket.on('roomCreated', ({ roomCode, roomState, player }) => {
    currentRoom = roomState;
    myPlayer = { ...player, isHost: true };
    updateHeaderHUD();
    enterLobby();
    showToast(roomState.isSolo 
      ? `🤖 Solo Match initialized with AI Bots!` 
      : `🎬 Room ${roomCode} created! Powered By Kapil.`
    );
  });

  socket.on('roomJoined', ({ roomCode, roomState, player }) => {
    currentRoom = roomState;
    myPlayer = { ...player, isHost: roomState.hostId === socket.id };
    updateHeaderHUD();
    enterLobby();
    showToast(`🚀 Joined Room ${roomCode}!`);
  });

  socket.on('joinError', ({ message }) => {
    showToast(`❌ ${message}`);
    soundManager.playBogey();
  });

  socket.on('playerJoined', ({ player, playerCount, players }) => {
    if (currentRoom) currentRoom.players = players;
    updateLobbyPlayersList(players);
    showToast(player.isBot 
      ? `🤖 ${player.name} joined the game!` 
      : `👋 ${player.avatar} ${player.name} joined!`
    );
  });

  socket.on('playerLeft', ({ playerId, playerName, playerCount, players, claimedTicketIds }) => {
    if (currentRoom) {
      currentRoom.players = players;
      currentRoom.claimedTicketIds = claimedTicketIds;
    }
    updateLobbyPlayersList(players);
    showToast(`🚶 ${playerName} left.`);
  });

  socket.on('newHostAssigned', ({ hostId, hostName }) => {
    if (currentRoom) currentRoom.hostId = hostId;
    myPlayer.isHost = socket.id === hostId;
    updateHeaderHUD();
    updateLobbyRole();
    showToast(`👑 ${hostName} is now the Host!`);
  });

  socket.on('ticketsUpdated', ({ playerId, tickets, claimedTicketIds }) => {
    if (currentRoom) {
      currentRoom.claimedTicketIds = claimedTicketIds;
      const p = currentRoom.players.find(x => x.id === playerId);
      if (p) p.tickets = tickets;
    }
    if (playerId === socket.id) {
      myPlayer.tickets = tickets;
      selectedTicketIds = new Set(tickets.map(t => t.id));
      updateSelectedTicketsTray();
    }
    renderTicketBrowserPreview();
    updateLobbyPlayersList(currentRoom ? currentRoom.players : []);
  });

  socket.on('gameStarted', ({ status }) => {
    if (currentRoom) currentRoom.status = status;
    soundManager.playGameStart();
    enterArena();
    showToast(`🚀 BINGO ARENA LAUNCHED! Powered By Kapil.`);
  });

  socket.on('numberCalled', ({ number, calledNumbers, remainingCount, fact }) => {
    if (currentRoom) {
      currentRoom.calledNumbers = calledNumbers;
      currentRoom.currentNumber = number;
    }
    handleNumberCalled(number, fact, calledNumbers, remainingCount);
  });

  socket.on('autoCallerChanged', ({ enabled, speed }) => {
    checkAutoCaller.checked = enabled;
    selectCallSpeed.value = speed;
    showToast(enabled ? `⚡ Auto-caller active (${speed / 1000}s)` : '⏸️ Auto-caller paused');
  });

  // Prize Won (Human or Bot)
  socket.on('prizeWon', ({ prizeKey, prize, winner, prizes, players }) => {
    if (currentRoom) {
      currentRoom.prizes = prizes;
      currentRoom.players = players;
    }
    handlePrizeWon(prize, winner);
  });

  socket.on('claimBogey', ({ message }) => {
    soundManager.playBogey();
    bogeyReasonText.textContent = message;
    modalBogey.classList.remove('hidden');
    document.body.classList.add('screen-shake');
    setTimeout(() => document.body.classList.remove('screen-shake'), 600);
  });

  socket.on('gameReset', ({ roomState }) => {
    currentRoom = roomState;
    daubedNumbersByTicket.clear();
    initMasterBoard();
    recentCallsList.innerHTML = '<span class="no-calls">Waiting for first call...</span>';
    currentBallNum.textContent = '--';
    callCounter.textContent = '0 / 90';
    enterLobby();
    showToast('🔄 Game has been reset by the host!');
  });

  socket.on('gameFinished', ({ message }) => {
    showToast(`🏁 ${message}`);
    checkAutoCaller.checked = false;
  });

  socket.on('newReaction', ({ senderName, avatar, emoji }) => {
    spawnFloatingEmoji(emoji);
  });

  socket.on('newChatMessage', (chatItem) => {
    appendChatMessage(chatItem);
  });

  // ================= LOBBY LOGIC =================
  function enterLobby() {
    switchView('lobby');
    lobbyRoomCode.textContent = currentRoom.code;
    updateLobbyRole();
    updateLobbyPlayersList(currentRoom.players);

    if (currentRoom.isSolo) {
      lobbyModeBadge.style.display = 'inline-block';
    } else {
      lobbyModeBadge.style.display = 'none';
    }

    browseTicketIndex = 1;
    renderTicketBrowserPreview();

    if (myPlayer.tickets.length === 0) {
      btnRandomTicket.click();
    }
  }

  function updateHeaderHUD() {
    roomCodeBadge.classList.remove('hidden');
    displayRoomCode.textContent = currentRoom.code;
    playerProfilePill.classList.remove('hidden');
    playerAvatarBadge.textContent = myPlayer.avatar;
    playerNameBadge.textContent = myPlayer.name;

    const joinUrl = `${window.location.origin}/?room=${currentRoom.code}`;
    inputShareLink.value = joinUrl;
    shareModalRoomCode.textContent = currentRoom.code;
  }

  function updateLobbyRole() {
    if (myPlayer.isHost) {
      lobbyRoleBadge.textContent = '👑 Host Master';
      lobbyRoleBadge.className = 'pill-badge role';
      hostStartPanel.classList.remove('hidden');
      playerWaitingPanel.classList.add('hidden');
      arenaHostControls.classList.remove('hidden');
    } else {
      lobbyRoleBadge.textContent = '🎮 Player';
      lobbyRoleBadge.className = 'pill-badge';
      hostStartPanel.classList.add('hidden');
      playerWaitingPanel.classList.remove('hidden');
      arenaHostControls.classList.add('hidden');
    }
  }

  function updateLobbyPlayersList(players) {
    if (!players) return;
    lobbyPlayerCountBadge.textContent = `👥 ${players.length} Player${players.length > 1 ? 's' : ''}`;
    arenaPlayerCount.textContent = players.length;

    lobbyPlayersList.innerHTML = players.map(p => `
      <div class="player-item-row">
        <div class="player-meta">
          <span class="player-avatar">${p.avatar}</span>
          <div>
            <span class="player-name">${escapeHtml(p.name)}</span>
            ${p.isBot ? '<span style="color:#c084fc;font-size:0.75rem;margin-left:4px;">🤖 AI Bot</span>' : ''}
            ${p.id === currentRoom.hostId ? '<span style="color:var(--neon-yellow);font-size:0.75rem;margin-left:4px;">👑 Host</span>' : ''}
          </div>
        </div>
        <span class="player-tickets-count">🎟️ ${p.tickets ? p.tickets.length : 0} Ticket(s)</span>
      </div>
    `).join('');

    arenaPlayersList.innerHTML = players.map(p => `
      <div class="player-item-row">
        <div class="player-meta">
          <span class="player-avatar">${p.avatar}</span>
          <div>
            <span class="player-name">${escapeHtml(p.name)}</span>
            ${p.isBot ? '<span style="color:#c084fc;font-size:0.75rem;margin-left:4px;">🤖 Bot</span>' : ''}
            ${p.claimsWon && p.claimsWon.length ? `<span style="color:var(--neon-yellow);font-size:0.75rem;display:block;">🏆 Won: ${p.claimsWon.map(c => c.prizeName).join(', ')}</span>` : ''}
          </div>
        </div>
        <span class="player-tickets-count">🎟️ ${p.tickets ? p.tickets.length : 0} Ticket(s)</span>
      </div>
    `).join('');
  }

  // Browse Tickets in Deck (1 to 60)
  function renderTicketBrowserPreview() {
    if (!currentRoom || !currentRoom.deck) return;
    const ticket = currentRoom.deck[browseTicketIndex - 1];
    if (!ticket) return;

    ticketBrowseIndicator.textContent = `Ticket #${ticket.id} of ${currentRoom.deck.length}`;

    const isClaimedByMe = selectedTicketIds.has(ticket.id);
    const isClaimedByOther = currentRoom.claimedTicketIds && currentRoom.claimedTicketIds.includes(ticket.id) && !isClaimedByMe;

    if (isClaimedByMe) {
      btnSelectCurrentTicket.textContent = '✓ Selected (Click to Deselect)';
      btnSelectCurrentTicket.className = 'btn-arcade-sm btn-cyan';
    } else if (isClaimedByOther) {
      btnSelectCurrentTicket.textContent = '🔒 Taken by another player/bot';
      btnSelectCurrentTicket.className = 'btn-arcade-sm';
      btnSelectCurrentTicket.disabled = true;
    } else {
      btnSelectCurrentTicket.textContent = '+ Select This Ticket';
      btnSelectCurrentTicket.className = 'btn-arcade-sm btn-pink';
      btnSelectCurrentTicket.disabled = false;
    }

    previewTicketMount.innerHTML = renderTicketHtml(ticket);
  }

  btnPrevTicket.addEventListener('click', () => {
    soundManager.playClick();
    browseTicketIndex = (browseTicketIndex > 1) ? browseTicketIndex - 1 : currentRoom.deck.length;
    renderTicketBrowserPreview();
  });

  btnNextTicket.addEventListener('click', () => {
    soundManager.playClick();
    browseTicketIndex = (browseTicketIndex < currentRoom.deck.length) ? browseTicketIndex + 1 : 1;
    renderTicketBrowserPreview();
  });

  btnSelectCurrentTicket.addEventListener('click', () => {
    soundManager.playClick();
    const ticket = currentRoom.deck[browseTicketIndex - 1];
    if (!ticket) return;

    if (selectedTicketIds.has(ticket.id)) {
      selectedTicketIds.delete(ticket.id);
    } else {
      if (selectedTicketIds.size >= maxTicketsAllowed) {
        const first = selectedTicketIds.values().next().value;
        selectedTicketIds.delete(first);
      }
      selectedTicketIds.add(ticket.id);
    }

    syncSelectedTicketsWithServer();
    updateSelectedTicketsTray();
    renderTicketBrowserPreview();
  });

  btnRandomTicket.addEventListener('click', () => {
    soundManager.playClick();
    socket.emit('requestRandomTickets', { count: maxTicketsAllowed });
  });

  function syncSelectedTicketsWithServer() {
    socket.emit('selectTickets', { ticketIds: Array.from(selectedTicketIds) });
  }

  function updateSelectedTicketsTray() {
    selectedTicketCount.textContent = selectedTicketIds.size;
    if (selectedTicketIds.size === 0) {
      selectedTicketsList.innerHTML = `<span class="empty-hint">No tickets chosen yet. Click 'Select This Ticket' or 'Auto-Pick Random'</span>`;
      return;
    }

    selectedTicketsList.innerHTML = Array.from(selectedTicketIds).map(tId => `
      <div class="selected-ticket-pill">
        <span>🎟️ Ticket #${tId}</span>
        <span class="btn-remove" data-id="${tId}" title="Remove">✕</span>
      </div>
    `).join('');

    selectedTicketsList.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        soundManager.playClick();
        const id = parseInt(btn.dataset.id, 10);
        selectedTicketIds.delete(id);
        syncSelectedTicketsWithServer();
        updateSelectedTicketsTray();
        renderTicketBrowserPreview();
      });
    });
  }

  btnStartGame.addEventListener('click', () => {
    if (!myPlayer.isHost) return;
    if (myPlayer.tickets.length === 0) {
      showToast('⚠️ Please select at least 1 ticket for yourself before starting!');
      return;
    }
    soundManager.playClick();
    if (clientSoloMode) {
      currentRoom.status = 'playing';
      soundManager.playGameStart();
      enterArena();
      showToast("🚀 BINGO ARENA LAUNCHED! Powered By Kapil.");
    } else {
      socket.emit('startGame');
    }
  });

  // ================= ARENA LOGIC =================
  function enterArena() {
    switchView('game');
    renderGameTickets();
    updatePrizesTable();

    if (myPlayer.isHost) {
      arenaHostControls.classList.remove('hidden');
    }
  }

  function renderGameTickets() {
    if (!myPlayer.tickets || myPlayer.tickets.length === 0) {
      gameTicketsContainer.innerHTML = `
        <div class="hero-card" style="padding:1.5rem;">
          <p>No active tickets found. Return to lobby to select tickets!</p>
        </div>
      `;
      return;
    }

    gameTicketsContainer.innerHTML = myPlayer.tickets.map(ticket => {
      if (!daubedNumbersByTicket.has(ticket.id)) {
        daubedNumbersByTicket.set(ticket.id, new Set());
      }
      const daubed = daubedNumbersByTicket.get(ticket.id);
      return renderActiveTicketCard(ticket, daubed);
    }).join('');

    gameTicketsContainer.querySelectorAll('.ticket-cell.number').forEach(cell => {
      cell.addEventListener('click', () => {
        const ticketId = parseInt(cell.dataset.ticketId, 10);
        const num = parseInt(cell.dataset.number, 10);
        toggleDaub(ticketId, num, cell);
      });
    });

    gameTicketsContainer.querySelectorAll('.btn-claim').forEach(btn => {
      btn.addEventListener('click', () => {
        soundManager.playClick();
        const prizeKey = btn.dataset.prize;
        const ticketId = parseInt(btn.dataset.ticketId, 10);
        if (clientSoloMode) {
          handleClientSoloClaim(prizeKey, ticketId);
        } else {
          socket.emit('claimPrize', { prizeKey, ticketId });
        }
      });
    });
  }

  function handleClientSoloClaim(prizeKey, ticketId) {
    let normalizedKey = prizeKey;
    if (prizeKey === 'topLine') normalizedKey = 'topRow';
    if (prizeKey === 'middleLine') normalizedKey = 'middleRow';
    if (prizeKey === 'bottomLine') normalizedKey = 'bottomRow';

    const prize = currentRoom.prizes[normalizedKey] || currentRoom.prizes[prizeKey];
    if (!prize) return;

    if (prize.winner) {
      soundManager.playBogey();
      bogeyReasonText.textContent = `${prize.name} has already been claimed by ${prize.winner.playerName}!`;
      modalBogey.classList.remove('hidden');
      return;
    }

    const ticket = myPlayer.tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    if (TambolaTickets.verifyPrizeClaim(normalizedKey, ticket, currentRoom.calledNumbers)) {
      prize.winner = {
        playerId: myPlayer.id,
        playerName: myPlayer.name,
        avatar: myPlayer.avatar,
        ticketId: ticketId,
        isBot: false,
        time: new Date().toLocaleTimeString()
      };
      handlePrizeWon(prize, prize.winner);
    } else {
      soundManager.playBogey();
      const stats = TambolaTickets.getTicketStats(ticket, currentRoom.calledNumbers);
      bogeyReasonText.textContent = `⚠️ Bogey Claim! Your ticket doesn't meet the conditions for ${prize.name} yet. (You have marked ${stats.marked}/15 numbers). Keep playing!`;
      modalBogey.classList.remove('hidden');
      document.body.classList.add('screen-shake');
      setTimeout(() => document.body.classList.remove('screen-shake'), 600);
    }
  }

  function renderActiveTicketCard(ticket, daubedSet) {
    const calledSet = new Set(currentRoom ? currentRoom.calledNumbers : []);
    const stats = TambolaTickets.getTicketStats(ticket, Array.from(daubedSet));

    return `
      <div class="tambola-ticket-card" id="ticket-card-${ticket.id}">
        <div class="ticket-top-bar">
          <span class="ticket-tag">🎟️ TICKET #${ticket.id}</span>
          <span class="ticket-stats-pill" id="ticket-stats-${ticket.id}">
            Daubed: ${stats.marked} / 15 (${stats.percentage}%)
          </span>
        </div>

        <div class="ticket-grid">
          ${ticket.grid.map((row, rIdx) => 
            row.map((val, cIdx) => {
              if (val === 0) {
                return `<div class="ticket-cell empty" title="arr[${rIdx}][${cIdx}] = 0"></div>`;
              }
              const isDaubed = daubedSet.has(val);
              const isCalled = calledSet.has(val);
              const alertClass = (isCalled && !isDaubed) ? 'called-alert' : '';
              const daubClass = isDaubed ? 'daubed' : '';
              return `
                <div class="ticket-cell number ${daubClass} ${alertClass}" 
                     data-ticket-id="${ticket.id}" 
                     data-number="${val}" 
                     title="arr[${rIdx}][${cIdx}] = ${val}">
                  ${val}
                </div>
              `;
            }).join('')
          ).join('')}
        </div>

        <div class="ticket-claims-row">
          ${renderClaimButtons(ticket.id)}
        </div>
      </div>
    `;
  }

  // Standard Winning Claims: Rows, Corners, Early 5, Full House
  function renderClaimButtons(ticketId) {
    if (!currentRoom || !currentRoom.prizes) return '';
    const prizes = currentRoom.prizes;

    const btns = [
      { key: 'early5', icon: '⚡', name: 'Early 5' },
      { key: 'topRow', icon: '🎯', name: 'Top Row' },
      { key: 'middleRow', icon: '⚔️', name: 'Mid Row' },
      { key: 'bottomRow', icon: '🛡️', name: 'Bot Row' },
      { key: 'fourCorners', icon: '💎', name: '4 Corners' },
      { key: 'fullHouse', icon: '👑', name: 'Full House' },
      { key: 'fullHouse2', icon: '🥈', name: '2nd House' }
    ];

    return btns.map(b => {
      const p = prizes[b.key];
      const isClaimed = p && p.winner !== null;
      const winnerName = isClaimed ? escapeHtml(p.winner.playerName) : '';
      const disabled = isClaimed ? 'disabled' : '';
      const claimedClass = isClaimed ? 'claimed' : '';

      return `
        <button class="btn-claim ${claimedClass}" 
                data-prize="${b.key}" 
                data-ticket-id="${ticketId}" 
                ${disabled}
                title="${isClaimed ? `Claimed by ${winnerName}` : `Claim ${b.name}`}">
          <span>${b.icon}</span> ${b.name} ${isClaimed ? `(${winnerName})` : ''}
        </button>
      `;
    }).join('');
  }

  function toggleDaub(ticketId, num, cellEl) {
    if (!daubedNumbersByTicket.has(ticketId)) {
      daubedNumbersByTicket.set(ticketId, new Set());
    }
    const daubed = daubedNumbersByTicket.get(ticketId);

    if (daubed.has(num)) {
      daubed.delete(num);
      cellEl.classList.remove('daubed');
      if (currentRoom && currentRoom.calledNumbers.includes(num)) {
        cellEl.classList.add('called-alert');
      }
      soundManager.playClick();
    } else {
      daubed.add(num);
      cellEl.classList.add('daubed');
      cellEl.classList.remove('called-alert');
      soundManager.playDaub();

      if ('vibrate' in navigator) navigator.vibrate(25);
    }

    const ticket = myPlayer.tickets.find(t => t.id === ticketId);
    if (ticket) {
      const stats = TambolaTickets.getTicketStats(ticket, Array.from(daubed));
      const statsBadge = document.getElementById(`ticket-stats-${ticketId}`);
      if (statsBadge) {
        statsBadge.textContent = `Daubed: ${stats.marked} / 15 (${stats.percentage}%)`;
      }
    }
  }

  function handleNumberCalled(num, fact, calledNumbers, remainingCount) {
    currentBallNum.textContent = num;
    ballDisplay.classList.remove('pop');
    void ballDisplay.offsetWidth;
    ballDisplay.classList.add('pop');
    callCounter.textContent = `${calledNumbers.length} / 90`;

    soundManager.playBallDraw();
    soundManager.speakNumber(num, fact.title);

    dsaProblemTitle.textContent = `#${num}: ${fact.title}`;
    dsaProblemFact.textContent = fact.fact;
    dsaComplexityTag.textContent = fact.complexity;
    dsaPatternTag.textContent = fact.pattern;
    dsaTopicTag.textContent = fact.tag || 'DSA Concept';
    dsaCodeHint.textContent = fact.formula || `arr[${num - 1}] = val;`;

    updateRecentCallsStrip(calledNumbers);
    markMasterBoardCell(num);

    const autoDaub = checkAutoDaub.checked;
    myPlayer.tickets.forEach(ticket => {
      if (ticket.numbers.includes(num)) {
        const cell = document.querySelector(`.ticket-cell.number[data-ticket-id="${ticket.id}"][data-number="${num}"]`);
        if (cell) {
          if (autoDaub) {
            toggleDaub(ticket.id, num, cell);
          } else {
            cell.classList.add('called-alert');
          }
        }
      }
    });
  }

  function updateRecentCallsStrip(calledNumbers) {
    if (!calledNumbers || calledNumbers.length === 0) return;
    const lastCalls = [...calledNumbers].reverse().slice(0, 5);
    recentCallsList.innerHTML = lastCalls.map(n => `
      <div class="recent-ball-sm" title="DSA #${n}: ${DSA_FACTS[n] ? DSA_FACTS[n].title : ''}">${n}</div>
    `).join('');
  }

  function initMasterBoard() {
    masterBoardGrid.innerHTML = '';
    for (let i = 1; i <= 90; i++) {
      const cell = document.createElement('div');
      cell.className = 'board-cell';
      cell.id = `board-cell-${i}`;
      cell.textContent = i;
      cell.title = DSA_FACTS[i] ? `#${i} - ${DSA_FACTS[i].title}` : `Number ${i}`;
      cell.addEventListener('click', () => {
        soundManager.playClick();
        openCodexProblem(i);
      });
      masterBoardGrid.appendChild(cell);
    }
  }

  function markMasterBoardCell(num) {
    const cell = document.getElementById(`board-cell-${num}`);
    if (cell) cell.classList.add('called');
    const calledCount = currentRoom ? currentRoom.calledNumbers.length : 0;
    boardMarkedCount.textContent = calledCount;
  }

  function updatePrizesTable() {
    if (!currentRoom || !currentRoom.prizes) return;
    const prizes = currentRoom.prizes;
    let wonCount = 0;

    prizesStatusList.innerHTML = Object.values(prizes).map(p => {
      const isWon = p.winner !== null;
      if (isWon) wonCount++;
      return `
        <div class="prize-item-card ${isWon ? 'won' : ''}">
          <div class="prize-info">
            <span class="prize-icon">${p.icon}</span>
            <div>
              <div class="prize-title">${p.name}</div>
              <span class="prize-pts">+${p.points} Points</span>
            </div>
          </div>
          ${isWon ? `
            <div class="prize-winner-tag">
              <span>${p.winner.avatar}</span>
              <span>${escapeHtml(p.winner.playerName)}</span>
            </div>
          ` : `
            <span style="color:var(--text-muted);font-size:0.8rem;font-weight:600;">Open</span>
          `}
        </div>
      `;
    }).join('');

    prizesWonCount.textContent = wonCount;

    myPlayer.tickets.forEach(ticket => {
      const card = document.getElementById(`ticket-card-${ticket.id}`);
      if (card) {
        const claimsRow = card.querySelector('.ticket-claims-row');
        if (claimsRow) claimsRow.innerHTML = renderClaimButtons(ticket.id);
      }
    });
  }

  // Handle Prize Won (Voice announces winner: rows, corners, early 5, full house!)
  function handlePrizeWon(prize, winner) {
    const isMe = winner.playerId === socket.id;

    soundManager.playWinFanfare();
    confettiLauncher.celebrateWin();

    // Voice announcement for winners
    soundManager.speakWinner(winner.playerName, prize.name, isMe);

    // Update latest award data
    latestAwardData = {
      winnerName: winner.playerName,
      prizeName: prize.name,
      prizeKey: prize.key,
      avatar: winner.avatar,
      points: prize.points,
      certId: `SYP-KAPIL-${Math.floor(10000 + Math.random() * 90000)}-${prize.key.toUpperCase()}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    if (isMe) {
      myWonPrizes.push(latestAwardData);
      try { localStorage.setItem('syp_bingo_awards', JSON.stringify(myWonPrizes)); } catch (e) {}
    }

    modalWinnerAvatar.textContent = winner.avatar;
    modalWinnerName.textContent = winner.playerName;
    modalWinnerPrize.textContent = prize.name;
    modalWinnerPoints.textContent = `+${prize.points} Points!`;
    modalWinner.classList.remove('hidden');

    updatePrizesTable();
    showToast(`🏆 ${winner.playerName} claimed ${prize.name}!`);
  }

  // Host manual call number button
  btnCallNext.addEventListener('click', () => {
    if (!myPlayer.isHost) return;
    soundManager.playClick();
    if (clientSoloMode) {
      if (currentRoom.availableNumbers.length === 0) {
        currentRoom.status = 'finished';
        showToast('🏁 All 90 numbers have been called! Game Over.');
        return;
      }
      const nextNum = currentRoom.availableNumbers.pop();
      currentRoom.calledNumbers.push(nextNum);
      currentRoom.currentNumber = nextNum;
      const fact = DSA_FACTS[nextNum] || {
        num: nextNum,
        title: `Array Memory Cell [${nextNum}]`,
        complexity: "O(1) Access",
        pattern: "Contiguous Array",
        fact: `Number ${nextNum} called at offset index ${nextNum - 1}.`
      };
      handleNumberCalled(nextNum, fact, currentRoom.calledNumbers, currentRoom.availableNumbers.length);
      checkClientBotClaims();
    } else {
      socket.emit('callNumber');
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && myPlayer.isHost && views.game.classList.contains('active')) {
      if (document.activeElement === inputChatText) return;
      e.preventDefault();
      btnCallNext.click();
    }
  });

  checkAutoCaller.addEventListener('change', () => {
    if (!myPlayer.isHost) return;
    if (clientSoloMode) {
      if (clientAutoCallerTimer) {
        clearInterval(clientAutoCallerTimer);
        clientAutoCallerTimer = null;
      }
      if (checkAutoCaller.checked) {
        const speed = parseInt(selectCallSpeed.value, 10) || 4000;
        btnCallNext.click();
        clientAutoCallerTimer = setInterval(() => {
          if (currentRoom.status !== 'playing' || currentRoom.availableNumbers.length === 0) {
            clearInterval(clientAutoCallerTimer);
            clientAutoCallerTimer = null;
            checkAutoCaller.checked = false;
            return;
          }
          btnCallNext.click();
        }, speed);
        showToast(`⚡ Auto-caller active (${speed / 1000}s)`);
      } else {
        showToast('⏸️ Auto-caller paused');
      }
    } else {
      socket.emit('toggleAutoCaller', {
        enabled: checkAutoCaller.checked,
        speed: parseInt(selectCallSpeed.value, 10)
      });
    }
  });

  selectCallSpeed.addEventListener('change', () => {
    if (!myPlayer.isHost) return;
    if (clientSoloMode && checkAutoCaller.checked) {
      checkAutoCaller.dispatchEvent(new Event('change'));
    } else if (!clientSoloMode && checkAutoCaller.checked) {
      socket.emit('toggleAutoCaller', {
        enabled: true,
        speed: parseInt(selectCallSpeed.value, 10)
      });
    }
  });

  // ================= CERTIFICATES & BADGES VIEW & DOWNLOAD =================
  btnOpenAwards.addEventListener('click', () => {
    soundManager.playClick();
    openCertificateModal(latestAwardData);
  });

  btnOpenCertFromWinner.addEventListener('click', () => {
    soundManager.playClick();
    modalWinner.classList.add('hidden');
    openCertificateModal(latestAwardData);
  });

  function openCertificateModal(awardData) {
    latestAwardData = awardData || latestAwardData;
    activeCertTab = 'cert';
    btnTabViewCert.classList.add('active');
    btnTabViewBadge.classList.remove('active');
    renderCurrentAwardCanvas();
    modalCertificate.classList.remove('hidden');
  }

  function renderCurrentAwardCanvas() {
    certCanvasMount.innerHTML = '';
    let canvas;
    if (activeCertTab === 'cert') {
      canvas = certificateManager.createCertificateCanvas(latestAwardData);
    } else {
      canvas = certificateManager.createBadgeCanvas(latestAwardData);
    }
    certCanvasMount.appendChild(canvas);
  }

  btnTabViewCert.addEventListener('click', () => {
    soundManager.playClick();
    activeCertTab = 'cert';
    btnTabViewCert.classList.add('active');
    btnTabViewBadge.classList.remove('active');
    renderCurrentAwardCanvas();
  });

  btnTabViewBadge.addEventListener('click', () => {
    soundManager.playClick();
    activeCertTab = 'badge';
    btnTabViewBadge.classList.add('active');
    btnTabViewCert.classList.remove('active');
    renderCurrentAwardCanvas();
  });

  // Download PNG (Lossless High-Resolution)
  btnDownloadPng.addEventListener('click', () => {
    soundManager.playClick();
    const canvas = certCanvasMount.querySelector('canvas');
    if (!canvas) return;
    const cleanName = latestAwardData.winnerName.replace(/\s+/g, '_');
    const typeStr = activeCertTab === 'cert' ? 'Certificate' : 'Badge';
    const filename = `SarlaYash_DSA_Bingo_${cleanName}_${latestAwardData.prizeKey}_${typeStr}.png`;
    certificateManager.downloadCanvasAsPng(canvas, filename);
    showToast(`📥 ${typeStr} PNG downloaded successfully!`);
  });

  // Download PDF (Vector Print-Ready Landscape)
  btnDownloadPdf.addEventListener('click', () => {
    soundManager.playClick();
    const canvas = certCanvasMount.querySelector('canvas');
    if (!canvas) return;
    const cleanName = latestAwardData.winnerName.replace(/\s+/g, '_');
    const typeStr = activeCertTab === 'cert' ? 'Certificate' : 'Badge';
    const filename = `SarlaYash_DSA_Bingo_${cleanName}_${latestAwardData.prizeKey}_${typeStr}.pdf`;
    certificateManager.downloadCanvasAsPdf(canvas, filename);
    showToast(`📄 ${typeStr} PDF generated & downloaded!`);
  });

  // ================= TABS LOGIC =================
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add('active');
      soundManager.playClick();
    });
  });

  // ================= CHAT & REACTIONS =================
  document.querySelectorAll('.reaction-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const emoji = btn.dataset.emoji;
      socket.emit('sendReaction', { emoji });
      spawnFloatingEmoji(emoji);
      soundManager.playClick();
    });
  });

  btnSendChat.addEventListener('click', sendChat);
  inputChatText.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') sendChat();
  });

  function sendChat() {
    const text = inputChatText.value.trim();
    if (!text) return;
    socket.emit('sendChat', { text });
    inputChatText.value = '';
    soundManager.playClick();
  }

  function appendChatMessage(msg) {
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg';
    msgEl.innerHTML = `
      <span class="chat-sender">${msg.avatar} ${escapeHtml(msg.senderName)} <small style="color:var(--text-muted);font-weight:400;">${msg.time}</small></span>
      <span class="chat-text">${escapeHtml(msg.text)}</span>
    `;
    chatMessagesBox.appendChild(msgEl);
    chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
  }

  function spawnFloatingEmoji(emoji) {
    const el = document.createElement('div');
    el.className = 'floating-emoji';
    el.textContent = emoji;
    el.style.left = `${Math.floor(20 + Math.random() * 60)}vw`;
    reactionsContainer.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  // ================= DSA CODEX MODAL (1 to 90) =================
  btnOpenCodex.addEventListener('click', () => {
    soundManager.playClick();
    renderCodexCards();
    modalCodex.classList.remove('hidden');
  });

  btnViewDsaModal.addEventListener('click', () => {
    if (currentRoom && currentRoom.currentNumber) {
      openCodexProblem(currentRoom.currentNumber);
    } else {
      btnOpenCodex.click();
    }
  });

  inputCodexSearch.addEventListener('input', () => {
    const q = inputCodexSearch.value.toLowerCase().trim();
    renderCodexCards(q);
  });

  function renderCodexCards(query = '') {
    const calledSet = new Set(currentRoom ? currentRoom.calledNumbers : []);
    codexCardsContainer.innerHTML = '';

    for (let i = 1; i <= 90; i++) {
      const item = DSA_FACTS[i];
      if (!item) continue;

      if (query) {
        const str = `${item.num} ${item.title} ${item.pattern} ${item.fact} ${item.complexity}`.toLowerCase();
        if (!str.includes(query)) continue;
      }

      const isCalled = calledSet.has(i);
      const card = document.createElement('div');
      card.className = `codex-card ${isCalled ? 'called' : ''}`;
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span class="codex-card-num">#${item.num}</span>
          <span class="dsa-pill topic-pill">${item.pattern}</span>
          ${isCalled ? '<span style="color:var(--neon-cyan);font-weight:700;font-size:0.75rem;">✓ Called</span>' : ''}
        </div>
        <div class="codex-card-title">${item.title}</div>
        <div class="codex-card-desc">${item.fact}</div>
        <div class="dsa-formula-box" style="margin-bottom:0;">
          <span class="formula-label">Complexity:</span>
          <code>${item.complexity}</code>
        </div>
      `;
      codexCardsContainer.appendChild(card);
    }
  }

  function openCodexProblem(num) {
    renderCodexCards();
    inputCodexSearch.value = `#${num}`;
    renderCodexCards(inputCodexSearch.value.toLowerCase());
    modalCodex.classList.remove('hidden');
  }

  // ================= SHARE / INVITE MODAL =================
  btnShareModal.addEventListener('click', () => {
    soundManager.playClick();
    modalShare.classList.remove('hidden');
  });

  btnCopyLink.addEventListener('click', copyJoinLink);
  btnCopyModalLink.addEventListener('click', copyJoinLink);

  function copyJoinLink() {
    const url = inputShareLink.value;
    navigator.clipboard.writeText(url)
      .then(() => showToast('🔗 Join Link copied to clipboard!'))
      .catch(() => showToast(`Room Code: ${currentRoom.code}`));
    soundManager.playClick();
  }

  function updateLocalIpsDisplay(port) {
    if (localServerIps.length === 0) {
      localIpHint.textContent = `Open browser and go to your computer's local IP on port ${port}.`;
      return;
    }
    const links = localServerIps.map(ip => `http://${ip}:${port}`).join(' or ');
    localIpHint.innerHTML = `Phones on same Wi-Fi can open: <br><strong style="color:var(--neon-cyan);">${links}</strong>`;
  }

  // ================= PWA INSTALLATION =================
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    btnInstallApp.classList.remove('hidden');
  });

  btnInstallApp.addEventListener('click', () => {
    soundManager.playClick();
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') {
          showToast('🎉 Thank you for installing DSA Array Bingo!');
        }
        deferredInstallPrompt = null;
      });
    } else {
      modalInstall.classList.remove('hidden');
    }
  });

  btnTriggerPwaInstall.addEventListener('click', () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
    } else {
      showToast('To install, use Chrome menu -> "Install App" or Safari -> "Add to Home Screen".');
    }
  });

  btnToggleFullscreen.addEventListener('click', () => {
    soundManager.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  btnToggleSound.addEventListener('click', () => {
    const enabled = soundManager.toggleSound();
    btnToggleSound.textContent = enabled ? '🔊' : '🔇';
    showToast(enabled ? '🔊 Arcade SFX Enabled' : '🔇 Sound Muted');
  });

  btnToggleVoice.addEventListener('click', () => {
    const enabled = soundManager.toggleVoice();
    btnToggleVoice.textContent = enabled ? '🗣️' : '🤐';
    showToast(enabled ? '🗣️ Voice Caller & Winner Announcements ON' : '🤐 Voice Announcements Muted');
  });

  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      soundManager.playClick();
      const modalId = btn.dataset.close;
      const m = document.getElementById(modalId);
      if (m) m.classList.add('hidden');
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.add('hidden');
      }
    });
  });

  function showToast(text, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = text;
    toast.style.cursor = 'pointer';
    toast.onclick = () => toast.remove();
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (m) => {
      switch (m) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        default: return m;
      }
    });
  }

  function renderTicketHtml(ticket) {
    return `
      <div class="tambola-ticket-card" style="margin:0;">
        <div class="ticket-top-bar">
          <span class="ticket-tag">🎟️ TICKET #${ticket.id}</span>
          <span class="ticket-stats-pill">15 Numbers</span>
        </div>
        <div class="ticket-grid">
          ${ticket.grid.map((row) => 
            row.map((val) => {
              if (val === 0) return `<div class="ticket-cell empty"></div>`;
              return `<div class="ticket-cell number">${val}</div>`;
            }).join('')
          ).join('')}
        </div>
      </div>
    `;
  }
});
