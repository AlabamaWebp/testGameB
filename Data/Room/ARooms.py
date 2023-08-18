from fastapi.routing import APIRouter

from Data.Room import DRooms

RoomsRouter = APIRouter()


def get_all_rooms():
    # tmp = []
    # for key in DRooms.players_in_rooms.keys():
    #     tmp.append(key)
    # return tmp
    return DRooms.rooms


@RoomsRouter.get("/rooms")
async def get_rooms():
    return get_all_rooms()


@RoomsRouter.post("/create_room")
async def create_room(
        room: str,
        max_players: int
):
    DRooms.rooms[room] = {
        "players": [],
        "count_players": max_players,
        "ready_players": []
    }
    return DRooms.rooms[room]


@RoomsRouter.delete("/delete_room")
async def delete_room(
        room: str
):
    if room in DRooms.rooms and DRooms.rooms[room]["players"] == []:
        del DRooms.rooms[room]
    return get_all_rooms()


@RoomsRouter.post("/in_room")
async def in_room(
        room: str,
        nickname: str
):
    if nickname not in DRooms.rooms[room]["players"]:
        return "Игрок уже в комнате"
    if DRooms.rooms[room]["count_players"] != len(DRooms.rooms[room]["players"]):
        return "Максимум игроков!"
    # Заменить на метание ошибок!!!!!!!!
    DRooms.rooms[room]["players"].append(nickname)
    return DRooms.rooms[room]


@RoomsRouter.post("/out_room")
async def out_room(
        room: str,
        nickname: str
):
    DRooms.rooms[room]["players"].remove(nickname)
    return get_all_rooms()
