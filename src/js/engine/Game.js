import Sha512 from 'crypto-js/sha512';
import Base64 from 'crypto-js/enc-base64';
import Constants from '../../json/constants.json';
/**
 * Game class
 * @author: Nikola LOHINSKI (https://NikolaLohinski.github.io)
 * @date: July 2nd 2018
 */
export default class Game {
  /**
   * @constructor
   * @param {Object|undefined} object JSON object containing every info to
   * regenerate a new game object
   */
  constructor (object) {
    // Game state handling
    this.initialized = object.initialized || false;
    this.state = object.state || Constants.__GAME_STATE_INIT__;
    // Deck and cards
    this.deck = object.deck || [];
    this.handsHashes = object.handsHashes || null;
    // Folds, and history of folds
    this.fold = object.fold || null;
    this.folds = object.folds || [];
    // Player's role and turn management
    this.dealer = object.dealer || null;
    this.order = object.order || null;
    this.starter = object.starter || null;
    this.whosTurn = object.whosTurn || null;
    // Auctions management
    this.forbiddenPrices = object.forbiddenPrices || [];
    this.canCoinche = object.canCoinche || null;
    this.didCoinche = object.didCoinche || null;
    this.auctions = object.auctions || null;
    // Full game handling
    this.history = object.history || [];
    this.scores = object.scores || {};
    this.goal = object.goal || 1000;
  }
  /**
   * Initialize game
   * @param {Array} players Ordered list of players to initialize the game. A
   * player needs to have at least an id (player.id is defined and
   * unique).
   */
  initialize (players) {
    const self = this;
    if (this.initialized) {
      throw Error(`[Game.init] : game already initialized`);
    }
    if (this.state !== Constants.__GAME_STATE_INIT__) {
      throw Error(`[Game.init] : Impossible to init game in state ${this.state}`);
    }
    if (players.length !== 4) {
      throw Error('[Game.init] : Game needs 4 players to be initialized');
    }
    if (!this.deck.length) {
      throw Error(`[Game.init] : deck must be set to initialize game`);
    }
    this.initialized = true;
    this.canCoinche = {};
    this.didCoinche = {};
    this.auctions = {};
    this.fold = {};
    this.order = players.map((p) => {
      self.fold[p.getId()] = null;
      self.auctions[p.getId()] = [];
      self.canCoinche[p.getId()] = false;
      return p.getId();
    });
    if (!this.dealer) {
      if (!this.dealer) {
        this.dealer = this.order[Math.floor(Math.random() * 4)];
      }
    }
    this.whosTurn = this.getPlayerNextTo(this.dealer);
    this.starter = this.whosTurn;
    this.state = Constants.__GAME_STATE_BETS__;
  }
  /**
   * Set dealer
   * @param {String} id Id of the dealer
   */
  setDealer (id) {
    const position = this.order.findIndex((i) => i === id);
    if (position === -1) {
      throw Error(`[Game.setDealer] : Player not referenced`);
    }
    const current = this.dealer;
    const currentPosition = this.order.findIndex((i) => i === current);
    if (currentPosition !== -1 && (currentPosition + 1) % 4 !== position) {
      throw Error(`[Game.setDealer] : Could not set dealer to ${id}`);
    }
    this.dealer = id;
  }

  /**
   * Tell whether game has been initialized
   * @return {boolean} True if game has been initialized
   */
  isInitialized () {
    return this.initialized;
  }
  /**
   * Get dealer's id
   * @return {String} id of the dealer
   */
  getDealer () {
    return this.dealer;
  }
  /**
   * Get starter's id
   * @return {String} id of the starter
   */
  getStarter () {
    return this.starter;
  }

  /**
   * Get id of who's turn it is
   * @return {String} id of the player who's turn it is
   */
  getWhosTurn () {
    return this.whosTurn;
  }
  /**
   * Get the deck of the game
   * @return {Array} the current deck
   */
  getDeck () {
    return this.deck;
  }
  /**
   * Set a new deck for the game
   * @param {Array} deck the new deck
   */
  setDeck (deck) {
    if (deck.length !== 32 && deck.length !== 0) {
      throw Error(`[Game.setDeck] : trying to set a deck of a size ${deck.length} != 32 or 0`);
    }
    if (deck.length !== 0) {
      for (const card of Constants.__DECK__) {
        if (deck.indexOf(card) === -1) {
          throw Error(`[Game.setDeck] : missing ${card} in deck`);
        }
      }
    }
    this.deck = deck;
  }
  /**
   * Return the id of the player just after the given id
   * @param {String} id Id of the player
   * @param {Boolean} before True if to look for the player before the given one, otherwise returns the one after
   * @return {String} id of the player after the player of the given id
   */
  getPlayerNextTo (id, before = false) {
    if (!this.order || this.order.length !== 4) {
      throw Error(`[Game.getPlayerNextTo] : Players not set.`);
    }
    const index = this.order.findIndex((i) => i === id);
    if (index === -1) {
      throw Error(`[Game.getPlayerNextTo] : Player not found`);
    }
    const inc = before ? 3 : 1;
    return this.order[(index + inc) % 4];
  }
  /**
   * Change who can coinche
   * @param {Object|Boolean} who either an object or a boolean for all
   */
  setCanCoinche (who) {
    if (typeof who === 'boolean') {
      for (const id in this.canCoinche) {
        if (this.canCoinche.hasOwnProperty(id)) {
          this.canCoinche[id] = who;
        }
      }
    } else {
      for (const id in who) {
        if (who.hasOwnProperty(id)) {
          if (!this.canCoinche.hasOwnProperty(id)) {
            throw Error(`[Game.setCanCoinche] : Unknown player with id ${id}`);
          }
          this.canCoinche[id] = who[id];
        }
      }
    }
  }
  /**
   * Change who's turn it is
   * @param {String|null} id Id of the player or null if it is no one's turn
   */
  setWhosTurn (id) {
    if (id && this.order.indexOf(id) === -1) {
      throw Error(`[Game.setWhosTurn] : Unknown player with id ${id}`);
    }
    this.whosTurn = id;
  }
  /**
   * Change who's turn it is
   * @param {String|null} id Id of the player or null if it is no one's turn
   */
  setStarter (id) {
    if (id && this.order.indexOf(id) === -1) {
      throw Error(`[Game.setStarter] : Unknown player with id ${id}`);
    }
    this.starter = id;
  }
  /**
   * Set flag when a player coinched
   * @param {String} id Id of the player who coinched
   */
  setCoinche (id) {
    if (this.order.indexOf(id) === -1) {
      throw Error(`[Game.setCoinche] : Unknown player with id ${id}`);
    }
    this.didCoinche[id] = true;
  }
  /**
   * Check whether a player that coinched actually counter coinched
   * @param {String} id Id of the player who coinched
   * @return {Boolean} True if is a counter coinche, false otherwise
   */
  isCounterCoinche (id) {
    if (!this.didCoinche[id]) {
      throw Error[`[Game.isCounterCoinche] : Player ${id} did not coinche`];
    }
    for (const i in this.didCoinche) {
      if (this.didCoinche.hasOwnProperty(i)) {
        if (i !== id) {
          if (this.didCoinche[i]) {
            return true;
          }
        }
      }
    }
    return false;
  }
  /**
   * Get the order of players by id
   * @return {Array<String>} list of ids in order of the players
   */
  getOrder () {
    if (!this.order) throw Error(`[Game.getOrder] : Game was not initialized`);
    return this.order;
  }
  /**
   * Get the fold
   * @return {Object} The fold
   */
  getFold () {
    return this.fold;
  }
  /**
   * Set the fold for one player
   * @param {Player} player The player that played a card
   */
  setFold (player) {
    this.fold[player.getId()] = player.getPlayed();
  }
  /**
   * Get the canCoinche status of players
   * @return {Object} Mapping id to can-or-can-not coinche status
   */
  getCanCoinche () {
    return this.canCoinche;
  }
  /**
   * Set the state of game.
   * @param {Number} state Number defining the state
   */
  setState (state) {
    this.state = state;
  }
  /**
   * Get the state of game.
   * @return {Number} Number defining the state
   */
  getState () {
    return this.state;
  }
  /**
   * Place auction
   * @param {Object} auction The actual auction
   */
  placeAuction (auction) {
    if (this.order.indexOf(auction.id) === -1) {
      throw Error(`[Game.setAuction] : Unknown player with id ${auction.id}`);
    }
    this.auctions[auction.id].push(auction);
  }

  /**
   * Find and return last auction that was placed
   * @return {null|Object} last auction placed, null if none was placed
   */
  getLastAuction () {
    let lastAuction = null;
    let index = -1;
    const prices = Constants.__AUCTION_PRICES__;
    const dealerPosition = this.order.indexOf(this.dealer);
    for (let k = 0; k < 4; k++) {
      const id = this.order[(dealerPosition + 4 - k) % 4];
      const auctions = this.auctions[id];
      if (auctions.length > 0) {
        const auction = auctions[auctions.length - 1];
        if (auctions.length >= index && auction.type === Constants.__BET_ACTION_BET__) {
          index = auctions.length;
          if (!lastAuction || prices.indexOf(auction.price) > prices.indexOf(lastAuction.price)) {
            lastAuction = auction;
          }
        }
      }
    }
    return lastAuction;
  }

  /**
   * Get the auctions
   * @return {Object} the auctions of the game
   */
  getAuctions () {
    return this.auctions;
  }
  /**
   * Get the patner of a given player
   * @param {String} id Player that is looking for his buddy
   * @return {String|null} the id of the buddy
   */
  getPartner (id) {
    if (!this.order) return null;
    const where = this.order.indexOf(id);
    if (where === -1) return null;
    return this.order[(where + 2) % 4];
  }
  /**
   * Set forbidden prices. The input can be either an array or a list of forbidden prices
   * @param {Array<Number|String>|Number|String} prices
   */
  setForbiddenPrices (prices) {
    const _prices = [].concat(prices);
    for (const price of _prices) {
      if (Constants.__AUCTION_PRICES__.indexOf(price) === -1) {
        throw Error(`[Game.setForbiddenPrices] : unknown "${price}" price`);
      }
    }
    this.forbiddenPrices = _prices;
  }
  /**
   * Return the forbidden prices
   * @return {Array<Number|String>} the forbidden prices
   */
  getForbiddenPrices () {
    return this.forbiddenPrices;
  }
  /**
   * Calculate hash for each player's hand
   * @param {Object} hands Id to hands object
   */
  setHandHashes (hands) {
    this.handsHashes = {};
    for (const id of this.order) {
      if (hands.hasOwnProperty(id)) {
        if (this.order.indexOf(id) === -1) {
          throw Error(`[Game.setHandHashes] : Unknown player with ${id}`);
        }
        this.handsHashes[id] = Base64.stringify(Sha512(hands[id].join()));
      } else {
        throw Error(`[Game.setHandHashes] : Player with ${id} was not found`);
      }
    }
  }
  /**
   * Check whether the given partial list of cards corresponds to the initial hand dealt for a given player
   * @param {String} id of the player
   * @param {Array<String>} hand current list of cards
   * @return {Boolean} True if the hash corresponds to the player
   */
  checkHashCards (id, hand) {
    return this.handsHashes[id] === Base64.stringify(Sha512(hand.join()));
  }
  /**
   * Return game's folds
   * @return {Array} The folds object
   */
  getFolds () {
    return this.folds;
  }

  /**
   * Clear game for a clear restart-friendly state
   */
  clear () {
    this.starter = null;
    this.whosTurn = null;
    this.folds = [];
    for (const id of this.order) {
      this.handsHashes[id] = null;
      this.canCoinche[id] = false;
      this.didCoinche[id] = false;
      this.auctions[id] = [];
    }
    this.initialized = false;
  }
  /**
   * Clear fold and save to folds
   * @param {String} master Id of the master of the fold
   */
  finishFold (master) {
    const record = {
      'winner': master,
      'starter': this.starter
    };
    for (const id of this.order) {
      record[id] = this.fold[id];
      this.fold[id] = null;
    }
    this.folds.push(record);
  }
  /**
   * Returns the ids of the offense team aka. the team that whon the auctions
   * @return {Array}
   */
  getOffense () {
    const auction = this.getLastAuction();
    const index = this.order.indexOf(auction.id);
    return [auction.id, this.order[(index + 2) % 4]];
  }
  /**
   * Returns the ids of the defense team aka. the team that lost the auctions
   * @return {Array}
   */
  getDefense () {
    const auction = this.getLastAuction();
    const index = this.order.indexOf(auction.id);
    return [this.order[(index + 1) % 4], this.order[(index + 3) % 4]];
  }
  /**
   * Compute the actual price of the game, taking into account the coinches
   * @return {number} the price of the game
   */
  getPrice () {
    const auction = this.getLastAuction();
    const price = auction.price;
    let actualPrice = price === 'CAP' ? Constants.__CAP_PRICE__ : price === 'GEN' ? Constants.__GEN_PRICE__ : price;
    for (const id in this.didCoinche) {
      if (this.didCoinche.hasOwnProperty(id)) {
        actualPrice *= 2;
      }
    }
    return actualPrice;
  }

  /**
   * Save finished game to history of games
   * @param {Boolean} success If the offense won the game
   * @param {Number|null} pointsOffense The points the offense made if relevant (null in case of CAP or GEN)
   * @param {Number|null} pointsDefense The points the defense made if relevant (null in case of CAP or GEN)
   * @param {Number|null} belote The influence of the belote if relevant (null if no belote)
   */
  finishSession (success, pointsOffense = null, pointsDefense = null, belote = null) {
    const price = this.getPrice();
    const winners = success ? this.getOffense() : this.getDefense();
    this.history.push({
      'auctions': this.auctions,
      'winners': winners,
      'offense': pointsOffense,
      'defense': pointsDefense,
      'belote': belote,
      'folds': this.folds,
      'price': price,
      'coinche': this.didCoinche,
      'dealer': this.dealer,
      'order': this.order
    });
    for (const id of this.order) {
      if (!this.scores[id]) {
        this.scores[id] = 0;
      }
      if (winners.indexOf(id) !== -1) {
        this.scores[id] += price;
      }
    }
  }
  /**
   * Return the goal of the full game
   * @return {number} Goal of the game
   */
  getGoal () {
    return this.goal;
  }
  /**
   * Returns the scores for each player
   * @return {Object} the scores
   */
  getScores () {
    return this.scores;
  }
  /**
   * Return whether the game has ended or not
   * @return {Boolean} True if the game has ended
   */
  hasEnded () {
    return this.state === Constants.__GAME_STATE_END__;
  }
  /**
   * Tell whether the game is in bets state
   * @return {Boolean} True if the game is in bets state
   */
  isBets () {
    return this.state === Constants.__GAME_STATE_BETS__;
  }
  /**
   * Tell whether the game is in play state
   * @return {Boolean} True if the game is in play state
   */
  isPlay () {
    return this.state === Constants.__GAME_STATE_PLAY__;
  }
  /**
   * Tell whether the game is in wait state
   * @return {Boolean} True if the game is in wait state
   */
  isWait () {
    return this.state === Constants.__GAME_STATE_WAIT__;
  }
}
