export interface AvailableUser {
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface User {
  _id: string;
  username: string;
  gender: string;
  email: string;
  role: string;
  dob: string;
  phone: string;
  isActive: boolean;
}

interface LastMessage {
  type: string;
  content: string;
  createdAt: string;
}

export interface MessageRoom {
  roomId: string;
  senderId: User;
  receiverId: User;
  lastMessage: LastMessage;
  participants: User[];
}

export interface Message {
  _id?: string;
  roomId: string;
  senderId: User;
  receiverId: User;
  type: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
