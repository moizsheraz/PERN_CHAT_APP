import { createContext, useState, useEffect, useContext, ReactNode, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';


interface ISocketContext {
	socket: Socket | null;
	onlineUsers: string[];
}

const SocketContext = createContext<ISocketContext | undefined>(undefined);

export const useSocketContext = (): ISocketContext => {
	const context = useContext(SocketContext);
	if (context === undefined) {
		throw new Error("useSocketContext must be used within a SocketContextProvider");
	}
	return context;
};

const socketURL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

const SocketContextProvider = ({ children }: { children: ReactNode }) => {
	const authUser = useSelector((state: RootState) => state.user.userInfo);
const isLoading = useSelector((state: RootState) => state.user.loading);
	const socketRef = useRef<Socket | null>(null);

	const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

	useEffect(() => {
		if (authUser && !isLoading) {
			const socket = io(socketURL, {
				query: {
					userId: authUser.id,
				},
			});
			socketRef.current = socket;

			socket.on("getOnlineUsers", (users: string[]) => {
				setOnlineUsers(users);
			});

			return () => {
				socket.close();
				socketRef.current = null;
			};
		} else if (!authUser && !isLoading) {
			if (socketRef.current) {
				socketRef.current.close();
				socketRef.current = null;
			}
		}
	}, [authUser, isLoading]);

	return (
		<SocketContext.Provider value={{ socket: socketRef.current, onlineUsers }}>
        {children}
        </SocketContext.Provider>
	);
};

export default SocketContextProvider;