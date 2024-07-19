import React, { useEffect, useRef, useState } from 'react';
import { useSocketContext } from '../features/Socket/socket';
import peer from '../services/peer';
const VideoCall = () => {

  interface UserJoinedData {
    authUserName: string;
    socketId: string;
  }

  const { socket } = useSocketContext();
  const [remoteSocketd, setRemoteSocketId] = useState<string | null>(null);
  const [mystream, setMyStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleUserJoined = (data: UserJoinedData) => {
    localStorage.setItem("remoteSocketId", data.socketId);
    setRemoteSocketId(localStorage.getItem("remoteSocketId"));
  };

  const handleCallUser = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const offer = await peer.getOffer();
    socket?.emit("user:call",{to:localStorage.getItem("remoteSocketId"), offer});
    setMyStream(stream);
  };

  const handleIncomingCall=({to,offer}:any)=>{
console.log("incomingCall",to);
  }

  useEffect(() => {
    console.log("joined");
    socket?.on("user:joined", handleUserJoined);
    socket?.on("incomingCall",handleIncomingCall);
    // Cleanup function
    return () => {
      socket?.off("user:joined", handleUserJoined);
      socket?.off("incomingCall", handleIncomingCall);
    };
  }, [socket]);


  useEffect(() => {
    if (videoRef.current && mystream) {
      videoRef.current.srcObject = mystream;
    }
  }, [mystream]);

  return (


//     </div>
<div className="container mx-auto p-4">
<div className="bg-primary shadow-md rounded-lg overflow-hidden">
    <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-2">
            <div className="aspect-w-16 aspect-h-9 bg-gray-800 rounded-lg overflow-hidden">
                <video id="user1Video" style={{ transform: 'scaleX(-1)' }} ref={videoRef}
 autoPlay
  playsInline className="w-full h-full object-cover" ></video>
            </div>
            <div className="mt-2 text-center">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleCallUser}>Call</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">End Call</button>
            </div>
        </div>
        <div className="w-full md:w-1/2 p-2">
            <div className="aspect-w-16 aspect-h-9 bg-gray-800 rounded-lg overflow-hidden">
                <video id="user2Video" className="w-full h-full object-cover"></video>
            </div>
            <div className="mt-2 text-center flex flex-col gap-2 ">
              <span  className='font-bold text-white'> Conneted to : {remoteSocketd}</span>
               <div>
               <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Call</button>
               <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">End Call</button>
               </div>
            </div>
        </div>
    </div>
</div>
</div>
  );
};

export default VideoCall;
