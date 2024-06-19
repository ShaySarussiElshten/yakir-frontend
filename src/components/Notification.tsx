import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

const socket: Socket = io('http://localhost:5000');

type INotification = {
    msg: string;
    time: string;
}

const NotificationComponent: React.FC = () => {
    const [notifications, setNotifications] = useState<INotification[]>([]);

    const sendNotification = () => {
        socket.emit('send_notification', { msg: 'New notification!' });
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get<INotification[]>('http://localhost:5000/api/notifications');
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();


        socket.on('receive_notification', (data: INotification) => {
            setNotifications(prevNotifications => [...prevNotifications, data]);
        });

        
        return () => {
            socket.off('receive_notification');
        };
    }, []);

    return (
        <div className="p-4 max-w-lg mx-auto">
            <button
                onClick={sendNotification}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Send Notification
            </button>
            <ul className="mt-4 space-y-2">
                {notifications.map((notification, index) => (
                    <li
                        key={index}
                        className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
                    >
                        {notification.msg} <span className="text-gray-500 text-sm">{new Date(notification.time).toLocaleString()}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationComponent;