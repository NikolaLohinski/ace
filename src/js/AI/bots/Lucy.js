import Utils from '../../utils.js';
import Engine from '../../engine/Engine';
import Constants from '../../../json/constants.json';
const __TIMEOUTBET = 2500;  // Time in ms
const __TIMEOUTCOINCHE = 2000;  // Time in ms
const __TIMEOUTPLAY = 1500;  // Time in ms
const _ = {
  potential: {
    start: 37,
    min: 80
  },
  factor: {
    partner: 0.75,
    coinche: 0.80
  },
  // 7, 8, Q, K, 10, A, 9, J
  assets: [
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
  regular: [
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
const Lucy = {
  /**
   * Given a game state, decides on an auction or pass
   * @param {Game} game the game state
   * @param {Player} me Reference of me
   * @return {Promise} promise of a bet object defining the action
   */
  bet (game, me) {
    return new Promise((resolve) => {
      const start = performance.now();
      const bet = {
        price: null,
        category: null,
        type: Constants.PASS,
        id: me.getId()
      };
      const possibles = Constants.AUCTIONPRICES
        .filter((price) => !game.getForbiddenPrices().includes(price))
        .filter((price) => !['CAP', 'GEN'].includes(price));
      const potentials = Lucy.buildPotentials(game, me);
      const bestFamilies = Object.keys(potentials)
        .filter((family) => {
          return potentials[family] >= Math.max(...Object.values(potentials));
        })
        .filter((family) => {
          return potentials[family] >= _.potential.min;
        })
        .filter((family) => {
          return potentials[family] >= Math.min(...possibles, Infinity);
        });
      const choice = Utils.pickRandom(bestFamilies);
      if (choice) {
        bet.category = choice;
        bet.type = Constants.BET;
        bet.price = possibles.reduce((closest, price) => {
          const value = potentials[choice];
          return Math.abs(closest - value) < Math.abs(price - value) ? closest : price;
        }, 0);
      }
      const now = performance.now();
      setTimeout(resolve, Math.max(__TIMEOUTBET - Math.round(now - start), 0), bet);
    });
  },
  /**
   * Compute potentials for each categoriy
   * @param {Game} game the game state
   * @param {Player} me Reference of me
   * @return {{s: number, h: number, c: number, d: number}}
   */
  buildPotentials (game, me) {
    const potentials = {
      's': _.potential.start,
      'h': _.potential.start,
      'c': _.potential.start,
      'd': _.potential.start
    };
    const groups = {
      's': [],
      'h': [],
      'c': [],
      'd': []
    };
    me.getHand().forEach((card) => {
      groups[Utils.getCardFamily(card)].push(Utils.getCardValue(card));
    });
    const myBets = game.getAuctions()[me.getId()];
    const partnersBets = game.getAuctions()[game.getPartner(me.getId())];
    Object.keys(potentials).forEach((family) => {
      // Check for partners bets
      if (partnersBets.some((bet) => bet.type !== Constants.PASS)) {
        partnersBets.forEach((bet) => {
          if (bet.category === family) {
            if (!myBets.find((myBet) => myBet.category === bet.category)) {
              potentials[family] = bet.price * _.factor.partner;
            }
          }
        });
      }
      // Then update according to hand
      Object.keys(groups).forEach((group) => {
        const prices = (group === family) ? Constants.PRICES.ASSET : Constants.PRICES.REGUL;
        const order = (group === family) ? Constants.ORDERS.ASSET : Constants.ORDERS.REGUL;
        groups[group].forEach((card) => {
          potentials[family] += prices[order.indexOf(card)];
        });
      });
    });
    return potentials;
  },
  /**
   * Given a game state, decides to coinche or wait
   * @param {Game} game Game state
   * @param {Player} me Reference of me
   * @return {Promise} promise of a bet object defining the action
   */
  coinche (game, me) {
    return new Promise((resolve, reject) => {
      const start = performance.now();
      const lastAuction = game.getLastAuction();
      if (['CAP', 'GEN'].includes(lastAuction.price)) {
        reject();
      } else if (['AA', 'NA'].includes(lastAuction.category)) {
        reject();
      } else {
        const assets = me.getHand().reduce((total, card) => {
          return Utils.getCardFamily(card) === lastAuction.category ? total + 1 : total;
        }, 0);
        const potentials = this.buildPotentials(game, me);
        let coinche = assets > 3 && !game.getOrder().some((id) => game.getDidCoinche()[id]);
        if (!coinche && !game.getOrder().some((id) => game.getDidCoinche()[id])) {
          coinche = 162 * _.factor.coinche - potentials[lastAuction.category] > lastAuction.price + _.potential.start;
        }
        if (coinche) {
          const bet = {
            category: null,
            price: null,
            type: Constants.COINCHE,
            id: me.getId()
          };
          const now = performance.now();
          setTimeout(resolve, Math.max(__TIMEOUTCOINCHE - Math.round(now - start), 0), bet);
        } else {
          reject();
        }
      }
    });
  },
  /**
   * Given a game state, decides which card to play
   * @param {Game} game Game state
   * @param {Player} me The bot
   * @return {Promise} Promise of a play object defining the action
   */
  play (game, me) {
    return new Promise((resolve) => {
      const start = performance.now();
      const auction = game.getLastAuction();
      const forbidden = Engine.forbiddenCards(game, me);
      const possibles = me.getHand().filter((card) => !forbidden.includes(card));
      const playedCards = game.getFolds().reduce((list, fold) => {
        return list.concat(Object.values(fold));
      }, []);
      const cards = {};
      possibles.forEach((card) => {
        let pot = _.regular;
        let o = Constants.ORDERS.REGUL;
        const family = Utils.getCardFamily(card);
        if (family === auction.category || auction.category === 'AA') {
          pot = _.assets;
          o = Constants.ORDERS.ASSET;
        }
        const potentials = pot.slice(0);
        const order = o.slice(0);
        while (potentials.length > 1 && !playedCards.includes(`${[...potentials].pop()}${family}`)) {
          potentials.pop();
        }
        cards[card] = [...potentials].pop()[order.indexOf(Utils.getCardValue(card))];
      });
      // Handle cases when all assets are gone, then there is no point in playing an asset
      const possibleAssets = possibles.filter((c) => Utils.getCardFamily(c) === auction.category).length;
      if (possibleAssets > 0) {
        const playedAssets = playedCards.filter((c) => Utils.getCardFamily(c) === auction.category).length;
        // Throw some random here and there
        if (playedAssets === Math.floor(Math.random()) + 7 - possibleAssets) {
          possibleAssets.forEach((card) => {
            cards[card] = 0;
          });
        }
      }
      if (game.getStarter() !== me.getId()) {
        const master = Engine.foldMaster(game);
        const partner = game.getPartner(me.getId());
        if (Math.random() > 0.85) {
          Object.keys(cards).forEach((card) => {
            cards[card] = Math.random();
          });
        } else if (master !== partner && possibleAssets === 0) {
          // give away the smallest possible card, randomly chosen between cards with the same price
          possibles.forEach((card) => {
            const family = Utils.getCardFamily(card);
            let order = Constants.ORDERS.REGUL;
            if (auction.category === 'AA' || auction.category === family) {
              order = Constants.ORDERS.ASSET;
            }
            let prices = Constants.PRICES.REGUL;
            if (auction.category === family) prices = Constants.PRICES.ASSET;
            else if (auction.category === 'AA') prices = Constants.PRICES.AA;
            else if (auction.category === 'NA') prices = Constants.PRICES.NA;
            const price = prices[order.indexOf(Utils.getCardValue(card))];
            cards[card] = 1 / (price + 1e-10 + Math.random());
          });
        } else if (master === partner) {
          // if partner leading
          possibles.forEach((card) => {
            const family = Utils.getCardFamily(card);
            const current = cards[card];
            if (family === auction.category) {
              cards[card] = 0;
            } else {
              if (possibles.find((c) => Utils.getCardFamily(c) && cards[card] > current)) {
                cards[card] = Math.random();
              }
            }
          });
        }
      }
      const card = Object.keys(cards).reduce((best, next) => {
        return cards[next] >= best ? next : best;
      }, -1);
      const play = {
        card,
        id: me.getId()
      };
      const now = performance.now();
      setTimeout(resolve, Math.max(__TIMEOUTPLAY - Math.round(now - start), 0), play);
    });
  }
};

export default Lucy;
