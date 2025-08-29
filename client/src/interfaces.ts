export interface User {
  _id: string,
  email: string,
  fullName: string,
  profilePic: string,
  bio: string,
};

export interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    text?: string;
    image?: string;
    seen: boolean;
    createdAt: string;
}