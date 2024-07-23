import React, { useEffect, useState, useCallback } from 'react';
import { useSocketContext } from '../features/Socket/socket';
import peer from '../services/peer';
import ReactPlayer from "react-player";

const VideoCall = () => {
    interface UserJoinedData {
        authUserName: string;
        socketId: string;
    }

    const { socket } = useSocketContext();
    const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
    const [remotestream, setRemoteStream] = useState<MediaStream | null>(null);
    const [myStream, setMyStream] = useState<MediaStream | null>(null);

    const handleUserJoined = (data: UserJoinedData) => {
        localStorage.setItem("remoteSocketId", data.socketId);
        setRemoteSocketId(localStorage.getItem("remoteSocketId"));
    };

    const handleCallUser = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const offer = await peer.getOffer();
        socket?.emit("user:call", { to: localStorage.getItem("remoteSocketId"), offer });
        setMyStream(stream);
    };

    const handleIncomingCall = async ({ from, offer }: any) => {
        setRemoteSocketId(from);
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setMyStream(stream);
        const answer = await peer.getAnswer(offer);
        socket?.emit("call:accepted", { to: from, answer });
    };

    const sendStreams = useCallback(() => {
        if (myStream) {
            const senders = peer.peer.getSenders();
            const trackIds = senders.map(sender => sender.track?.id);

            for (const track of myStream.getTracks()) {
                if (!trackIds.includes(track.id)) {
                    peer.peer.addTrack(track, myStream);
                }
            }
        }
    }, [myStream]);

    const handleCallAccepted = async ({ from, answer }: any) => {
        await peer.setLocalDescription(answer);
        sendStreams();
    };

    const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket?.emit("peer:nego:needed", { offer, to: remoteSocketId });
    }, [remoteSocketId, socket]);

    useEffect(() => {
        peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
        return () => {
            peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
        };
    }, [handleNegoNeeded]);

    useEffect(() => {
        socket?.on("user:joined", handleUserJoined);
        socket?.on("incomingCall", handleIncomingCall);
        socket?.on("call:accepted", handleCallAccepted);
        socket?.on("peer:nego:needed", handleNegoNeedIncomming);
        socket?.on("peer:nego:final", handleNegoNeedFinal);

        return () => {
            socket?.off("user:joined", handleUserJoined);
            socket?.off("incomingCall", handleIncomingCall);
            socket?.off("call:accepted", handleCallAccepted);
            socket?.off("peer:nego:needed", handleNegoNeedIncomming);
            socket?.off("peer:nego:final", handleNegoNeedFinal);
        };
    }, [socket]);

    const handleNegoNeedIncomming = useCallback(
        async ({ from, offer }: any) => {
            const ans = await peer.getAnswer(offer);
            socket?.emit("peer:nego:done", { to: from, ans });
        },
        [socket]
    );

    const handleNegoNeedFinal = useCallback(async ({ ans }: any) => {
        await peer.setLocalDescription(ans);
    }, []);

    useEffect(() => {
        peer.peer.addEventListener("track", async (ev) => {
            const remoteStream = ev.streams;
            setRemoteStream(remoteStream[0]);
        });
    }, []);

    return (
        <div className="flex flex-col items-center w-[90vw] max-w-screen-lg p-4 bg-primary min-h-screen mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">Video Chat</h1>
        <h4 className="text-xl text-white mb-4">
            {remoteSocketId ? "Connected" : "No one in Call"}
        </h4>
        <div className="flex gap-4 mb-4">
            {myStream && (
                <button
                    onClick={sendStreams}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Send Stream
                </button>
            )}
            {remoteSocketId && (
                <button
                    onClick={handleCallUser}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Call
                </button>
            )}
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full">
            {myStream && (
                <div className="flex flex-col items-center w-full md:w-1/2">
                    <h1 className="text-xl font-semibold text-white mb-2">You</h1>
                    <ReactPlayer
                        style={{ transform: 'scaleX(-1)' }}
                        playing
                        muted
                        height="320px"
                        width="100%"
                        url={myStream}
                        className="border-8 border-blue-500 rounded"
                    />
                </div>
            )}
            {remotestream && (
                <div className="flex flex-col items-center w-full md:w-1/2">
                    <h1 className="text-xl font-semibold text-white mb-2">Remote Stream</h1>
                    <ReactPlayer
                        style={{ transform: 'scaleX(-1)' }}
                        playing
                        muted
                        height="320px"
                        width="100%"
                        url={remotestream}
                        className="border-8 border-red-500 rounded"
                    />
                </div>
            )}
        </div>
    </div>
    
    );
};

export default VideoCall;
