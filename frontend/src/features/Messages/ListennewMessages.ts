import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addMessage } from '../Messages/fetchMessages'; // Adjust the import path as needed
import { useSocketContext } from '../../features/Socket/socket';
// import notificationSound from '../assets/sounds/notification.mp3';

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleNewMessage = (newMessage: any) => {
      newMessage.shouldShake = true;
    //   const sound = new Audio(notificationSound);
    //   sound.play();
      dispatch(addMessage(newMessage));
    };

    socket?.on('newMessage', handleNewMessage);

    return () => {
      socket?.off('newMessage', handleNewMessage);
    };
  }, [socket, dispatch]);
};

export default useListenMessages;
