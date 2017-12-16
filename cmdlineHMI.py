import random
from classes.Game import Game
from classes.Card import Card


def input_players():
    """Function that asks for input players and affects the teams.

    Args:
        game (Game): the created game

    Returns:
        Game: game populated with input players
    """
    rand = input('Create random ids and teams ? ([y]/n) ')
    if rand == 'y' or rand == '':
        players = [x * random.randint(0, 100) for x in range(1, 5)]
        team1 = random.sample(players, 2)
    else:
        id1 = input('Add 1st player to the game : (player\'s id) ')
        id2 = input('Add 2nd player to the game : (player\'s id) ')
        id3 = input('Add 3rd player to the game : (player\'s id) ')
        id4 = input('Add 4th player to the game : (player\'s id) ')
        ids = [id1, id2, id3, id4]
        player1_team1 = input('Affect team 1 with a player: ({}) '.format(', '.join(ids)))
        ids.pop(ids.index(player1_team1))
        player2_team1 = input('Affect team 1 with a player: ({}) '.format(', '.join(ids)))
        ids.pop(ids.index(player2_team1))
        players = [id1, id2, id3, id4]
        team1 = [player1_team1, player2_team1]
    return players, team1


def input_dealer(players):
    str_players = [str(p) for p in players]
    dealer = input('Choose dealer : ({},[random]) '.format(','.join(str_players)))
    dealer_id = 0
    if dealer == '' or dealer == 'random':
        dealer_id = players[random.randint(0, 3)]
    elif dealer in str_players:
        dealer_id = players[str_players.index(dealer)]
    print('\nDealer is player {}.'.format(dealer_id))
    return dealer_id


def bets_phase_input(player, cards, possibles, lead):
    print('\nIt is player\'s {} turn.'.format(player))
    print('Hand :')
    print(', '.join(str(x) for x in sort_hand(cards)))
    print('He can bet: {}'.format(', '.join(str(x) for x in possibles)))
    leading_ply, leading_bet = lead
    if leading_ply == -1:
        print('No one is leading.')
    else:
        print('Leading bet is {} by player {}'.format(str(leading_bet), str(leading_ply)))
    bet = None
    if input('Would you like to bet ? (y/[n])') == 'y':
        string_possible_bets = [str(x) for x in possibles]
        string_possible_bets[0] = '[{}]'.format(string_possible_bets[0])
        value = input('Please choose a value : ({}) '.format(', '.join(string_possible_bets)))
        if value == '':
            value = possibles[0]
        family = input('Please choose a family : ([h], c, s, d) ')
        if family == '':
            family = 'h'
        bet = '{},{}'.format(value, family)
    return bet


def end_bets_phase(state, player):
    print('_________________________\n\nEnd of the bets phase ...\n_________________________')
    if player == -1:
        print('\nNo one bet anything.')
        finish_game(state, player)


def play_phase_input(fold, player, cards, possibles, lead, scores):
    print('\nIt is player\'s {} turn.\n'.format(player))
    lead_ply, lead_bet = lead
    print('Maximal bet was of ({}) by player {}'.format(lead_bet, lead_ply))
    print('Current score is {} (for player {} and his team) to {} (for the others)'.format(scores[0], player, scores[1]))
    print('\nCurrent fold is : {}'.format(fold))
    print('Hand : {}\n'.format(', '.join(str(x) for x in sort_hand(cards))))
    possible_cards = [cards[x] for x in possibles]
    string_possible_cards = [str(x) for x in sort_hand(possible_cards)]
    string_possible_cards[0] = '[{}]'.format(string_possible_cards[0])
    card = input('Which card do you want to play ? ' +
                 '({})'.format(', '.join(string_possible_cards)))
    if card == '':
        card = str(sort_hand(possible_cards)[0])
    index_possibles = possible_cards.index(Card(card))
    return possibles[index_possibles]


def finish_game(state, lead):
    winner = state['game-data']['winner']
    if winner != -1:
        print('_________________________\n\nEnd of the play phase ...\n_________________________')
        leading_ply, leading_bet = lead
        score = state['past']['score']
        team_winner = [state['actors']['players'][x] for x in state['actors']['teams'][winner]]
        team_loser = [state['actors']['players'][x] for x in state['actors']['teams'][(winner + 1) % 2]]
        print('\nBet was ({}) by player {}.'.format(leading_bet, leading_ply))
        if leading_ply in team_winner:
            print('\nTeam ({}) has won the bet against team ({}), by {} to {}.\n'.format(
                ', '.join(str(x) for x in team_winner),
                ', '.join(str(x) for x in team_loser),
                score[winner],
                score[(winner + 1) % 2]
            ))
        else:
            print('\nTeam ({}) has lost the bet against team ({}), by {} to {}.\n'.format(
                ', '.join(str(x) for x in team_loser),
                ', '.join(str(x) for x in team_winner),
                score[(winner + 1) % 2],
                score[winner]
            ))

    print('_________________________\n\nEnd of the game ...\n_________________________')


def sort_hand(hand):
    # First group by family
    families = ['h', 'c', 'd', 's']
    grouped = []
    for f in families:
        for card in hand:
            if card.family == f:
                grouped.append(card)
    return sorted(grouped, reverse=True)


if __name__ == '__main__':
    pls, gp_1 = input_players()
    dlr = input_dealer(pls)
    cmd_game = Game(players=pls, team1=gp_1, dealer=dlr)
    print('_________________________\n\nNow starting the game ...\n_________________________')
    print('_________________________\n\nNow starting the bets phase ...\n_________________________')
    cmd_game.start_bets(input_callback=bets_phase_input, end_callback=end_bets_phase)
    print('_________________________\n\nNow starting the play phase ...\n_________________________')
    cmd_game.start_play(input_callback=play_phase_input, end_callback=finish_game)

