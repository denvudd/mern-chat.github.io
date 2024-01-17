export interface PeopleConnection {
  userId: string;
  username: string;
}

export interface UniquePeopleConnection {
  [key: string]: string;
}

export interface Message {
  text: string;
  recipient: string;
  sender: string;
  _id: number;
  file?: string | null;
  createdAt?: Date | number;
  updatedAt?: Date;
}
