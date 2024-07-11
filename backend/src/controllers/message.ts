import { Request, Response } from "express";
import db from "../db/prisma.js";
import { io } from "../socket/socket.js";
import { getReceiverSocketId } from "../socket/socket.js";

export const sendMessage = async (req: Request, res: Response) => {

    try{
		
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;

        let chat = await db.chat.findFirst({
			where: {
				participantIds: {
					hasEvery: [senderId, receiverId],
				},
			},
		});


    //    if chat does not exist, create a new chat with the sender and receiver
		if (!chat) {
			chat = await db.chat.create({
				data: {
					participantIds: {
						set: [senderId, receiverId],
					},
				},
			});
		}

        const newMessage = await db.message.create({
			data: {
				senderId,
				body: message,
				chatId: chat.id,
				
			}
		});

        if (newMessage) {
			chat = await db.chat.update({
				where: {
					id: chat.id,
				},
				data: {
					messages: {
						connect: {
							id: newMessage.id,
						},
					},
				},
			});
		}

		// real time message update
		const receiversocketId = getReceiverSocketId(receiverId);
		if(receiverId){
			io.to(receiversocketId).emit("newMessage",newMessage);
		}
		res.status(201).json(newMessage);

    } catch(error:any){
		console.error("Error in sendMessage: ", error.message);
    }
}

export const getMessages = async (req: Request, res: Response) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user.id;

		const chat = await db.chat.findFirst({
			where: {
				participantIds: {
					hasEvery: [senderId, userToChatId],
				},
			},
			include: {
				messages: {
					orderBy: {
						createdAt: "asc",
					},
				},
			},
		});

		if (!chat) {
			return res.status(200).json([]);
		}

		res.status(200).json(chat.messages);
	} catch (error: any) {
		console.error("Error in getMessages: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
}

export const getUsersForSidebar = async (req: Request, res: Response) => {
	try {
		const authUserId = req.user.id;

		const users = await db.user.findMany({
			where: {
				id: {
					not: authUserId, // actually I am getting all the users in my database
				},
			},
			select: {
				id: true,
				fullName: true,
				profilePic: true,
			},
		});

		res.status(200).json(users);
	} catch (error: any) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};