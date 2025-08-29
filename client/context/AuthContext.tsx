import { createContext, useEffect, useState, useContext } from "react";
import type { ReactNode, FC } from "react";
import axios from "axios";
import type { AxiosInstance } from "axios";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";
import type { User } from "../src/interfaces";

interface UpdateProfilePayload {
    fullName: string | undefined;
    bio: string | undefined;
    profilePic?: string | undefined;
}

// Define the shape of the value provided by the context
interface AuthContextType {
    axios: AxiosInstance;
    authUser: User | null;
    onlineUsers: string[];
    socket: Socket | null;
    login: (state: 'login' | 'signup', credentials: Record<string, any>) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (body: UpdateProfilePayload) => Promise<void>; // Use FormData for file uploads
}

// Define the props for the AuthProvider component
interface AuthProviderProps {
    children: ReactNode;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};


export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);

    // Check if user is authenticated
    const checkAuth = async () => {
        try {
            const { data } = await axios.get<{ success: boolean; user: User }>("/api/auth/check");
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    // Login function
    const login = async (state: 'login' | 'signup', credentials: Record<string, any>) => {
        try {
            const { data } = await axios.post<{ success: boolean; userData: User; token: string; message: string; }>(`/api/auth/${state}`, credentials);
            
            if (data.success) {
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    // Logout function
    const logout = async () => {
        if (socket) {
            socket.disconnect();
        }
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        delete axios.defaults.headers.common["token"]; // Use delete for cleaner removal
        toast.success("Logged out Successfully");
    };

    // Update profile function
    const updateProfile = async (body: UpdateProfilePayload) => {
        try {
            const { data } = await axios.put<{ success: boolean; user: User, message: string }>("/api/auth/update-profile", body);
            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile Updated Successfully");
            }
            else {
                toast.error(data.message);
                // console.log(data);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    // Connect socket function
    const connectSocket = (userData: User) => {
        if (!userData || socket?.connected) return;
        
        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            }
        });
        // No need for newSocket.connect(), it connects automatically
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds: string[]) => {
            setOnlineUsers(userIds);
        });
    };

    // This effect now correctly depends on `token`
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["token"] = token;
            checkAuth(); // Check auth whenever the token is present on load
        }
    }, [token]);

    // This effect handles socket disconnection on component unmount
    useEffect(() => {
        return () => {
            socket?.disconnect();
        };
    }, [socket]);

    const value: AuthContextType = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};