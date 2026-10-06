// Authentic Tambola (Housie 90-ball) Ticket Generator and Validator

const COL_RANGES = [
  { min: 1, max: 9 },    // Col 0
  { min: 10, max: 19 },  // Col 1
  { min: 20, max: 29 },  // Col 2
  { min: 30, max: 39 },  // Col 3
  { min: 40, max: 49 },  // Col 4
  { min: 50, max: 59 },  // Col 5
  { min: 60, max: 69 },  // Col 6
  { min: 70, max: 79 },  // Col 7
  { min: 80, max: 90 }   // Col 8
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateTambolaTicket(ticketId = 1) {
  // 3 rows x 9 columns
  const grid = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

  // We assign which rows each column will occupy.
  // Template variations that guarantee exactly 5 numbers per row (total 15)
  // and at least 1 number per column.
  const templates = [
    // Variation A: Three 1-number columns, Six 2-number columns
    () => {
      const cols = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]);
      const colRows = {};
      colRows[cols[0]] = [0];
      colRows[cols[1]] = [1];
      colRows[cols[2]] = [2];
      colRows[cols[3]] = [0, 1];
      colRows[cols[4]] = [0, 1];
      colRows[cols[5]] = [0, 2];
      colRows[cols[6]] = [0, 2];
      colRows[cols[7]] = [1, 2];
      colRows[cols[8]] = [1, 2];
      return colRows;
    },
    // Variation B: One 3-number column, Four 1-number columns, Four 2-number columns
    () => {
      const cols = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]);
      const colRows = {};
      colRows[cols[0]] = [0, 1, 2]; // 3-number col
      colRows[cols[1]] = [0];
      colRows[cols[2]] = [1];
      colRows[cols[3]] = [2];
      colRows[cols[4]] = [0, 1];
      colRows[cols[5]] = [0, 2];
      colRows[cols[6]] = [1, 2];
      colRows[cols[7]] = [0, 1];
      colRows[cols[8]] = [2];
      // check counts: R0: 1+1+0+0+1+1+0+1+0 = 4 (need 5), let's balance:
      // To keep it guaranteed 5-5-5, let's stick to safe balanced templates:
      return null;
    }
  ];

  // Guaranteed balanced generator
  const cols = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  // 3 columns get single rows [0], [1], [2]
  // 6 columns get pairs [0,1], [0,1], [0,2], [0,2], [1,2], [1,2]
  const colRowMap = {};
  colRowMap[cols[0]] = [0];
  colRowMap[cols[1]] = [1];
  colRowMap[cols[2]] = [2];
  colRowMap[cols[3]] = [0, 1];
  colRowMap[cols[4]] = [0, 1];
  colRowMap[cols[5]] = [0, 2];
  colRowMap[cols[6]] = [0, 2];
  colRowMap[cols[7]] = [1, 2];
  colRowMap[cols[8]] = [1, 2];

  // Now pick random numbers for each column within its range
  const allNumbers = [];
  for (let c = 0; c < 9; c++) {
    const range = COL_RANGES[c];
    const rows = colRowMap[c];
    const count = rows.length;

    // Pick count distinct numbers from range
    const pool = [];
    for (let n = range.min; n <= range.max; n++) {
      pool.push(n);
    }
    const chosen = [];
    for (let k = 0; k < count; k++) {
      const idx = Math.floor(Math.random() * pool.length);
      chosen.push(pool.splice(idx, 1)[0]);
    }
    // Sort in ascending order
    chosen.sort((a, b) => a - b);

    // Place into grid rows from top to bottom
    rows.sort((a, b) => a - b);
    for (let k = 0; k < count; k++) {
      const r = rows[k];
      const val = chosen[k];
      grid[r][c] = val;
      allNumbers.push(val);
    }
  }

  allNumbers.sort((a, b) => a - b);

  return {
    id: ticketId,
    grid: grid,
    numbers: allNumbers,
    claimedCategories: {}
  };
}

// Generate a set of unique pre-built tickets for a room (e.g. 100 tickets available)
function generateTicketDeck(count = 60) {
  const deck = [];
  for (let i = 1; i <= count; i++) {
    deck.push(generateTambolaTicket(i));
  }
  return deck;
}

// Check winning conditions
function verifyPrizeClaim(prizeType, ticket, calledNumbers) {
  const calledSet = new Set(calledNumbers);
  const grid = ticket.grid;

  switch (prizeType) {
    case 'early5': {
      // First 5 numbers marked
      let markedCount = 0;
      for (const num of ticket.numbers) {
        if (calledSet.has(num)) markedCount++;
      }
      return markedCount >= 5;
    }

    case 'topLine':
    case 'topRow': {
      // All 5 numbers in row 0
      const row0Numbers = grid[0].filter(n => n > 0);
      return row0Numbers.length === 5 && row0Numbers.every(n => calledSet.has(n));
    }

    case 'middleLine':
    case 'middleRow': {
      // All 5 numbers in row 1
      const row1Numbers = grid[1].filter(n => n > 0);
      return row1Numbers.length === 5 && row1Numbers.every(n => calledSet.has(n));
    }

    case 'bottomLine':
    case 'bottomRow': {
      // All 5 numbers in row 2
      const row2Numbers = grid[2].filter(n => n > 0);
      return row2Numbers.length === 5 && row2Numbers.every(n => calledSet.has(n));
    }

    case 'fourCorners': {
      // Outermost 4 numbers of ticket (first and last non-zero of row 0 and row 2)
      const row0 = grid[0].filter(n => n > 0);
      const row2 = grid[2].filter(n => n > 0);
      if (row0.length < 2 || row2.length < 2) return false;
      const corner1 = row0[0];
      const corner2 = row0[row0.length - 1];
      const corner3 = row2[0];
      const corner4 = row2[row2.length - 1];
      return [corner1, corner2, corner3, corner4].every(n => calledSet.has(n));
    }

    case 'fullHouse':
    case 'fullHouse2': {
      // All 15 numbers on the ticket
      return ticket.numbers.every(n => calledSet.has(n));
    }

    default:
      return false;
  }
}

// Get non-marked numbers for advice / highlight
function getTicketStats(ticket, calledNumbers) {
  const calledSet = new Set(calledNumbers);
  let marked = 0;
  for (const n of ticket.numbers) {
    if (calledSet.has(n)) marked++;
  }
  return {
    total: 15,
    marked: marked,
    remaining: 15 - marked,
    percentage: Math.round((marked / 15) * 100)
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateTambolaTicket,
    generateTicketDeck,
    verifyPrizeClaim,
    getTicketStats,
    COL_RANGES
  };
} else if (typeof window !== 'undefined') {
  window.TambolaTickets = {
    generateTambolaTicket,
    generateTicketDeck,
    verifyPrizeClaim,
    getTicketStats,
    COL_RANGES
  };
}
