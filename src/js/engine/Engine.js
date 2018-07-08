import _consts_ from './constants.js';
/**
 * Implementation of the Engine object that will run the game
 * @author: Nikola LOHINSKI (https://NikolaLohinski.github.io)
 * @date: May 7th 2018
 */
const Engine = {
  /**
   * Deal cards from deck among the players starting by the player following the
   * dealer. If no deck is provided in the game object, then a default is taken
   * and shuffled
   * @param {Object} game game object
   * @param {Array} players self explanatory
   * @return {Array} new game and players
   */
  init (game, players) {
    if (!game.deck || game.deck.length !== 32) {
      game.deck = _consts_.__DECK__;
      // shuffle
      let count = game.deck.length;
      let randomNumber;
      let temp;
      while (count) {
        randomNumber = Math.random() * count-- | 0;
        temp = game.deck[count];
        game.deck[count] = game.deck[randomNumber];
        game.deck[randomNumber] = temp;
      }
    }
    [game, players] = Engine.deal(game, players);
    game.scores = game.scores || [0, 0];
    game.history = game.history || [];
    game.goal = game.goal || 1000;
    game.state = _consts_.__GAME_STATE_BETS__;
    game.initialized = true;
    game.turn = [null, null, null, null];
    game.starter = (players.findIndex((p) => p.dealer) + 1) % 4;
    return [game, players];
  },
  /**
   * Deal cards from game's deck amongst players
   * @param {Object} game game object
   * @param {Array} players self explanatory
   * @return {Array} new game and players
   */
  deal (game, players) {
    const cutIndex = Math.floor(3 + Math.random() * 26);
    const dealOrder = _consts_.__DEAL_ORDERS__[Math.floor(Math.random() * _consts_.__DEAL_ORDERS__.length)];
    const dealerIndex = players.findIndex((p) => p.dealer);
    players[(dealerIndex + 1) % 4].turn = true;
    game.deck = game.deck.slice(cutIndex).concat(game.deck.slice(0, cutIndex));
    for (let k = 0; k < dealOrder.length; k++) {
      const count = dealOrder[k];
      for (let p = 0; p < players.length; p++) {
        const player = players[(p + dealerIndex + 1) % 4];
        player.hand = player.hand.concat(game.deck.splice(0, count));
      }
    }
    return [game, players];
  },
  /**
   * Clear player objects for new game
   * @param {Object} game game object
   * @param {Array} players self explanatory
   * @return {Array} new game and players
   */
  clear (game, players) {
    game.initialized = false;
    game.deck = [];
    for (let k = 0; k < players.length; k++) {
      for (let c = 0; c < players[k].hand.length; c++) {
        game.deck.push(players[k].hand[c]);
      }
      for (let c = 0; c < players[k].folds.length; c++) {
        game.deck.push(players[k].folds[c]);
      }
      players[k].hand = [];
      players[k].folds = [];
      players[k].auctions = [];
      players[k].forbiddenPrices = [];
      players[k].forbiddenCards = [];
      players[k].canCoinche = false;
      players[k].coinche = false;
      players[k].belote = false;
    }
    const dealerIndex = players.findIndex((p) => p.dealer);
    players[dealerIndex].dealer = false;
    players[(dealerIndex + 1) % 4].dealer = true;
    return [game, players];
  },
  /**
   * Start playing part
   * @param {Object} game game object
   * @param {Array} players self explanatory
   * @return {Array} new game and players
   */
  start (game, players) {
    players = Engine.next(game, players, 'dealer');
    const leaderIndex = Engine.leader(game, players);
    game.auction = players[leaderIndex].auctions[players[leaderIndex].auctions.length - 1];
    game.auctioneerIndex = leaderIndex;
    game.starter = players.findIndex((p) => p.turn);
    game.state = _consts_.__GAME_STATE_PLAY__;
    for (let p = 0; p < players.length; p++) {
      players[p].canCoinche = false;
      if (players[p].hand.indexOf(`q${game.auction.category}`) !== -1 &&
      players[p].hand.indexOf(`k${game.auction.category}`) !== -1) {
        players[p].belote = true;
      }
    }
    return [game, players];
  },
  /**
   * Bet and update players
   * @param {Object} game game object
   * @param {Array} players self explanatory
   * @param {Object} bet Bet object
   * @return {Array} new game and players
   */
  bet (game, players, bet) {
    const meIndex = players.findIndex((p) => p.id === bet.id);
    const me = players[meIndex];
    for (let p = 0; p < players.length; p++) {
      players[p].canCoinche = false;
    }
    if (bet.type === _consts_.__BET_ACTION_COINCHE__) {
      // Case of a Coinche
      for (let k = 0; k < players.length; k++) {
        players[k].turn = false;
      }
      players[meIndex].coinche = true;
      players[meIndex].canCoinche = false;
      players[(meIndex + 2) % 4].canCoinche = false;
      if (!(players[(meIndex + 1) % 4].coinche || players[(meIndex + 3) % 4].coinche)) {
        players[(meIndex + 1) % 4].canCoinche = true;
        players[(meIndex + 3) % 4].canCoinche = true;
      }
      game.state = _consts_.__GAME_STATE_WAIT__;
    } else if (bet.type === _consts_.__BET_ACTION_BET__) {
      // Case of a regular bet
      me.auctions.push(bet);
      players = Engine.next(game, players, null);
      players[(meIndex + 1) % 4].canCoinche = true;
      players[(meIndex + 3) % 4].canCoinche = true;
      for (let k = 0; k < players.length; k++) {
        for (let b = 0; b < _consts_.__AUCTION_PRICES__.length; b++) {
          if (b <= _consts_.__AUCTION_PRICES__.indexOf(bet.price) &&
          players[k].forbiddenPrices.indexOf(_consts_.__AUCTION_PRICES__[b]) === -1) {
            players[k].forbiddenPrices.push(_consts_.__AUCTION_PRICES__[b]);
          }
        }
      }
    } else if (bet.type === _consts_.__BET_ACTION_PASS__) {
      // Case of pass
      me.auctions.push(bet);
      if (players.findIndex((p) => {
        return p.auctions.length === 0 ||
        p.auctions[p.auctions.length - 1].type !== _consts_.__BET_ACTION_PASS__;
      }) !== -1) {
        const leaderIndex = Engine.leader(game, players);
        if (leaderIndex === ((players.findIndex((p) => p.turn) + 1) % 4)) {
          game.state = _consts_.__GAME_STATE_WAIT__;
          players[meIndex].turn = false;
        } else {
          players = Engine.next(game, players, null);
        }
      } else {
        players[meIndex].turn = false;
        game.state = _consts_.__GAME_STATE_INTER__;
      }
    } else {
      // arguments unknown
      throw new Error('Unknown bet arguments');
    }
    return [game, players];
  },
  /**
   * Bet and update players
   * @param {Object} game game object
   * @param {Array} players self explanatory
   * @param {Object} play Play object
   * @return {Array} new game and players
   */
  play (game, players, play) {
    if (game.turn.indexOf(null) === -1) game.turn = [null, null, null, null];
    const meIndex = players.findIndex((p) => p.id === play.id);
    const me = players[meIndex];
    game.turn[meIndex] = play.card;
    const cardIndex = me.hand.indexOf(play.card);
    const hand = JSON.parse(JSON.stringify(me.hand));
    me.hand = hand.slice(0, cardIndex).concat(hand.slice(cardIndex + 1));
    if (game.turn.indexOf(null) === -1) {
      const leaderIndex = Engine.leader(game, players);
      players[leaderIndex].folds = players[leaderIndex].folds.concat(game.turn);
      if (players[0].hand.length === 0) {
        // End of game
        game.starter = null;
        me.turn = false;
        game.state = _consts_.__GAME_STATE_INTER__;
        return [game, players];
      } else {
        players = Engine.next(game, players, 'leader');
        game.starter = players.findIndex((p) => p.turn);
      }
    } else {
      players = Engine.next(game, players, null);
    }
    for (let k = 0; k < players.length; k++) {
      players[k].forbiddenCards = Engine.forbiddenCards(game, players, k);
    }
    return [game, players];
  },
  /**
   * Determine forbidden cards given the game object and cards in hand
   * @param {Object} game Game object
   * @param {Array} players List of players
   * @param {Number} index Concerned player index
   * @return {Array} forbidden cards
   */
  forbiddenCards (game, players, index) {
    const player = players[index];
    let forbiddenCards = [];
    if (game.turn.indexOf(null) !== -1) {
      const startCard = game.turn[game.starter];
      const familyStart = startCard[startCard.length - 1];
      const leaderIndex = Engine.leader(game, players);
      const leaderCard = game.turn[leaderIndex];
      const category = game.auction.category;
      const potentialFC = [];
      if (player.hand.findIndex((c) => c[c.length - 1] === familyStart) !== -1) {
        // If players has cards from the same family of the first one
        for (let c = 0; c < player.hand.length; c++) {
          const card = player.hand[c];
          if (card[card.length - 1] !== familyStart) {
            forbiddenCards.push(card);
          } else if (['AA', familyStart].indexOf(category) !== -1) {
            if (Engine.compareCards(leaderCard, card, true) > 0) {
              potentialFC.push(card);
            }
          }
        }
        if (potentialFC.length > 0) {
          const assetSuperiorIndex = player.hand.findIndex(
            (c) => c[c.length - 1] === familyStart &&
              Engine.compareCards(leaderCard, c, true) < 0
          );
          if (assetSuperiorIndex !== -1) {
            forbiddenCards = forbiddenCards.concat(potentialFC);
          }
        }
      } else {
        if (['AA', 'NA'].indexOf(category) === -1 && (((index + 2) % 4) !== leaderIndex) || (
            player.hand.findIndex((c) => c[c.length - 1] !== category) === -1 && ((index + 2) % 4) === leaderIndex)
        ) {
          if (player.hand.findIndex((c) => c[c.length - 1] === category) !== -1) {
            const potentialFC = [];
            for (let c = 0; c < player.hand.length; c++) {
              const card = player.hand[c];
              if (card[card.length - 1] !== category) {
                forbiddenCards.push(card);
              } else {
                if (leaderCard[leaderCard.length - 1] === category) {
                  if (Engine.compareCards(leaderCard, card, true) < 0) {
                    potentialFC.push(card);
                  }
                }
              }
            }
          }
        }
        if (potentialFC.length > 0) {
          const anyAssetSuperior = player.hand.findIndex(
            (c) => c[c.length - 1] === category && potentialFC.indexOf(c) === -1
          ) !== -1;
          if (anyAssetSuperior) {
            forbiddenCards = forbiddenCards.concat(potentialFC);
          }
        }
      }
    }
    return forbiddenCards;
  },
  /**
   * Compare 2 cards
   * @param {String} card1 first card
   * @param {String} card2 second card
   * @param {Boolean|null} asset whether the cards are assets or not
   * @return {Number}  > 0 if card1 is better than card2, < 0 otherwise, and 0 if cards
   *  can not be compared
   */
  compareCards (card1, card2, asset) {
    if (card1[card1.length - 1] !== card2[card2.length - 1]) {
      return 0;
    } else {
      const order = asset ? _consts_.__ORDERS__.ASSET : _consts_.__ORDERS__.REGUL;
      return order.indexOf(card1.slice(0, card1.length - 1)) -
        order.indexOf(card2.slice(0, card2.length - 1));
    }
  },
  /**
   * Return new array with cards sorted
   * @param {Array} cards list of cards to sort
   * @param {String} category Auction category (cf. _consts_)
   * @return {Array} sorted cards
   */
  sort (cards, category) {
    let sortedCards = [];
    if (cards && cards.length > 0) {
      const firstFamily = cards[0][cards[0].length - 1];
      let familist;
      switch (firstFamily) {
        case 's':
          familist = ['s', 'h', 'c', 'd'];
          break;
        case 'h':
          familist = ['h', 'c', 'd', 's'];
          break;
        case 'c':
          familist = ['c', 'd', 's', 'h'];
          break;
        default:
          familist = ['d', 's', 'h', 'c'];
          break;
      }
      const assetIndex = familist.indexOf(category);
      if (assetIndex !== -1) {
        familist.splice(assetIndex, 1);
        familist = [category].concat(familist);
      }
      for (let f = 0; f < familist.length; f++) {
        const family = familist[f];
        const fCards = [];
        for (let c = 0; c < cards.length; c++) {
          const card = cards[c];
          if (card[card.length - 1] === family) {
            fCards.push(card);
          }
        }
        fCards.sort((x, y) => Engine.compareCards(x, y, [family, 'AA'].indexOf(category) !== -1));
        sortedCards = sortedCards.concat(fCards.reverse());
      }
    }
    return sortedCards;
  },
  /**
   * Find next player and give him the turn boolean value
   * @param {Object} game Game object
   * @param {Array} players List of players
   * @param {String|null} after Whether the next player should be found regarding
   *    the 'dealer' or the 'leader'
   * @return {Array} new list of players updated
   */
  next (game, players, after) {
    const playingIndex = players.findIndex((p) => p.turn);
    if (playingIndex !== -1) players[playingIndex].turn = false;
    let index;
    switch (after) {
      case 'dealer':
        index = (players.findIndex((p) => p.dealer) + 1) % 4;
        break;
      case 'leader':
        index = Engine.leader(game, players);
        break;
      default:
        index = (playingIndex + 1) % 4;
        break;
    }
    players[index].turn = true;
    return players;
  },
  /**
   * Returns the index of the leader of the game, either best bet or bet card
   * depending on the game state
   * @param {Object} game Game object
   * @param {Array} players List of players
   * @return {Number} Index of the leader
   */
  leader (game, players) {
    let max = -1;
    if ([_consts_.__GAME_STATE_BETS__, _consts_.__GAME_STATE_WAIT__].indexOf(game.state) !== -1) {
      for (let k = 0; k < players.length; k++) {
        const auctions = players[k].auctions;
        if (auctions && auctions.length > 0) {
          if (max === -1 ||
            _consts_.__AUCTION_PRICES__.indexOf(auctions[auctions.length - 1].price) >
          _consts_.__AUCTION_PRICES__.indexOf(players[max].auctions[players[max].auctions.length - 1].price)) {
            max = k;
          }
        }
      }
    } else if (game.state === _consts_.__GAME_STATE_PLAY__ ||
      game.state === _consts_.__GAME_STATE_INTER__) {
      const cards = [];
      for (let k = 0; k < players.length; k++) {
        if (game.turn[(k + game.starter) % 4]) {
          cards.push(game.turn[(k + game.starter) % 4]);
        }
      }
      if (game.auction) {
        const sortedCards = Engine.sort(cards, game.auction.category);
        max = game.turn.findIndex((c) => c === sortedCards[0]);
      }
    }
    return max;
  },
   /**
   * Evaluate the game, update scores etc..
   * @param {Object} game game object
   * @param {Array} players self explanatory
   * @return {Array} new game and players
   */
  evaluate (game, players) {
    if (game.state !== _consts_.__GAME_STATE_INTER__) throw Error('Trying to evaluate game that has not ended');
    const announcerIndex = players.findIndex((p) => p.id === game.auction.id);
    const offense = [players[announcerIndex], players[(announcerIndex + 2) % 4]];
    const defense = [players[(announcerIndex + 1) % 4], players[(announcerIndex + 3) % 4]];
    let coinchePriceFactor = 1;
    let coinche = false;
    let surCoinche = false;
    if (defense[0].coinche || defense[1].coinche) {
      coinchePriceFactor = coinchePriceFactor * 2;
      coinche = true;
      if (offense[0].coinche || offense[1].coinche) {
        coinchePriceFactor = coinchePriceFactor * 2;
        surCoinche = true;
      }
    }
    let price;
    let victoryOffense = false;
    let scores = [null, null];
    let belote = false;
    if (game.auction.price === 'GEN') {
      // all folds for announcer
      victoryOffense = players[announcerIndex].folds.length === 32;
      price = coinchePriceFactor * _consts_.__GEN_PRICE__;
    } else if (game.auction.price === 'CAP') {
      // all folds for announcer's team
      victoryOffense = (offense[0].folds.length + offense[0].folds.length) === 32;
      price = coinchePriceFactor * _consts_.__CAP_PRICE__;
    } else {
      // Regular auction
      let goal = game.auction.price;
      let offenseScore = 0;
      if (game.auction.category === ['AA']) {  // All assets
        const cardMap = {};
        for (let k = 0; k < _consts_.__ORDERS__.ASSET.length; k++) {
          cardMap[_consts_.__ORDERS__.ASSET[k]] = _consts_.__PRICES__.AA[k];
        }
        for (let p = 0; p < offense.length; p++) {
          for (let c = 0; c < offense[p].folds.length; c++) {
            const card = offense[p].folds[c];
            offenseScore += cardMap[card.slice(0, card.length - 1)];
          }
        }
      } else if (game.auction.category === 'NA') {  // No assets
        const cardMap = {};
        for (let k = 0; k < _consts_.__ORDERS__.REGUL.length; k++) {
          cardMap[_consts_.__ORDERS__.REGUL[k]] = _consts_.__PRICES__.NA[k];
        }
        for (let p = 0; p < offense.length; p++) {
          for (let c = 0; c < offense[p].folds.length; c++) {
            const card = offense[p].folds[c];
            offenseScore += cardMap[card.slice(0, card.length - 1)];
          }
        }
      } else {  // Regular type of game
        const regularMap = {};
        const assetsMap = {};
        for (let k = 0; k < _consts_.__ORDERS__.ASSET.length; k++) {
          assetsMap[_consts_.__ORDERS__.ASSET[k]] = _consts_.__PRICES__.ASSET[k];
        }
        for (let k = 0; k < _consts_.__ORDERS__.REGUL.length; k++) {
          regularMap[_consts_.__ORDERS__.REGUL[k]] = _consts_.__PRICES__.REGUL[k];
        }
        for (let p = 0; p < offense.length; p++) {
          for (let c = 0; c < offense[p].folds.length; c++) {
            const card = offense[p].folds[c];
            const family = card[card.length - 1];
            if (family === game.auction.category) {
              offenseScore += assetsMap[card.slice(0, card.length - 1)];
            } else {
              offenseScore += regularMap[card.slice(0, card.length - 1)];
            }
          }
          // Test if belote
          if (offense[p].belote) {
            goal -= 20;
            belote = true;
          }
        }
      }
      if ([announcerIndex, (announcerIndex + 2) % 4].indexOf(Engine.leader(game, players)) !== -1) {
        offenseScore += 10;
      }
      if ([0, 2].indexOf(announcerIndex) !== -1) {
        scores = [offenseScore, 162 - offenseScore];
      } else {
        scores = [162 - offenseScore, offenseScore];
      }
      goal = Math.max(81, goal);
      victoryOffense = offenseScore >= goal;
      price = coinchePriceFactor * game.auction.price;
    }
    if (([0, 2].indexOf(announcerIndex) !== -1 && victoryOffense) ||
    ([1, 3].indexOf(announcerIndex) !== -1 && !victoryOffense)) {
      game.scores[0] += price;
    } else {
      game.scores[1] += price;
    }
    game.history.push({
      auction: game.auction,
      won: victoryOffense,
      scores: scores,
      belote: belote,
      coinche: coinche,
      surCoinche: surCoinche
    });
    if (game.scores[0] >= game.goal || game.scores[1] >= game.goal) {
      game.state = _consts_.__GAME_STATE_END__;
    }
    return [game, players];
  }
};

export default Engine;
