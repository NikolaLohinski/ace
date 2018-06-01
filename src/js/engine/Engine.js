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
  deal (game, players) {
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
    game.state = _consts_.__GAME_STATE_BETS__;
    game.initialized = true;
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
    for (let k = 0; k < players.length; k++) {
      players[k].hand = [];
      players[k].auctions = [];
      players[k].forbiddenPrices = [];
      players[k].canCoinche = false;
    }
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
    game.turn = [null, null, null, null];
    game.starter = players.findIndex((p) => p.turn);
    game.state = _consts_.__GAME_STATE_PLAY__;
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
    if (bet.type === _consts_.__BET_ACTION_COINCHE__) {
      // Case of a Coinche
      throw new Error('actBet for a coinche not yet implemented');
    } else if (bet.type === _consts_.__BET_ACTION_BET__) {
      // Case of a regular bet
      me.auctions.push(bet);
      players = Engine.next(game, players, null);
      for (let k = 0; k < players.length; k++) {
        players[k].forbiddenPrices.push(bet.price);
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
          [game, players] = Engine.start(game, players);
        } else {
          players = Engine.next(game, players, null);
        }
      } else {
        players[meIndex].turn = false;
        game.state = _consts_.__GAME_STATE_INTER__;
        const dealerIndex = players.findIndex((p) => p.dealer);
        players[dealerIndex].dealer = false;
        players[(dealerIndex + 1) % 4].dealer = true;
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
    me.hand = me.hand.slice(0, cardIndex).concat(me.hand.slice(cardIndex + 1));
    if (game.turn.indexOf(null) === -1) {
      const leaderIndex = Engine.leader(game, players);
      players[leaderIndex].folds = players[leaderIndex].folds.concat(game.turn);
      if (players[0].hand.length === 0) {
        // End of game
        game.starter = null;
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
          } else if (category === 'AA' || familyStart === category) {
            if (Engine.compareCards(leaderCard, card, true) > 0) {
              potentialFC.push(card);
            }
          }
        }
      } else {
        if (['AA', 'NA'].indexOf(category) === -1 && ((index + 2) % 4) !== leaderIndex) {
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
      return order.indexOf(card1.slice(0, card1.length - 1)) - order.indexOf(card2.slice(0, card2.length - 1));
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
    players[playingIndex].turn = false;
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
    if (game.state === _consts_.__GAME_STATE_BETS__) {
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
      const sortedCards = Engine.sort(cards, game.auction.category);
      max = game.turn.findIndex((c) => c === sortedCards[0]);
    }
    return max;
  }
};

export default Engine;
