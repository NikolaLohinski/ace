import json
import copy
from .PyAce import PyAce


def _ordered(obj):
    if isinstance(obj, dict):
        return sorted((k, _ordered(v)) for k, v in obj.items())
    if isinstance(obj, list):
        return sorted(_ordered(x) for x in obj)
    else:
        return obj


def run_scenario(scenario, constants):
    # ----------------------------------------------------- Prepare scenario ---
    _scenario = copy.deepcopy(scenario)
    # Create game instance
    env = PyAce(constants=constants, host='localhost', port=8765)
    # Get order of players
    order = _scenario.get('order')
    # Define players. Ids are enough
    players = [dict(id=identifier) for identifier in order]
    # Compute start hands from _scenario
    hands = {
        identifier: list(map(
            lambda f: f.get(identifier),
            _scenario.get('folds')
        )) for identifier in order
    }
    # ------------------------------------------------------------ Init game ---
    env.init(players=players, dealer=_scenario.get('dealer'))
    # Deal cards with provided hands
    env.deal(hands=hands)
    # ------------------------------------------------------------ Play bets ---
    # Get last auction placed (only bets, no coinche or pass)
    last_auction = env.last_auction(game=_scenario)
    game = env.get_game()
    while game['state'] == constants['__GAME_STATE_BETS__']:
        whos_turn = env.get_game()['whosTurn']
        auction = _scenario.get('auctions').get(whos_turn).pop(0)
        env.bet(bet=auction)
        if auction == last_auction:
            # If last auction was reached
            # Check if someone coinched
            coinches = len(_scenario.get('coinche'))
            if coinches > 0:
                # If someone has to coinche, we need to make him coinche when it
                # is their turn
                while coinches > 0:
                    for identifier in _scenario.get('coinche').keys():
                        if env.get_game()['canCoinche'][identifier]:
                            a = _scenario.get('auctions').get(identifier).pop(0)
                            env.bet(bet=a)
                            coinches -= 1
        game = env.get_game()
    # ----------------------------------------------------------- Start game ---
    env.start()
    # ----------------------------------------------------------- Play cards ---
    # Play each fold according to scenario
    for fold in _scenario.get('folds'):
        for _ in range(4):
            whos_turn = env.get_game()['whosTurn']
            # Check forbidden cards (useless when using a scenario)
            # forbidden_cards = env.forbidden_cards(whos_turn)
            # Check who masters the fold (useless when using a scenario)
            # fold_master = env.fold_master()
            env.play(card=fold[whos_turn])

    # -------------------------------------------------------- Game finished ---
    # Check if _scenario ran successfully by comparing record to _scenario
    game = env.get_game()
    record = game['history'][-1]
    differences = False
    for key in record.keys():
        difference = json.dumps(_ordered(record[key])) != json.dumps(
            _ordered(scenario[key])
        )
        if difference:
            print('Error for "{}":'.format(key))
            print('- Expected:\n  {}'.format(scenario[key]))
            print('- Got:\n  {}'.format(record[key]))
            differences = True
    if not differences:
        print('Scenario ran successfully : no differences found')
    return game
