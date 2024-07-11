import  { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LoaderCircle } from 'lucide-react';
import { RootState } from '../../store';
import useListenMessages from '../../features/Messages/ListennewMessages';
import Message from './Message';

interface Message {
  id: string;
  body: string;
  createdAt: string;
}

const Messages = () => {
  const { messages, isLoading } = useSelector((state: RootState) => state.CurrentChatMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for the scrollable container
  useListenMessages(); // Assuming this hook is correctly implemented for listening to new messages

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // Watch for changes in the messages array

  return (
    <div className='px-4 flex-1 overflow-auto '>
      {!isLoading ? (
        <>
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </>
      ) : (
        <div className='flex justify-center items-center mt-10'>
          <LoaderCircle className='text-white w-10 h-10 animate-spin rotate-360 duration-500' />
        </div>
      )}
    </div>
  );
};

export default Messages;
