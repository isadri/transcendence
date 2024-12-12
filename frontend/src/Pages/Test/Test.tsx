import { useEffect, useState } from 'react';
import { getendpoint } from '../../context/getContextData';

interface NotificationData {
    message: string; // Define the structure of the message data
}

const Test = () => {
    const [notifications, setNotifications] = useState<string[]>([]); // State is an array of strings (notifications)
    const socketUrl = getendpoint("ws", `/ws/notifications/`)
    let socket: WebSocket;

  useEffect(() => {
    // Create a WebSocket connection
    socket = new WebSocket(socketUrl);

    // Event listener for when the WebSocket connection is established
    socket.onopen = () => {
      console.log('Connected to notification server');
    };

    // Event listener for incoming messages
    socket.onmessage = (event: MessageEvent) => {
      const data: NotificationData = JSON.parse(event.data); // Assuming data is JSON with a `message` field
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        data.message,
      ]);
    };

    // Event listener for WebSocket errors
    socket.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };

    // Event listener for when the WebSocket connection is closed
    socket.onclose = () => {
      console.log('Disconnected from notification server');
    };

    // Cleanup function when the component is unmounted
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.map((notif, index) => (
        <div key={index}>{notif}</div>
      ))}
    </div>
  );
};

export default Test;

