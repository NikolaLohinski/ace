class Player:
    """Class that defines what a player is"""

    def __init__(self, player_id=-1, game_id=-1):
        """Constructor"""
        self.player_id = player_id
        self.game_id = game_id
        self.game = None
        self.hand = []
