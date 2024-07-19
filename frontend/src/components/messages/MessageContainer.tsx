import { useState, useEffect } from 'react';
import { MessageCircle, Phone, VideoIcon } from "lucide-react";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { UserCircle2Icon } from "lucide-react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useSocketContext } from "../../features/Socket/socket";
import videocallsound from '../../assets/sounds/videocall.mp3';
import { v4 as uuidv4 } from 'uuid';
import { Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface IncomingCallData {
    from: string;
    message: string;
    roomId: string; // Added roomId to the interface
}

interface ConversationId {
    id?: string;
    name?: string;
}

const MessageContainer = () => {
    const navigate = useNavigate();
    const { socket } = useSocketContext();
    const [incomingCall, setIncomingCall] = useState<IncomingCallData | null>(null);
    const [showIncomingCall, setShowIncomingCall] = useState(false);
    const { isSelected } = useSelector((state: RootState) => state.CurrentChatMessages);
    const authUserName = useSelector((state: RootState) => state.user.userInfo?.fullName);

    useEffect(() => {
        if (!socket) return;

        const handleVideoCallReq = (data: IncomingCallData) => {
            setIncomingCall(data);
            setShowIncomingCall(true);
            const sound = new Audio(videocallsound);
            sound.play();
            setTimeout(() => {
                setShowIncomingCall(false);
                setIncomingCall(null);
            }, 10000);
        };

        const handleRoomJoin = (data: { authUserName: string; roomId: string }) => {
            navigate(`/VideoCalling/${data.roomId}`);
        };

        socket.on("videocall:req", handleVideoCallReq);
        socket.on("room:join", handleRoomJoin);

        return () => {
            socket.off("videocall:req", handleVideoCallReq);
            socket.off("room:join", handleRoomJoin);
        };
    }, [socket]);

    const handleVideoCallReq = () => {
        const currentConversationId: ConversationId = JSON.parse(localStorage.getItem("currentChat") || '{}');

        if (currentConversationId.id) {
            const roomId = uuidv4();
            socket?.emit('videocall:req', {
                to: currentConversationId.id,
                from: authUserName,
                message: 'Video call request',
                roomId: roomId // Include roomId in the event
            });

            socket?.emit("room:join", { authUserName, roomId });
        }
    };

    const handleCallPick = () => {
        if (incomingCall) {
            const roomId = incomingCall.roomId; 
            socket?.emit("room:join", { authUserName, roomId });
            navigate(`/VideoCalling/${roomId}`);
        }
    };

    if (!isSelected) {
        return <NoChatSelected authUserName={authUserName} />;
    }

    const currentConversationId: ConversationId = JSON.parse(localStorage.getItem("currentChat") || '{}');

    if (!currentConversationId.id) {
        currentConversationId.name = "No Chat Selected";
    }

    return (
        <div className='w-full flex flex-col'>
            {/* Header */}
            <div className='bg-slate-500 px-4 flex items-center justify-between py-2 mb-2'>
                <span>
                    <span className='text-black'>To:</span>
                    <span className='text-gray-900 font-bold'>{currentConversationId.name}</span>
                </span>
                <span className="flex gap-4">
                    <span onClick={handleVideoCallReq} className="cursor-pointer" data-tooltip-id="video-call">
                        <Video className="w-8 h-8" />
                    </span>
                    <span className="cursor-pointer" data-tooltip-id="current-user">
                        <UserCircle2Icon className="w-8 h-8" />
                    </span>
                </span>
            </div>
            {showIncomingCall && incomingCall && (
                <div className="bg-gray-600 flex justify-between text-white p-2 m-2 rounded-md">
                    <span className='flex items-center gap-2'>
                        Incoming <VideoIcon className='w-6 h-6' />
                        call from <span className='font-bold'>{incomingCall.from}</span>
                    </span>
                    <button onClick={handleCallPick} className='bg-green-500 p-2 rounded-xl'><Phone /></button>
                </div>
            )}
            <Messages />
            <MessageInput />
            <ReactTooltip
                id="current-user"
                place="bottom"
                content={authUserName}
            />
            <ReactTooltip
                id="video-call"
                place="bottom"
                content={"Video Call"}
            />
        </div>
    );
};

const NoChatSelected = ({ authUserName }: { authUserName: string | undefined }) => {
    return (
        <div className='flex items-center justify-center w-full h-full'>
            <div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
                <p>Welcome 👋 {authUserName ? authUserName : ''} ❄</p>
                <p>Select a chat to start messaging</p>
                <MessageCircle className='text-3xl md:text-6xl text-center' />
            </div>
        </div>
    );
};

export default MessageContainer;
