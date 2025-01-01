import asyncio
from websockets.asyncio.client import connect
import argparse
import json
import time

async def send_messages(ws_url, session_id, access_token, interval=5):
    """
    Connects to the WebSocket server and sends messages in a loop.
    Args:
        ws_url (str): The WebSocket server URL.
        session_id (str): The session ID for authentication.
        access_token (str): The access token for authentication.
        interval (int): Time in seconds between messages.
    """
    # Construct cookies as a single string
    cookies = f"sessionid={session_id}; access_token={access_token}"
    headers = {
        "User-Agent": "Python WebSocket Client",
        "Cookie": cookies,
    }

    try:
        async with connect(ws_url, additional_headers=headers) as websocket:
            print(f"Connected to WebSocket server at {ws_url}")

            while True:
                # Example message payload
                message_payload = {
                    "message_type": "block_friend",
                    "chat_id": 6,
                    "blocker": 3,
                    "blocked": 2,
                    "status": True
                }

                # Send the message
                await websocket.send(json.dumps(message_payload))
                print(f"Message sent: {message_payload}")

                # Wait for a response (optional)
                try:
                    response = await websocket.recv()
                    print(f"Received response: {response}")
                except websockets.exceptions.ConnectionClosed:
                    print("Connection closed by the server.")
                    break

                # Wait for the next message
                time.sleep(interval)

    except Exception as e:
        print(f"An error occurred: {e}")


def main():
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description="WebSocket Client Script")
    parser.add_argument("--url", required=True, help="WebSocket server URL")
    parser.add_argument("--sessionid", required=True, help="Session ID for the connection")
    parser.add_argument("--access_token", required=True, help="Access token for the connection")
    parser.add_argument("--interval", type=int, default=5, help="Interval in seconds between messages")

    args = parser.parse_args()

    # Start the event loop
    asyncio.run(send_messages(args.url, args.sessionid, args.access_token, args.interval))


if __name__ == "__main__":
    main()