import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSocketContext } from '../Socket/socket';
import { addMessage } from './fetchMessages';
import notificationSound from '../../assets/sounds/notification.mp3';

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage:any) => {
      console.log('Received newMessage event:', newMessage);
      newMessage.shouldShake = true;
      const sound = new Audio(notificationSound);
      sound.play();
      dispatch(addMessage(newMessage));
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, dispatch]);

  return null;
};

export default useListenMessages;
