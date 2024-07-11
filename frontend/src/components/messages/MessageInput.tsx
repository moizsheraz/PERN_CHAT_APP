import { Send } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from "../../features/Messages/SendMessage";
import { RootState } from '../../store';

const MessageInput = () => {
    const isLoading = useSelector((state: RootState) => state.SidebarChats.isLoading);
    const dispatch = useDispatch();
    const chats = useSelector((state: RootState) => state.SidebarChats.chats);
    const [message, setMessage] = useState('');
    const currentConversationId = JSON.parse(localStorage.getItem("currentChat"));

    const handleSendMessage = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        dispatch(sendMessage({ id: currentConversationId.id, message })); // Fix the payload structure here
        setMessage(""); 
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <form className='px-4 mb-3'>
            <div className='w-full relative'>
                <input
                    type='text'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white'
                    placeholder='Send a message'
                />
                <button onClick={handleSendMessage} className='absolute inset-y-0 end-0 flex items-center pe-3'>
                    <Send className='w-6 h-6 text-white' />
                </button>
            </div>
        </form>
    );
};

export default MessageInput;
