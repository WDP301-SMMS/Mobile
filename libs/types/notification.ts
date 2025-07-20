export interface Notification {
  _id: string;
  recipientId: Recipient;
  type: string;
  isRead: boolean;
  entityId: string;
  entityModel: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Recipient {
  _id: string;
  username: string;
  email: string;
}
