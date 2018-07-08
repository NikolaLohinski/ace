import Engine from '../engine/Engine.js';
import _consts_ from '../engine/constants.js';
const __TIME_BET__ = [2500, 4000];  // Time in ms
const __TIME_PLAY__ = [1500, 2500];  // Time in ms
const __TIME_COINCHE__ = [500, 1500];  // Time in ms
const params = {
  startPotential: 35,
  minimalPotential: 78,
  buddyFactor: 0.8,
  coincheFactor: 1,
  // 7, 8, Q, K, 10, A, 9, J
  assetPotentials: [
    [14, 11, 10, 4, 3, 0, 0, 20],
    [11, 10, 4, 3, 0, 0, 14, -1],
    [10, 4, 3, 0, 0, 11, -1, -1],
    [4, 3, 0, 0, 10, -1, -1, -1],
    [3, 0, 0, 4, -1, -1, -1, -1],
    [3, 0, 0, -1, -1, -1, -1, -1],
    [0, 0, -1, -1, -1, -1, -1, -1],
    [0, -1, -1, -1, -1, -1, -1, -1]
  ],
  // 7, 8, 9, J, Q, K, 10 A
  noAssetPotentials: [
    [10, 4, 3, 2, 0, 0, 0, 11],
    [4, 3, 2, 0, 0, 0, 10, -1],
    [3, 2, 0, 0, 0, 4, -1, -1],
    [2, 0, 0, 0, 3, -1, -1, -1],
    [0, 0, 0, 2, -1, -1, -1, -1],
    [0, 0, 0, -1, -1, -1, -1, -1],
    [0, 0, -1, -1, -1, -1, -1, -1],
    [0, -1, -1, -1, -1, -1, -1, -1]
  ]
};

/**
 * Implementation of a basic AI
 * @author: Nikola LOHINSKI (https://NikolaLohinski.github.io)
 * @date: May 7th 2018
 */
export default {
  /**
   * Given a game state, decides on an auction or pass
   * @param {Array} players List of all players including me and my cards
   * @return {Promise} promise of a bet object defining the action
   */
  bet (players) {
    return new Promise((resolve) => {
      const bet = {
        price: null,
        category: null,
        type: _consts_.__BET_ACTION_PASS__
      };
      const startTime = performance.now();
      const me = players[0];
      const potentials = this.buildPotentials(players);
      let bestPotentials = null;
      for (const family in potentials) {
        if (potentials.hasOwnProperty(family)) {
          if (potentials[family] > params.minimalPotential) {
            const potential = potentials[family];
            if (!bestPotentials || bestPotentials.findIndex((f) => potentials[f] >= potential) === -1) {
              bestPotentials = [family];
            } else if (bestPotentials.findIndex((f) => potentials[f] === potential) !== -1) {
              bestPotentials.push(family);
            }
          }
        }
      }
      if (bestPotentials) {
        const category = bestPotentials[Math.floor(Math.random() * bestPotentials.length)];
        const potential = potentials[category];
        let closestAuction = null;
        for (let i = 0; i < _consts_.__AUCTION_PRICES__.length; i++) {
          const value = _consts_.__AUCTION_PRICES__[i];
          if (['CAP', 'GEN'].indexOf(value) !== -1) break;
          else if (!closestAuction || Math.abs(value - potential) < Math.abs(closestAuction - potential)) {
            closestAuction = value;
          }
        }
        if (me.forbiddenPrices.indexOf(closestAuction) === -1) {
          bet.category = category;
          bet.price = closestAuction;
          bet.type = _consts_.__BET_ACTION_BET__;
        }
      }
      const currentTime = performance.now();
      setTimeout(resolve, Math.max(__TIME_BET__[0] - Math.round(currentTime - startTime), 0), bet);
    });
  },
  /**
   * Compute potentials for each categories
   * @param {Array} players List of all players including me and my cards
   * @return {{s: number, h: number, c: number, d: number}}
   */
  buildPotentials (players) {
    const me = players[0];
    const buddy = players[2];
    const categories = ['s', 'h', 'c', 'd'];
    const potentials = {
      's': params.startPotential,
      'h': params.startPotential,
      'c': params.startPotential,
      'd': params.startPotential
    };
    const groups = { 's': [], 'h': [], 'c': [], 'd': [] };
    for (let c = 0; c < me.hand.length; c++) {
      const card = me.hand[c];
      const value = card.slice(0, card.length - 1);
      const family = card[card.length - 1];
      groups[family].push(value);
    }
    for (const categoryAtStudy of categories) {
      if (buddy.auctions.findIndex((auction) => auction.type !== _consts_.__BET_ACTION_PASS__) !== -1) {
        for (const auction of buddy.auctions) {
          if (auction.category === categoryAtStudy && auction.type !== _consts_.__BET_ACTION_PASS__) {
            if (me.auctions.findIndex((a) => {
              return a.type !== _consts_.__BET_ACTION_PASS__ && a.category === auction.category;
            }) === -1) {
              potentials[categoryAtStudy] = auction.price * params.buddyFactor;
            }
          }
        }
      }
      for (const family in groups) {
        if (groups.hasOwnProperty(family)) {
          const prices = categoryAtStudy === family ? _consts_.__PRICES__.ASSET : _consts_.__PRICES__.REGUL;
          const order = categoryAtStudy === family ? _consts_.__ORDERS__.ASSET : _consts_.__ORDERS__.REGUL;
          for (const card of groups[family]) {
            const position = order.indexOf(card);
            potentials[categoryAtStudy] += prices[position];
          }
        }
      }
    }
    return potentials;
  },
  /**
   * Given a game state, decides to coinche or wait
   * @param {Array} players List of all players including me and my cards
   * @return {Promise} promise of a bet object defining the action
   */
  coinche (players) {
    return new Promise((resolve) => {
      const startTime = performance.now();
      const me = players[0];
      const whoPlayed = (players.findIndex((p) => p.turn) + 3) % 4;
      const played = players[whoPlayed];
      const auction = played.auctions[played.auctions.length - 1];
      if (!auction || ['CAP', 'GEN'].indexOf(auction.price) !== -1) return;
      if (!auction || ['AA', 'NA'].indexOf(auction.category) !== -1) return;
      const assetsNumber = me.hand.reduce((sum, b) => sum + (b[b.length - 1] === auction.category ? 1 : 0), 0);
      const potentials = this.buildPotentials(players);
      if (162 - potentials[auction.category] * params.coincheFactor > auction.price + params.startPotential ||
        assetsNumber > 3) {
        const currentTime = performance.now();
        setTimeout(resolve, Math.max(__TIME_COINCHE__[0] - Math.round(currentTime - startTime), 0), {
          type: _consts_.__BET_ACTION_COINCHE__
        });
      }
    });
  },
  /**
   * Given a game state, decides which card to play
   * @param {Array} players List of all players including me and my cards
   * @param {Array} turn Current turn
   * @param {Object} auction Current auction played
   * @return {Promise} Promise of a play object defining the action
   */
  play (players, turn, auction) {
    return new Promise((resolve) => {
      const startTime = performance.now();
      const me = players[0];
      const possibles = [];
      const cardPotentials = [];
      let alreadyPlayed = [];
      for (const player of players) {
        alreadyPlayed = alreadyPlayed.concat(player.folds);
      }
      for (const card of me.hand) {
        if (me.forbiddenCards.indexOf(card) === -1) {
          possibles.push(card);
          let potentials = params.noAssetPotentials;
          let order = _consts_.__ORDERS__.REGUL;
          if (card[card.length - 1] === auction.category || auction.category === 'AA') {
            potentials = params.assetPotentials;
            order = _consts_.__ORDERS__.ASSET;
          }
          let k = order.length - 1;
          while (k > 0) {
            if (alreadyPlayed.indexOf(order[k] + card[card.length - 1]) === -1) {
              break;
            }
            k--;
          }
          k = order.length - 1 - k;
          cardPotentials.push(potentials[k][order.indexOf(card.slice(0, card.length - 1))]);
        }
      }
      // Handle cases when all assets are gone, then there is no point in playing an asset
      const possibleAssets = possibles.filter((c) => c[c.length - 1] === auction.category).length;
      const lastAsset = Math.round(Math.random());
      if (possibleAssets > 0 &&
        alreadyPlayed.filter((c) => c[c.length - 1] === auction.category).length === lastAsset + 7 - possibleAssets) {
        for (let k = 0; k < possibles.length; k++) {
          if (possibles[k][possibles[k].length - 1] === auction.category) {
            cardPotentials[k] = 0;
          }
        }
      }
      let starter = 0;
      if (turn.findIndex((c) => !c) !== -1 && turn.findIndex((c) => c) !== -1) {
        starter = 3;
        while (turn[starter] && starter > 0) {
          starter--;
        }
        starter++;
      }
      if (starter !== 0) {
        const arrangedCards = [];
        for (let c = 0; c < turn.length; c++) {
          const card = turn[(c + starter) % 4];
          if (card) {
            arrangedCards.push(card);
          }
        }
        const sortedCards = Engine.sort(arrangedCards, auction.category);
        const leader = turn.indexOf(sortedCards[0]);
        if (leader !== 2 && possibleAssets === 0) {
          // if need to piss
          // then sometimes do something completely random
          if (Math.random() > 0.85) {
            for (let k = 0; k < cardPotentials.length; k++) {
              cardPotentials[k] = Math.random();
            }
          } else {
            // give away the smallest possible card, randomly chosen between cards with the same price
            for (let c = 0; c < possibles.length; c++) {
              const card = possibles[c];
              const value = card.slice(0, card.length - 1);
              const family = card[card.length - 1];
              let order = _consts_.__ORDERS__.REGUL;
              if (auction.category === 'AA' || auction.category === family) {
                order = _consts_.__ORDERS__.ASSET;
              }
              let prices = _consts_.__PRICES__.REGUL;
              if (auction.category === family) prices = _consts_.__PRICES__.ASSET;
              if (auction.category === 'AA') prices = _consts_.__PRICES__.AA;
              if (auction.category === 'NA') prices = _consts_.__PRICES__.NA;
              const price = prices[order.indexOf(value)];
              cardPotentials[c] = 1 / (price + 1e-10 + Math.random());
            }
          }
        } else if (leader === 2) {
          // if partner leading
          // then sometimes do something completely random
          if (Math.random() > 0.85) {
            for (let k = 0; k < cardPotentials.length; k++) {
              cardPotentials[k] = Math.random();
            }
          } else {
            for (let c = 0; c < possibles.length; c++) {
              const card = possibles[c];
              const value = card.slice(0, card.length - 1);
              const family = card[card.length - 1];
              const potential = cardPotentials[c];
              // first we don't want to play asset
              if (family === auction.category) {
                cardPotentials[c] = 0;
              } else {
                // is there a better card from same family in my hand that is the best one in its family
                const index = possibles.findIndex((c, i) => {
                  return c[c.length - 1] === family && cardPotentials[i] > potential;
                });
                if (index !== -1) {
                  cardPotentials[c] = Math.random();
                }
              }
            }
          }
        }
      }
      const play = {
        card: possibles[cardPotentials.indexOf(Math.max(...cardPotentials))]
      };
      const currentTime = performance.now();
      setTimeout(resolve, Math.max(__TIME_PLAY__[0] - Math.round(currentTime - startTime), 0), play);
    });
  }
};
