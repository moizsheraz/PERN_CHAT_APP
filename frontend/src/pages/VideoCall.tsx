import React, { useEffect } from 'react';
import { useSocketContext } from '../features/Socket/socket';

const VideoCall = () => {
  const { socket } = useSocketContext();

  const handleUserJoined = (authUserName: string, id: string) => {
    console.log(`${authUserName} joined the call with id: ${id}`);
  };

  useEffect(() => {
    console.log("joined");
    socket?.on("user:joined", handleUserJoined);

    // Cleanup function
    return () => {
      socket?.off("user:joined", ()=>{
        console.log("working")
      });
    };
  }, [socket]);

  console.log("successfully");

  return (
    <div>
    
    </div>
  );
};

export default VideoCall;
