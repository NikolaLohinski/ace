const translations = {
  // ENGLISH
  'en-EN': {
    'currentLanguage': 'English',
    'home': {
      'playOffline': 'Offline'
    },
    'settings': {
      'title': 'Settings',
      'changeLanguage': 'Language ACE',
      'pleaseChooseName': 'Public ACE name',
      'reset': 'Reset ACE',
      'confirmReset': 'Are you sure you want to reset ACE completely ?'
    },
    'scores': {
      'title': 'Scores',
      'us': 'Us',
      'them': 'Them'
    },
    'menu': {
      'title': 'Menu',
      'quit': 'Quit',
      'sortCards': 'Sort cards',
      'youWillLoseYourCurrentProgress': 'You will lose your current progress'
    },
    'utils': {
      'ok': 'Ok',
      'warning': 'Warning',
      'cancel': 'Cancel',
      'you': 'You',
      'continue': 'Continue',
      'back': 'Back'
    },
    'play': {
      'title': 'Play',
      'start': 'Start',
      'bet': 'Bet',
      'pass': 'Pass',
      'toPass': 'Pass',
      'CAP': 'All',
      'GEN': 'Alone',
      'players': 'Players',
      'dealer': 'Dealer',
      'playerType': 'Type',
      'pleaseChooseAName': 'Please choose a pseudo',
      'wonPhrase': 'You won, congratulations !',
      'lostPhrase': 'Too bad, you lost...',
      'scoresUsThem': 'Us : {us} - Them : {them}',
      'withBelote': 'With belote',
      'made': 'Auction {auction} was achieved',
      'failed': 'Auction {auction} was lost',
      'achieved': 'Achieved',
      'lost': 'Failed',
      'lostGamePhrase': 'You lost the game...',
      'wonGamePhrase': 'Victory !',
      'playerCoinched': '{player} coinched !',
      'playerSurCoinched': '{player} counter-coinched !',
      'ai': {
        'title': 'Bot',
        '1': {
          'name': 'BacterIA',
          'description': 'Unpredictable'
        },
        '2': {
          'name': 'LucIA',
          'description': 'First born'
        }
      }
    },
    'questions': {
      'title': 'Questions',
      'rules': {
        'title': 'Rules',
        'content': `        
# Introduction
The **coinche** also called **belote coinchée** is a variation of the french belote. Given a distribution of 32 cards, 
from a classic deck, it consists in a two against two game where the goal is to place an auction based on one's card 
and other players' auctions, and then try to fulfill then engagement, or make the opponents fail theirs.

# 1 Game
## 1.1 Stages
A coinche game is composed of several sessions, and each session is a sequence of 4 ordered stages :
* the dealing of cards performed by the _dealer_
* the auctions during which the players place their auctions and get an engagement
* the execution of the engagement, which is the actual game
* the count of points to determine if the engagement was fulfilled or not

## 1.2 Goal
To win the game, a team has to reach **1000 points** with an unlimited number of sessions.
Each session can win a team 300 points alone, and up to 1200 points if the auction was coinched and counter-coinched.

# 2 Dealing
A session always starts with a dealing of cards using a deck of 32 cards (7, 8, 9, 10, Jack, Queen, King, As). The 
deck has to be reused without shuffle from the previous session if any. The **dealer** is chosen randomly 
at the beginning of the game. When a new session starts, the player immediately to the right of the previous dealer 
becomes the new dealer. He asks the player to his left to cut the deck, and then deals the cards counter-clockwise 
with an order of his choosing in the following ones :
* 2 cards, then 3 cards, then 3 cards
* 3 cards, then 2 cards, then 3 cards
* 3 cards, then 3 cards, then 2 cards

# 3 Auctions
## 3.1 Engagement
Once the deck has been dealt, the player on the right of the dealer initiates the auctions. The goal is to determine the
asset of the current session. Each player, during his turn can :
* Pass, which will not prevent him from placing a auction afterwards 
* Place an auction higher than the previous one, defined by a number of points and a color

The colors are those of the cards (![icon](${require('../img/spades.png')})  
![icon](${require('../img/hearths.png')}), 
![icon](${require('../img/clubs.png')}), 
![icon](${require('../img/diamonds.png')}))
or one of the the following :
* All asset ![icon](${require('../img/AA.png')}) : all colors are asset
* No asset ![icon](${require('../img/NA.png')}) : there are no assets

The number of points of an auction start at a **minimum of 80 points** and increases 10 by 10 up to 180 points, _all_ 
(all the folds) which corresponds to 250 points, or _alone_ (all the folds without any help from the partner) which 
yields 300 points. The auctions stop when three players _passed_ in a row, or when someone coinched.

## 3.2 Coinche
A fundamental rule of the game is the ability to coinche: if a player places an auction, and an opponent thinks it can 
not be done, he can **coinche** the auction. The points at stake are then doubled. The player who has been coinched can 
also counter-coinche the coinche, doubling again the points at stake. This puts an end to the auctions and the execution
begins.
![big-icon](${require('../img/coinche.png')})

# 4 Execution
## 4.1 Assets and orders
The are two types of cards depending on the engagement : asset and not asset. For example, if an auction of 100
points at ![icon](${require('../img/diamonds.png')}) has been placed, then all the 
![icon](${require('../img/diamonds.png')}) cards will be considered asset and all the others as not asset. Each type 
has a specific order and assets are better than other cards. The order in a color family is the following :
* Asset : Jack > 9 > As > 10 > King > Queen > 8 > 7
* Not asset : As > 10 > King > Queen > Jack > 9 > 8 > 7
With the previous example with an auction of 100 ![icon](${require('../img/diamonds.png')}), the 7 of 
![icon](${require('../img/diamonds.png')}) is better than the 10 of 
![icon](${require('../img/spades.png')}), which is better than the king of 
![icon](${require('../img/spades.png')}), which is completely equivalent to the 7 of 
![icon](${require('../img/clubs.png')}). Finally, a player **masters a fold** when he has the best card of the fold,
following the previous rules.

## 4.2 Progress
During the first round of the execution, once the auctions are closed, it is the player immediately to the right of the
dealer who starts by playing a card of his choice. Then all the other player play sequentially and the one to win the 
fold is the one who masters it given the previous order rules on cards and the following additional ones :
* If a player has cards from the same color as the first one played, he has to choose among those cards
* If the player has no cards of the same color, he has to play an asset. This is called **cutting**
* If the player has to play an asset, he has to put a better asset than any asset already played if he can
* If the player has to cut, but his partner currently masters the fold, he can play any card
* By default, the player who starts the fold masters it until a strictly better card is played

## 4.3 All asset and no asset
When the auction of the session is _all asset_  ![icon](${require('../img/AA.png')}), all the cards are considered as
assets and the players always have to play a better card than the previous one of they can. When the auction
of the session is _no asset_ ![icon](${require('../img/NA.png')}), the players can play whatever they want given that 
they provide a card from the same color family as the first card. During all asset or no asset, **cutting is not 
possible** and only the order in a colors's family is important. Therefore when the family color requirement can not be
met, a player can player any card.

# 5 Count of points
## 4.1 Principle
The count of points is performed at the end of a session, to determine if the engagement has been fulfilled, and which
team will get the points at stake. There are 152 points coming from the cards, and 10 points for those who won the last
fold, which makes a total of **162 points** during the execution. An engagement is fulfilled if the announcer's team
won at least as many points as the auction they placed. Moreover, the following additional rules apply :
* If an auction of 80 points is placed, the auctioneers have to win 81 points (half of the points)
* If one of the members of the team has the king and queen of asset, he has the **belote**
* The belote decreases the points the team has to win in order to fulfill the engagement with a minimum of 81 points

If an engagement is fulfilled, the team that placed the auction gets the points of the auction. Otherwise it is the 
other team that earns them. If the auction has been coinched, then those points are doubled and doubled again if
the auction was counter-coinched.

## 4.2 Regular session
The 152 points from the cards for a regular session are based on their type with the following distributions.

### 4.2.1 Assets
* Jack : 20 points
* 9 : 14 points
* As : 11 points
* 10 : 10 points
* King : 4 points
* Queen : 3 points
* 8 and 7 : 0 points

### 4.2.2 Regular
* As : 11 points
* 10 : 10 points
* King : 4 points
* Queen : 3 points
* Jack : 2 points
* 9, 8 and 7 : 0 points

## 4.3 All asset
During an all asset session, the **belote is useless** and the distribution is the following :
* Jack : 14 points
* 9 : 9 points
* As : 6 points
* 10 : 5 points
* King : 3 points
* Queen : 1 points
* 8 and 7 : 0 points

## 4.4 No asset
During a no asset session, the **belote is useless** and the distribution is the following :
* As : 19 points
* 10 : 10 points
* King : 4 points
* Queen : 3 points
* Jack : 2 points
* 9, 8 and 7 : 0 points
        `
      },
      'about': {
        'title': 'About ACE',
        'content': `
![ace-logo](${require('../img/ace-logo.png')})
**ACE** &#8212; _Awesome Coinche Entertainer_ &#8212; is a non-lucrative project maintained by 
[Nikola Lohinski](https://NikolaLohinski.github.io). It consists in a _web only_ app to play the french
card game Coinche and a set of artificial intelligences (AIs) to make the game more challenging.
The [code](https://github.com/NikolaLohinski/awesome-coinche-entertainer) is _open source_ and you are encouraged
to test the game, the IAs, and even give us a hand in the development, which would be greatly appreciated ! 
![dealer-coin](${require('../img/dealer-coin.png')})
#### V${__VERSION__} 
#### Copyright © 2017 Nikola Lohinski
#### MIT Licence
        `
      }
    }
  },
  // FRANÇAIS
  'fr-FR': {
    'currentLanguage': 'Français',
    'home': {
      'playOffline': 'Hors-ligne'
    },
    'settings': {
      'title': 'Options',
      'cancel': 'Annuler',
      'changeLanguage': 'Langue de ACE',
      'pleaseChooseName': 'Votre pseudo ACE',
      'reset': 'Réinitialiser ACE',
      'confirmReset': 'Êtes-vous sûr de vouloir réinitialiser ACE ?'
    },
    'scores': {
      'title': 'Scores',
      'us': 'Nous',
      'them': 'Eux'
    },
    'menu': {
      'title': 'Menu',
      'quit': 'Quitter',
      'sortCards': 'Trier les cartes',
      'youWillLoseYourCurrentProgress': 'Vous ne pourrez plus reprendre le cours de la partie'
    },
    'utils': {
      'ok': 'Ok',
      'warning': 'Attention',
      'cancel': 'Annuler',
      'you': 'Vous',
      'continue': 'Continuer',
      'back': 'Retour'
    },
    'play': {
      'title': 'Jouer',
      'start': 'Démarrer',
      'bet': 'Annonce',
      'pass': 'Passe',
      'toPass': 'Passer',
      'CAP': 'Capot',
      'GEN': 'Générale',
      'players': 'Joueurs',
      'dealer': 'Dealer',
      'playerType': 'Type',
      'pleaseChooseAName': 'Veuillez renseigner un pseudo',
      'wonPhrase': 'Victoire, bravo !',
      'lostPhrase': 'Dommage...',
      'scoresUsThem': 'Nous : {us} - Eux : {them}',
      'withBelote': 'Avec belote',
      'made': 'Annonce {auction} faite',
      'failed': 'Annonce {auction} chutée',
      'achieved': 'Fait',
      'lost': 'Chuté',
      'lostGamePhrase': 'Partie perdue...',
      'wonGamePhrase': 'Victoire !',
      'playerCoinched': 'Coinché par {player} !',
      'playerSurCoinched': 'Surcoinché par {player} !',
      'ai': {
        'title': 'PNJ',
        '1': {
          'name': 'BacterIA',
          'description': 'Imprédictible'
        },
        '2': {
          'name': 'LucIA',
          'description': 'Première née'
        }
      }
    },
    'questions': {
      'title': 'Questions',
      'rules': {
        'title': 'Règles',
        'content': `        
# Introduction
La **coinche** aussi appelée belote coinchée, est une variante de la belote. Étant donnée une distribution sur un jeu de
32 cartes, elle se joue à deux contre deux, le but étant d'annoncer un nombre de points que l'on compte faire en 
fonction de ses cartes, des annonces du partenaire et de celles des adversaires. Il faut ensuite réaliser le contrat
annoncé à l'aide de son partenaire, ou faire _chuter_ le contrat adversaire. 

# 1 Partie
## 1.1 Étapes
Une partie de coinche se décompose en **plusieurs donnes** et chaque donne est décrite dans l'ordre par :
* la distribution des cartes par le _dealer_
* une séance d'enchères durant lesquelles les joueurs annoncent les contrats qu'ils souhaitent réaliser
* le jeu si un contrat a été remporté et durant lequel une équipe tente de le réaliser pendant que l'autre l'en empêche
* le décompte des points pour déterminer si le contrat a été tenu ou non

## 1.2 Objectif
Une partie de coinche se joue généralement en **1000 points** qu'il faut atteindre avec un nombre quelconque de 
contrats, chaque contrat pouvant rapporter jusqu'à 300 points seul, et jusqu'à 1200 points s'il est coinché puis 
sur-coinché.

# 2 Distribution des cartes
La donne débute par la distribution des cartes qui se fait sur un jeu de 32 cartes (7, 8, 9, 10, Valet, Dame, Roi, As) 
avec lorsque c'est possible le paquet de la donne précédente, sans mélanger. Le **dealer** est choisi arbitrairement 
en début de partie puis succède à son prédécesseur dans le sens inverse des aiguilles d'une montre. Il fait alors couper
le paquet à son voisin de gauche et distribue aux autres joueurs et à lui même, toujours dans le sens horaire inverse 
selon un des ordres suivants :
* 2 cartes, puis 3 cartes, puis 3 cartes
* 3 cartes, puis 2 cartes, puis 3 cartes
* 3 cartes, puis 3 cartes, puis 2 cartes

# 3 Enchères
## 3.1 Contrat
Le joueur situé à la droite du _dealer_ fait débuter les enchères qui se 
déroulent dans le **sens horaire inverse** et qui permettent de déterminer l'atout de la partie.
Chaque joueur a alors deux choix lorsque son tour vient :
* Soit il annonce qu'il passe, ce qui ne l'empêche pas de surenchérir aux tours suivants.
* Soit il surenchérit sur la dernière enchère en annonçant un nombre de points forcément plus élevé suivi d'une couleur

Les couleurs sont les quatre d'un jeu classique (![icon](${require('../img/spades.png')})  
![icon](${require('../img/hearths.png')}), 
![icon](${require('../img/clubs.png')}), 
![icon](${require('../img/diamonds.png')}))
auxquelles viennent s'ajouter :
* Tout atout ![icon](${require('../img/AA.png')}) : toutes les couleurs sont de l'atout
* Sans atout ![icon](${require('../img/NA.png')}) : aucune couleur n'est de l'atout.

Les enchères débutent au **minimum à 80 points** et se font de dix en dix jusqu'à 180, capot (tous les plis) qui vaut 
250 points, ou générale (tous les plis sans l'aide du partenaire) qui vaut 300 points. Elles se terminent en cas de 
coinche, ou lorsque trois joueurs d'affilée n'ont rien annoncé.

## 3.2 Coinche
Une règle fondamentale du jeu est le fait de pouvoir coincher ; si un joueur annonce un contrat, et qu'un de ses 
adversaires pense que celui-ci n'atteindra pas son objectif de points, ce dernier peut **coincher** cette enchère. Les 
points remportés de l'équipe gagnante seront alors doublés. Le joueur ainsi coinché peut également sur-coincher de la 
même manière, ce qui quadruple les points de l'équipe gagnante.
![big-icon](${require('../img/coinche.png')})

# 4 Jeu
## 4.1 Atouts et ordres
On distingue deux type de cartes selon le contrat en cours. Il y a les cartes de type **atout** et les autres. Par 
exemple, si un contrat de 100 point à la couleur ![icon](${require('../img/diamonds.png')}) a été annoncé, alors toutes
les cartes de type ![icon](${require('../img/diamonds.png')}) seront considérées comme des atouts. Ensuite, il existe un
ordre sur les cartes d'une même couleur, sachant que les atouts sont par définition meilleurs que les non-atouts. 
Ces derniers sont par ailleurs équivalents les uns par rapport aux autres en dehors de leurs couleurs respectives dont
l'ordre interne est donné par :
* À l'atout : Valet > 9 > As > 10 > Roi > Dame > 8 > 7
* Au non-atout : As > 10 > Roi > Dame > Valet > 9 > 8 > 7
Pour clarifier avec l'exemple précédent à 100 ![icon](${require('../img/diamonds.png')}), le 7 de 
![icon](${require('../img/diamonds.png')}) est meilleur que 10 de 
![icon](${require('../img/spades.png')}), qui est lui-même meilleur que le roi de 
![icon](${require('../img/spades.png')}), et tout deux sont complètement équivalents au 7 de 
![icon](${require('../img/clubs.png')}). On dit également qu'un joueur est **maître** sur un pli ou sur une carte si la
carte qu'il a joué est meilleure que les autres.

## 4.2 Déroulement
Au premier tour, lorsque les enchères sont closes, c'est le joueur immédiatement après le dealer qui démarre, en jouant
la carte de son choix. S'en suivent alors les autres joueurs et celui qui remporte le pli, étant donné l'ordre total des
carte énoncé plus haut, est celui qui est maître lorsque tout le monde a joué en suivant les règles suivantes:
* Si le joueur possède des cartes de la couleur demandée (par la première carte), il doit choisir parmi celles-ci
* Si la couleur demandée est la couleur de l'atout, le joueur doit fournir une carte meilleure si possible
* Si le joueur ne peut fournir la couleur demandée, il doit jouer un atout ; on parle de **coupe**
* Si le joueur doit couper mais que son partenaire est maître sur le pli, le joueur peut jouer n'importe quelle carte
* Est *maître* la première carte du pli tant qu'une meilleure carte n'est pas jouée ou une coupe réalisée.

## 4.3 Tout atout et sans atout
Dans le cas du tout atout ![icon](${require('../img/AA.png')}), toutes les cartes sont considérées comme des atouts, et
les joueurs doivent toujours fournir une meilleure carte que la précédente. Dans le cas du sans atout 
![icon](${require('../img/NA.png')}), les joueurs peuvent jouer comme bon leur semble mais doivent toujours fournir la
couleur demandée. Dans ces deux modes de jeu, la **coupe n'existe pas** et seul l'ordre dans une couleur est important.

# 5 Décompte de points
## 4.1 Principe
Le décompte des points est réalisé à la fin d'une donne, pour déterminer si le contrat a été rempli ou non, et quelle 
équipe bénéficiera des points de jeu. Il y a 152 points en jeu au travers des cartes, et 10 points pour le dernier pli 
donc un total de **162 points** au maximum. Un contrat est donc rempli si l'annonceur a remporté au moins autant de 
points que le stipulait son contrat. De plus, quelques règles spécifiques sont à énoncer :
* Quand un contrat de 80 est annoncé, l'équipe qui annonce doit en fait réaliser au moins la moitié des points soit 81
* Si un des membres de l'équipe annonceuse possède le roi et la dame à l'atout, il possède **la belote**
* La belote permet à l'équipe annonceuse d'avoir à réaliser 20 points de moins, avec toujours un minimum de 81 à faire
Si le contrat est réussi, l'équipe annonceuse remporte les points de l'annonce. Si le contrat est raté, c'est l'autre
équipe qui récupère les points de l'annonce. Si l'annonce a été coinché, les points sont doublés et quadruplés si 
l'annonce est sur-coinchée.

## 4.2 Donne classique
Les 152 points des cartes pour une donne classique sont donnés par les répartitions suivantes qui dépendent du type de 
la carte.

### 4.2.1 Atouts
* Valet : 20 points
* 9 : 14 points
* As : 11 points
* 10 : 10 points
* Roi : 4 points
* Dame : 3 points
* 8 et 7 : 0 points

### 4.2.2 Non atouts
* As : 11 points
* 10 : 10 points
* Roi : 4 points
* Dame : 3 points
* Valet : 2 points
* 9, 8 et 7 : 0 points

## 4.3 Tout atout
A tout atout, la **belote ne compte pas** et la répartition est la suivante :
* Valet : 14 points
* Le 9 : 9 points
* As : 6 points
* 10 : 5 points
* Roi : 3 points
* Dame : 1 points
* 8 et 7 : 0 points

## 4.4 Sans atout
A sans atout, la **belote ne compte pas** et la répartition est la suivante :
* As : 19 points
* 10 : 10 points
* Roi : 4 points
* Dame : 3 points
* Valet : 2 points
* 9, 8 et 7 : 0 points
        `
      },
      'about': {
        'title': 'À propos d\'ACE',
        'content': `
![ace-logo](${require('../img/ace-logo.png')})
**ACE** &#8212; _Awesome Coinche Entertainer_ &#8212; est un projet a but non lucratif entretenu par 
[Nikola Lohinski](https://NikolaLohinski.github.io). Le but est de réaliser une application mobile _web only_ pour
le jeu de Coinche mais également les intelligences artificielles (IAs) de jeu permettant de rendre les 
parties plus intéressantes et stimulantes. Le [code](https://github.com/NikolaLohinski/awesome-coinche-entertainer) de
l'application est disponible librement en _open source_ et nous invitons à tester le jeu, les IAs, et si le coeur vous 
en dit, à proposer votre aide pour le développement, qui sera la bienvenue ! 
![dealer-coin](${require('../img/dealer-coin.png')})
#### V${__VERSION__} 
#### Copyright © 2017 Nikola Lohinski
#### MIT Licence 
        `
      }
    }
  }
};

export default (vue) => {
  const languageList = [];
  for (const language in translations) {
    if (!translations.hasOwnProperty(language)) continue;
    languageList.push(language);
    vue.i18n.add(language, translations[language]);
  }
  const userLanguage = navigator.language || navigator.userLanguage;
  if (languageList.indexOf(userLanguage) !== -1) {
    vue.i18n.set(userLanguage);
  } else {
    vue.i18n.set(languageList[0]);
  }
};
