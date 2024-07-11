import { Send } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from "../../features/Messages/fetchMessages";
import { RootState } from '../../store';
import { LoaderCircle } from "lucide-react";

const MessageInput = () => {

    const isLoading = useSelector((state: RootState) => state.SidebarChats.isLoading);
    const sendMessageIsLoading = useSelector((state: RootState) => state.CurrentChatMessages.isLoadingSendMessage);
    const dispatch = useDispatch();
    const chats = useSelector((state: RootState) => state.SidebarChats.chats);
    const [message, setMessage] = useState('');
    const currentChatItem = localStorage.getItem("currentChat");
    const currentConversationId = currentChatItem ? JSON.parse(currentChatItem) : null;
    

    const handleSendMessage = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!message.trim()) {
            return; 
        }
        e.preventDefault();
        dispatch(sendMessage({ id: currentConversationId.id, message })).then(() => {
            // Optional: Perform any additional actions after sending message
            setMessage("");
            // You may want to update local state here if necessary
        });
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
                <button onClick={handleSendMessage}  className='absolute inset-y-0 end-0 flex items-center pe-3'>
             {
                sendMessageIsLoading == true ? <LoaderCircle className="text-white w-6 h-6 animate-spin rotate-360 duration-500" /> : <Send className='w-6 h-6 text-white' />
             }      
                </button>
            </div>
        </form>
    );
};

export default MessageInput;
