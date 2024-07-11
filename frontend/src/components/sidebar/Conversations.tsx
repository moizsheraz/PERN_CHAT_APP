import { getChats } from "../../features/Chats/fetchchats";
import Conversation from "./Conversation";
import { useEffect } from "react";
import {useDispatch,useSelector} from "react-redux"
import { RootState } from '../../store';

const Conversations = () => {
	const dispatch = useDispatch();
	const { chats} = useSelector((state: RootState) => state.SidebarChats);
	// const {i } = useSelector((state: RootState) => state.SidebarChats.chats);
	
useEffect(() => {
dispatch(getChats())
}, [])

	return (
		<div className='py-2 flex flex-col overflow-auto'>
			{chats.map((chat) => (
				<div className="wrapper" onClick={()=>{
					localStorage.setItem("currentChat",JSON.stringify({
						id : chat.id,
						name : chat.fullName
					}))
				}}>
					<Conversation key={chat.id} conversation={chat} />
				</div>
			))}
		</div>
	);
};
export default Conversations;
