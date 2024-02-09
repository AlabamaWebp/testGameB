class SocketMessage:
    def __init__(self, d):
        self.event = d["event"]
        self.data = d["data"]
    event: str
    data: any
