export default {
  // Player status
  __PLAYER_STATUS_CONNECTED__: 1,
  __PLAYER_STATUS_INACTIVE__: 0,
  __PLAYER_STATUS_DISCONNECTED__: -1,
  // Game status
  __GAME_STATE_END__: -1,
  __GAME_STATE_INIT__: 0,
  __GAME_STATE_BETS__: 1,
  __GAME_STATE_WAIT__: 2,
  __WAIT_TIMEOUT__: 3000,
  __GAME_STATE_PLAY__: 3,
  __GAME_STATE_INTER__: 4,
  // Cards
  __DECK__: [
    '7c', '8c', '9c', '10c', 'jc', 'qc', 'kc', 'ac',
    '7h', '8h', '9h', '10h', 'jh', 'qh', 'kh', 'ah',
    '7s', '8s', '9s', '10s', 'js', 'qs', 'ks', 'as',
    '7d', '8d', '9d', '10d', 'jd', 'qd', 'kd', 'ad'
  ],
  __DEAL_ORDERS__: [
    [3, 2, 3],
    [3, 3, 2],
    [2, 3, 3]
  ],
  __ORDERS__: {
    REGUL: ['7', '8', '9', 'j', 'q', 'k', '10', 'a'],
    ASSET: ['7', '8', 'q', 'k', '10', 'a', '9', 'j']
  },
  __PRICES__: {
    REGUL: [0, 0, 0, 2, 3, 4, 10, 11],
    ASSET: [0, 0, 3, 4, 10, 11, 14, 20],
    AA: [0, 0, 1, 3, 5, 6, 9, 14],
    NA: [0, 0, 0, 2, 3, 4, 10, 19]
  },
  // Bets
  __AUCTION_PRICES__: [80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 'CAP', 'GEN'],
  __GEN_PRICE__: 300,
  __CAP_PRICE__: 250,
  __AUCTION_CATEGORIES__: ['s', 'h', 'c', 'd', 'AA', 'NA'],
  __BET_ACTION_PASS__: 0,
  __BET_ACTION_BET__: 1,
  __BET_ACTION_COINCHE__: 2
};
