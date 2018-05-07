export default {
  // Player status
  __PLAYER_STATUS_CONNECTED__: 1,
  __PLAYER_STATUS_INACTIVE__: 0,
  __PLAYER_STATUS_DISCONNECTED__: -1,
  // Game status
  __GAME_STATE_END__: -1,
  __GAME_STATE_INIT__: 0,
  __GAME_STATE_BETS__: 1,
  __GAME_STATE_PLAY__: 2,
  __GAME_STATE_INTER__: 3,
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
    AA: [0, 0, 0, 2, 3, 4, 10, 19],
    NA: [0, 0, 2, 3, 6, 7, 8, 12]
  }
};
