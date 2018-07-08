import Game from './Game';
import Constants from '../../json/constants.json';
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
   * @param {Game} game game object
   * @param {Array<Player>} players self explanatory
   * @return {Object} new game and players
   */
  init (game, players) {
    if (game.getState() !== Constants.__GAME_STATE_INIT__) {
      throw Error(`[Engine.init] : Game not in state that allows initialization`);
    }
    if (game.getDeck().length !== 32) {
      // If no deck in game object, then get a new deck and shuffle it
      const deck = Constants.__DECK__;
      let count = deck.length;
      let randomNumber, temp;
      while (count) {
        randomNumber = Math.random() * count-- | 0;
        temp = deck[count];
        deck[count] = deck[randomNumber];
        deck[randomNumber] = temp;
      }
      // Set deck
      game.setDeck(deck);
    }
    game.initialize(players);
    return { game, players };
  },
  /**
   * Deal cards from game's deck amongst players
   * @param {Game} game game object
   * @param {Object|null} hands Already defined hands
   * @return {Object} new game and hands dealt
   */
  deal (game, hands = null) {
    if (game.getState() !== Constants.__GAME_STATE_BETS__) {
      throw Error(`[Engine.deal] : Game not in state that allows dealing`);
    }
    if (game.getDeck().length !== 32 && !hands) {
      throw Error(`[Engine.deal] : Deck can not be dealt in this state`);
    }
    if (!hands) {
      const cutIndex = Math.floor(3 + Math.random() * 26);
      const orders = Constants.__DEAL_ORDERS__;
      const dealOrder = orders[Math.floor(Math.random() * orders.length)];
      const deck = game.getDeck().slice(cutIndex).concat(game.getDeck().slice(0, cutIndex));
      hands = {};
      for (const count of dealOrder) {
        let who;
        for (let k = 0; k < 4; k++) {
          if (!who) {
            who = game.getPlayerNextTo(game.getDealer());
          } else {
            who = game.getPlayerNextTo(who);
          }
          if (!hands[who]) {
            hands[who] = [];
          }
          hands[who].push(...deck.splice(0, count));
        }
      }
    }
    const sortedHands = {};
    for (const id in hands) {
      if (hands.hasOwnProperty(id)) {
        sortedHands[id] = Engine.niceSort(hands[id]);
      }
    }
    game.setHandHashes(sortedHands);
    game.setDeck([]);
    return { game, hands };
  },
  /**
   * Simple sort of cards by family following s, h, c, d as no-assets
   * @param {Array} cards list of cards to sort
   * @param {String|null} category use a category for inner family sorting
   * @return {Array} sorted cards
   */
  niceSort (cards, category = null) {
    let sortedCards = [];
    if (cards.length > 0) {
      for (const family of ['s', 'h', 'c', 'd']) {
        const fCards = cards.filter((card) => card[card.length - 1] === family);
        const isAsset = category ? [category, 'AA'].indexOf(family) !== -1 : false;
        fCards.sort((x, y) => Engine.compareCards(x, y, isAsset));
        sortedCards = sortedCards.concat(fCards.reverse());
      }
    }
    return sortedCards;
  },
  /**
   * Sort the cards
   * @param {Array} cards List of cards in order
   * @param {String} category Category of the game
   * @return {Array} sorted cards
   */
  sort (cards, category) {
    let sortedCards = [];
    if (cards.length > 0) {
      const startFamily = cards[0][cards[0].length - 1];
      let families = ['s', 'h', 'c', 'd'];
      const index = families.indexOf(startFamily);
      families.splice(index, 1);
      families = [startFamily].concat(families);
      if (families.indexOf(category) !== -1) {
        families.splice(families.indexOf(category), 1);
        families = [category].concat(families);
      }
      for (const family of families) {
        const filtered = cards.filter((c) => c[c.length - 1] === family);
        filtered.sort((x, y) => Engine.compareCards(x, y, ['AA', category].indexOf(family) !== -1));
        sortedCards = sortedCards.concat(filtered.reverse());
      }
    }
    return sortedCards;
  },
  /**
   * Compare 2 cards
   * @param {String} card1 first card
   * @param {String} card2 second card
   * @param {Boolean} asset whether the cards are assets or not
   * @return {Number}  > 0 if card1 is better than card2, < 0 otherwise, and 0 if cards
   *  can not be compared
   */
  compareCards (card1, card2, asset = false) {
    if (card1[card1.length - 1] !== card2[card2.length - 1]) {
      return 0;
    } else {
      const order = asset ? Constants.__ORDERS__.ASSET : Constants.__ORDERS__.REGUL;
      return order.indexOf(card1.slice(0, card1.length - 1)) -
        order.indexOf(card2.slice(0, card2.length - 1));
    }
  },
  /**
   * Bet and update game
   * @param {Game} game Current game object
   * @param {Object} auction Bet object
   * @return {Object} Game object updated
   */
  bet (game, auction) {
    if ([Constants.__GAME_STATE_WAIT__, Constants.__GAME_STATE_BETS__].indexOf(game.getState()) === -1) {
      throw Error(`[Engine.bet] : Game not in state that allows auctions`);
    }
    const order = game.getOrder();
    const meIndex = order.indexOf(auction.id);
    const prices = Constants.__AUCTION_PRICES__;
    if (auction.type === Constants.__BET_ACTION_COINCHE__) {
      if (!game.getCanCoinche()[auction.id]) {
        throw Error(`[Game.bet] : Player "${auction.id}" can not coinche`);
      }
      game.placeAuction(auction);
      game.setCanCoinche(false);
      game.setWhosTurn(null);
      // Case of a Coinche
      game.setCoinche(auction.id);
      // My partner can not coinche anymore either
      const canCoinche = {};
      canCoinche[order[meIndex]] = false;
      canCoinche[order[(meIndex + 2) % 4]] = false;
      if (!game.isCounterCoinche(auction.id)) {
        canCoinche[order[(meIndex + 1) % 4]] = true;
        canCoinche[order[(meIndex + 3) % 4]] = true;
      }
      game.setCanCoinche(canCoinche);
      game.setState(Constants.__GAME_STATE_WAIT__);
    } else {
      // Check if it was this player's turn
      if (game.getWhosTurn() !== auction.id) {
        throw Error(`[Game.bet] : It's not player "${auction.id}"'s turn`);
      }
      const lastAuction = game.getLastAuction();
      if (auction.type === Constants.__BET_ACTION_BET__) {
        if (!auction.price || !auction.category) {
          throw Error(`[Game.bet] : The placed auction lacks some details`);
        }
        if (Constants.__AUCTION_PRICES__.indexOf(auction.price) === -1) {
          throw Error(`[Game.bet] : Acution with price ${auction.price} is not possible`);
        }
        if (Constants.__AUCTION_CATEGORIES__.indexOf(auction.category) === -1) {
          throw Error(`[Game.bet] : Acution with category ${auction.category} is not possible`);
        }
        if (lastAuction && prices.indexOf(lastAuction.price) >= prices.indexOf(auction.price)) {
          throw Error(`[Game.bet] : "${lastAuction.price}" was already placed. Can not place "${auction.price}"`);
        }
        game.setCanCoinche(false);
        game.setWhosTurn(null);
        // Case of a regular auction
        game.placeAuction(auction);
        // Update who's turn it is
        game.setWhosTurn(game.getPlayerNextTo(auction.id));
        const canCoinche = {};
        canCoinche[order[(meIndex + 1) % 4]] = true;
        canCoinche[order[(meIndex + 3) % 4]] = true;
        game.setCanCoinche(canCoinche);
        const forbidden = [];
        for (let i = 0; i < prices.length; i++) {
          if (i <= prices.indexOf(auction.price)) {
            forbidden.push(prices[i]);
          }
        }
        game.setForbiddenPrices(forbidden);
      } else if (auction.type === Constants.__BET_ACTION_PASS__) {
        game.setCanCoinche(false);
        game.setWhosTurn(null);
        // Get last auction for further checking
        const next = game.getPlayerNextTo(auction.id);
        // Case of pass
        game.placeAuction(auction);
        if (!lastAuction && next === game.getStarter()) {
          // Case when everyone passed
          game.setState(Constants.__GAME_STATE_INTER__);
        } else {
          if (lastAuction && next === lastAuction.id) {
            // Case when the player about to be the next to play is the one leading the auctions
            // Finishing betting phase by a WAIT phase
            game.setState(Constants.__GAME_STATE_WAIT__);
          } else {
            game.setWhosTurn(next);
          }
        }
      } else {
        // arguments unknown
        throw new Error(`[Engine.bet] : Unknown bet arguments ${JSON.stringify(auction)}`);
      }
    }
    return { game };
  },
  /**
   * Start playing part
   * @param {Game} game game object
   * @return {Object} new game object
   */
  start (game) {
    if (game.getState() !== Constants.__GAME_STATE_WAIT__) {
      throw Error(`[Game.start] : Game not in state that allows to start playing phase`);
    }
    game.setWhosTurn(game.getStarter());
    // Clear forbidden prices
    game.setForbiddenPrices([]);
    game.setState(Constants.__GAME_STATE_PLAY__);
    return { game };
  },
  /**
   * Act upon a card played by a player
   * @param {Game} game game object
   * @param {Player} player Player playing the card
   * @return {Object} new game state
   */
  play (game, player) {
    if (game.getState() !== Constants.__GAME_STATE_PLAY__) {
      throw Error(`[Engine.play] : Game not in state that allows playing cards`);
    }
    if (game.getWhosTurn() !== player.getId()) {
      throw Error(`[Game.bet] : It's not player with "${player.getId()}"'s turn`);
    }
    if (player.getHand().indexOf(player.getPlayed()) !== -1) {
      throw Error(`[Game.bet] : Can not play "${player.getPlayed()}" if it is still in hand`);
    }
    if (Engine.forbiddenCards(game, player, true).indexOf(player.getPlayed()) !== -1) {
      throw Error(`[Game.bet] : Can not play forbidden card "${player.getPlayed()}"`);
    }
    const cardsPlayed = [player.getPlayed()].concat(player.getHand());
    for (const record of game.getFolds()) {
      cardsPlayed.push(record[player.getId()]);
    }
    if (!game.checkHashCards(player.getId(), Engine.niceSort(cardsPlayed))) {
      throw Error(`[Game.bet] : Player "${player.getId()}" can not play card that was not dealt to him`);
    }
    game.setFold(player);
    if (game.getPlayerNextTo(player.getId()) === game.getStarter()) {
      const master = Engine.foldMaster(game);
      game.finishFold(master);
      if (game.getFolds().length === 8) {
        game.setState(Constants.__GAME_STATE_INTER__);
        game = Engine.evaluate(game).game;
      } else {
        game.setStarter(master);
        game.setWhosTurn(master);
      }
    } else {
      game.setWhosTurn(game.getPlayerNextTo(player.getId()));
    }
    return { game };
  },
  /**
   * Determine forbidden cards of a given player
   * @param {Game} game Game object
   * @param {Player} player Player object
   * @param {Boolean} addPlayed Whether to also use the played card when determining forbidden cards
   * @return {Array<String>} forbidden cards
   */
  forbiddenCards (game, player, addPlayed = false) {
    let forbiddenCards = [];
    const fold = game.getFold();
    let hand = player.getHand();
    if (addPlayed) {
      hand = hand.concat(player.getPlayed());
    }
    const id = player.getId();
    if (game.getStarter() !== game.whosTurn) {
      const startCard = fold[game.getStarter()];
      const family = startCard[startCard.length - 1];
      const masterCard = fold[Engine.foldMaster(game)];
      const category = game.getLastAuction().category;
      const potentialFC = [];
      if (hand.findIndex((c) => c[c.length - 1] === family) !== -1) {
        // If players has cards from the same family of the first one
        for (const card of hand) {
          if (card[card.length - 1] !== family) {
            forbiddenCards.push(card);
          } else if (['AA', family].indexOf(category) !== -1) {
            if (Engine.compareCards(masterCard, card, true) > 0) {
              potentialFC.push(card);
            }
          }
        }
        if (potentialFC.length > 0) {
          const assetSuperiorIndex = hand.findIndex(
            (c) => c[c.length - 1] === family && Engine.compareCards(masterCard, c, true) < 0
          );
          if (assetSuperiorIndex !== -1) {
            forbiddenCards = forbiddenCards.concat(potentialFC);
          }
        }
      } else {
        const order = game.getOrder();
        const partner = order[(order.indexOf(id) + 2) % 4];
        const master = Engine.foldMaster(game);
        if ((['AA', 'NA'].indexOf(category) === -1 && partner !== master) || (
            hand.findIndex((c) => c[c.length - 1] !== category) === -1 && partner === master)
        ) {
          if (hand.findIndex((c) => c[c.length - 1] === category) !== -1) {
            const potentialFC = [];
            for (const card of hand) {
              if (card[card.length - 1] !== category) {
                forbiddenCards.push(card);
              } else {
                if (masterCard[masterCard.length - 1] === category) {
                  if (Engine.compareCards(masterCard, card, true) < 0) {
                    potentialFC.push(card);
                  }
                }
              }
            }
          }
        }
        if (potentialFC.length > 0) {
          const anyAssetSuperior = hand.findIndex(
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
   * Returns the id of the master of the fold or null if none was found
   * @param {Game} game Game object
   * @return {String} Id of the leader
   */
  foldMaster (game) {
    const order = game.getOrder();
    const starterIndex = order.indexOf(game.getStarter());
    const fold = game.getFold();
    // Organize cards starting by the card of the starter
    const cards = [];
    const ids = [];
    for (let i = 0; i < 4; i++) {
      const id = order[(starterIndex + i) % 4];
      const card = fold[id];
      if (card) {
        cards.push(card);
        ids.push(id);
      }
    }
    const auction = game.getLastAuction();
    const sortedCards = Engine.sort(cards, auction.category);
    return ids[cards.indexOf(sortedCards[0])];
  },
   /**
   * Evaluate the game, update scores etc..
   * @param {Game} game game object
   * @return {Object} new game
   */
  evaluate (game) {
    if (game.state !== Constants.__GAME_STATE_INTER__) {
      throw Error('[Engine.evaluate] : Trying to evaluate game that has not ended');
    }
    const offense = game.getOffense();
    const auction = game.getLastAuction();
    let offenseScore = null;
    let belote = null;
    const folds = game.getFolds();
    let success = false;
    if (auction.price === 'GEN') {
      // all folds for announcer
      success = folds.every((fold) => fold.winner === auction.id);
    } else if (auction.price === 'CAP') {
      // all folds for announcer's team
      success = folds.every((fold) => offense.indexOf(fold.winner) !== -1);
    } else {
      if (auction.category === ['AA']) {  // All assets
        const map = {};
        for (let k = 0; k < Constants.__ORDERS__.ASSET.length; k++) {
          map[Constants.__ORDERS__.ASSET[k]] = Constants.__PRICES__.AA[k];
        }
        for (const id of offense) {
          const wonFolds = folds.filter((fold) => fold.winner === id);
          for (const fold of wonFolds) {
            for (const i of game.getOrder()) {
              offenseScore += map[fold[i].slice(0, fold[i].length - 1)];
            }
          }
        }
      } else if (auction.category === 'NA') {  // No assets
        const map = {};
        for (let k = 0; k < Constants.__ORDERS__.REGUL.length; k++) {
          map[Constants.__ORDERS__.REGUL[k]] = Constants.REGUL.NA[k];
        }
        for (const id of offense) {
          const wonFolds = folds.filter((fold) => fold.winner === id);
          for (const fold of wonFolds) {
            for (const i of game.getOrder()) {
              offenseScore += map[fold[i].slice(0, fold[i].length - 1)];
            }
          }
        }
      } else {  // Regular type of game
        const regularMap = {};
        const assetsMap = {};
        offenseScore = 0;
        for (let k = 0; k < Constants.__ORDERS__.ASSET.length; k++) {
          assetsMap[Constants.__ORDERS__.ASSET[k]] = Constants.__PRICES__.ASSET[k];
        }
        for (let k = 0; k < Constants.__ORDERS__.REGUL.length; k++) {
          regularMap[Constants.__ORDERS__.REGUL[k]] = Constants.__PRICES__.REGUL[k];
        }
        for (const id of offense) {
          const wonFolds = folds.filter((fold) => fold.winner === id);
          for (const fold of wonFolds) {
            for (const i of game.getOrder()) {
              let map = regularMap;
              if (fold[i][fold[i].length - 1] === auction.category) {
                map = assetsMap;
              }
              offenseScore += map[fold[i].slice(0, fold[i].length - 1)];
            }
          }
          const hand = folds.map((fold) => fold[id]);
          if (hand.indexOf(`q${auction.category}`) !== -1 && hand.indexOf(`k${auction.category}`) !== -1) {
            belote = Math.max(0, Math.min(20, auction.price - 81));
          }
        }
      }
      if (offense.indexOf(folds[folds.length - 1].winner) !== -1) {
        offenseScore += 10;
      }
      success = offenseScore >= Math.max(81, auction.price - (belote || 0));
    }
    const defenseScore = (offenseScore) ? 162 - offenseScore : null;
    game.finishSession(success, offenseScore, defenseScore, belote);
    const scores = game.getScores();
    for (const id in scores) {
      if (scores.hasOwnProperty(id)) {
        if (scores[id] > game.getGoal()) {
          game.setState(Constants.__GAME_STATE_END__);
          break;
        }
      }
    }
    return { game };
  },
  /**
   * Clear game to start anew
   * @param {Game} game game object
   * @return {Object} updated game
   */
  restart (game) {
    if (game.state !== Constants.__GAME_STATE_INTER__) {
      throw Error('[Engine.restart] : Game not is state that permits restarting');
    }
    // Rebuild deck
    const folds = game.getFolds();
    const order = game.getOrder();
    const deck = [];
    for (const fold of folds) {
      const index = order.indexOf(fold.starter);
      for (let i = 0; i < 4; i++) {
        deck.push(fold[order[(index + i) % 4]]);
      }
    }
    game.clear();
    // Set new dealer
    const index = order.indexOf(game.getDealer());
    game.setDealer(order[(index + 1) % 4]);
    // re-set state
    game.setState(Constants.__GAME_STATE_INIT__);
    return { game };
  }
};

export default Engine;
