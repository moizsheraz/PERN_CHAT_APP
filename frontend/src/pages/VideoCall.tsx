import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSocketContext } from '../features/Socket/socket';
import peer from '../services/peer';

const VideoCall = () => {
    interface UserJoinedData {
        authUserName: string;
        socketId: string;
    }

    const { socket } = useSocketContext();
    const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
    const [remotestream, setRemoteStream] = useState<MediaStream | null>(null);
    const [myStream, setMyStream] = useState<MediaStream | null>(null);
    const myVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

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
        console.log("Till now working fine");
        const answer = await peer.getAnswer(offer);
        socket?.emit("call:accepted", { to: from, answer });
    };

    const sendStreams = useCallback(() => {
        if (myStream) {
            for (const track of myStream.getTracks()) {
                peer.peer.addTrack(track, myStream);
            }
        }
    }, [myStream]);

    const handleCallAccepted = async ({ from, answer }: any) => {
        console.log("Call Accepted from: ", from, answer);
        // await peer.setLocalDescription(answer);
        console.log("Call Accepted!");
        // sendStreams();
    };

    useEffect(() => {
        socket?.on("user:joined", handleUserJoined);
        socket?.on("incomingCall", handleIncomingCall);
        socket?.on("call:accepted", handleCallAccepted);

        return () => {
            socket?.off("user:joined", handleUserJoined);
            socket?.off("incomingCall", handleIncomingCall);
            socket?.off("call:accepted", handleCallAccepted);
        };
    }, [socket]);

    useEffect(() => {
        if (myVideoRef.current && myStream) {
            myVideoRef.current.srcObject = myStream;
        }
    }, [myStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remotestream) {
            remoteVideoRef.current.srcObject = remotestream;
        }
    }, [remotestream]);

    useEffect(() => {
        peer.peer.addEventListener("track", async (ev) => {
            const remoteStream = ev.streams;
            console.log("GOT TRACKS!!");
            setRemoteStream(remoteStream[0]);
        });
    }, []);

    return (
        <div className="container mx-auto p-4">
            <div className="bg-primary shadow-md rounded-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3 p-2">
                        <div className="aspect-w-16 aspect-h-9 bg-gray-800 rounded-lg overflow-hidden relative">
                            <video
                                id="myVideo"
                                style={{ transform: 'scaleX(-1)' }}
                                ref={myVideoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            ></video>
                            <span className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">You</span>
                        </div>
                        <div className="mt-2 text-center">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                                onClick={handleCallUser}
                            >
                                Call
                            </button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                                End Call
                            </button>
                        </div>
                    </div>
                    <div className="w-full md:w-2/3 p-2">
                        <div className="aspect-w-16 aspect-h-9 bg-gray-800 rounded-lg overflow-hidden relative">
                            <video
                                id="remoteVideo"
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            ></video>
                            <span className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">Other User</span>
                        </div>
                        <div className="mt-2 text-center flex flex-col gap-2">
                            <span className="font-bold text-white">Connected to: {remoteSocketId}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCall;
