import { DUMMY_MESSAGES } from "../../dummy_data/dummy";
import Message from "./Message";
import  {useSelector}  from "react-redux";
import { LoaderCircle } from 'lucide-react';
import { RootState } from '../../store';
 interface Message {
    id: string;
    body:string
    createdAt: string; 
}

interface MessagesProps {
	messages: Message[];
}
const Messages = () => {
	const { messages,isLoading } = useSelector((state: RootState) => state.CurrentChatMessages);

	return (
		<div className='px-4  flex-1 overflow-auto'>
		{!isLoading ? messages.map((message) => (
				<Message key={message.id} message={message} />
			)) :<div className="flex justify-center items-center mt-10">
			<LoaderCircle className="text-white w-10 h-10 animate-spin rotate-360 duration-500" />
		  </div>}
		
		</div>
	);
};
export default Messages;
