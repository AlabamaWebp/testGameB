class PlayerLobby:
    def __init__(self, nickname):
        self.nickname = nickname
    man = False


class Room:
    def __init__(self, name, count_players):
        self.name = name
        self.count_players = count_players
    players = list()


rooms = list()
rooms.append(Room("test", 2))
print(rooms.index())


