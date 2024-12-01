from channels.generic.websocket import AsyncWebsocketConsumer


class GameStart(AsyncWebsocketConsumer):

  async def connect(self):
    await self.accept()

  async def disconnect(self, code):
    print(code)