import time

from classes.Room import Room


class Manager(object):
    """Manager class to handle players, rooms, sockets etc..."""

    def __init__(self):
        """Constructor

        Attributes:
            rooms (dict): id to room dictionary to store active rooms
            clients (dict): id to handler instance to store active clients

        """
        self.rooms = dict()
        self.clients = dict()

    def room_id_free(self, room_id):
        """Check whether a room id is available.

        Args:
            room_id (int): id of the room
        Returns:
            bool: true if the room id is not taken, false otherwise

        """
        return self.rooms.get(room_id) is None

    def player_id_free(self, player_id):
        """Check whether a player id is available.

        Args:
            player_id (int): id of the player
        Returns:
            bool: true if the player id is not taken, false otherwise

        """
        return self.clients.get(player_id) is None

    def new_room(self, player):
        """Creates a room and stores it given a player (a creator).

        Args:
            player (object): player object who created the room
        Returns:
            Room: the created room

        """
        epoch = int(time.time())
        time_code = epoch % 1000000
        room_id = (time_code + player['id']) % 1000000
        while not self.room_id_free(room_id):
            room_id = (room_id + 1) % 1000000
        self.rooms[room_id] = Room(room_id=room_id)
        self.add_player(room_id=room_id, player=player)
        return self.rooms[room_id]

    def add_player(self, room_id, player):
        """Add a player to a room.

        Args:
            room_id (int): identifier of the room
            player (object): player object who is joining the room
        Returns:
            Room: the updated room
        Raises:
            Exception: if the room does not exist, is full or the player is
            already in it
        """
        try:
            room_id = int(room_id)
        except ValueError:
            raise Exception('Room {} does not exist.'.format(room_id))
        finally:
            if not self.room_id_free(room_id=room_id):
                players = self.rooms.get(room_id).players
                if all(p['id'] != player['id'] for p in players):
                    if len(players) < 4:
                        player['roomId'] = room_id
                        self.rooms.get(room_id).players.append(player)
                        return self.rooms[room_id]
                    else:
                        raise Exception('Room {} is full. Player {} can\'t' +
                                        ' join.'.format(room_id, player['id']))
                else:
                    raise Exception('Room {} already has player {}.'.
                                    format(room_id, player['id']))
            else:
                raise Exception('Room {} does not exist.'.format(room_id))

    def new_player(self, name, handler_instance):
        """Create a brand new player instance and store its reference.

        Args:
            name (str): name of the player
            handler_instance(websocket.WebSocketHandler): websocket handler
        Returns:
            object: the created player

        """
        # Convert name into an integer code
        code = int(''.join([str(ord(c)) for c in list(name)])) % 100000
        # Get current time's 5 last digits
        time_code = int(time.time()) % 100000
        # Combine those 2 to create a hopefully unique identifier
        player_id = int(str(time_code) + str(code))
        while not self.player_id_free(player_id):
            player_id = (player_id + 1) % 10000000000
        self.clients[player_id] = handler_instance
        return {
            'name': name,
            'id': player_id,
            'ready': False,
            'roomId': -1
        }

    def upd_player(self, room_id, player_id, update_data):
        """Update a player given update data.

        Args:
            room_id (int): identifier of the room
            player_id (int): identifier of the player
            update_data (object): a key/value object to specify the update
        Returns:
            Room: the updated room
        """
        key = update_data['key']
        value = update_data['value']
        players = self.rooms.get(room_id).players
        index = [i for i, x in enumerate(players) if x['id'] == player_id][0]
        players[index][key] = value
        return self.rooms[room_id]

    def rm_player(self, player_id):
        """Delete a player and any reference to it. If player is last in room,
        then delete room as well.

        Args:
            player_id (int): identifier of the player
        """
        self.clients.pop(player_id)
        for key in self.rooms:
            room = self.rooms[key]
            removed = room.rm_player(player_id)
            if removed:
                if room.is_empty():
                    self.rooms.pop(key)
                return room
        return None

    def revive_player(self, room_id, player, handler_instance):
        """Revive a connection of a player if it exists.

        Args:
            room_id (int): identifier of the room
            player (int): the player to revive
            handler_instance(websocket.WebSocketHandler): websocket handler
        Returns:
            object: the created player
        Raises:
            Exception: if the player or the room does not exist anymore
        """
        room = self.rooms.get(room_id)
        client = self.clients.get(player['id'])
        if client is None:
            raise Exception('Player {} does not exist anymore.'
                            .format(player['id']))
        if room is None:
            self.rm_player(player['id'])
            raise Exception('Room {} does not exist anymore.'.format(room_id))
        self.clients[player['id']] = handler_instance
        return room

    def is_alive(self, player_id):
        """Check if a player is still alive. For now, a player is considered
        to be always alive.

        Args:
            player_id (int): identifier of the player

        """
        return True