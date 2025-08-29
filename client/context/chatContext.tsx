import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";
import type { AxiosInstance } from "axios";
import type { Socket } from "socket.io-client";
import type { User, Message } from "../src/interfaces";

// Unseen messages structure: { userId -> number of unseen messages }
export type UnseenMessages = Record<string, number>;

// Payload when sending a message
export type SendMessagePayload = {
    text?: string;
    image?: string;
};

export interface ChatContextType {
    messages: Message[];
    users: User[];
    selectedUser: User | null;
    getUsers: () => Promise<void>;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    sendMessage: (messageData: SendMessagePayload) => Promise<void>;
    getMessages: (userId: string) => Promise<void>;
    setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
    unseenMessages: UnseenMessages;
    setUnseenMessages: React.Dispatch<React.SetStateAction<UnseenMessages>>;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
    const context = useContext(ChatContext);
    if(context === undefined) {
        throw new Error("useChat must be used within an ChatProvider");
    }
    return context;
}

interface ChatProviderProps {
    children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [unseenMessages, setUnseenMessages] = useState<UnseenMessages>({});

    const { socket, axios } = useAuth() as {
        socket: Socket | null;
        axios: AxiosInstance
    };

    // Get all users for sidebar
    const getUsers = async () => {
        try {
            const { data } = await axios.get<{ success: boolean; users: User[]; unseenMessages: UnseenMessages }>("/api/messages/users");
            if (data.success) {
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    // Get messages for selected user
    const getMessages = async (userId: string) => {
        try {
            const { data } = await axios.get<{ success: boolean; messages: Message[] }>(`/api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    // Send message
    const sendMessage = async (messageData: SendMessagePayload) => {
        try {
            if (!selectedUser) return;
            const { data } = await axios.post<{ success: boolean; newMessage: Message }>(
                `/api/messages/send/${selectedUser._id}`,
                messageData
            );
            if (data.success) {
                setMessages(prev => [...prev, data.newMessage]);
            } else {
                toast.error("Failed to send message");
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    // Subscribe to socket events
    const subscribeToMessages = () => {
        if (!socket) return;
        socket.on("newMessage", (newMessage: Message) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setMessages(prev => [...prev, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            } else {
                setUnseenMessages(prev => ({
                    ...prev,
                    [newMessage.senderId]: prev[newMessage.senderId] ? prev[newMessage.senderId] + 1 : 1,
                }));
            }
        });
    };

    const unsubscribeFromMessages = () => {
        if (socket) socket.off("newMessage");
    };

    useEffect(() => {
        subscribeToMessages();
        return () => {
            unsubscribeFromMessages();
        };
    }, [socket, selectedUser]);

    const value: ChatContextType = {
        messages,
        users,
        selectedUser,
        getUsers,
        setMessages,
        getMessages,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};