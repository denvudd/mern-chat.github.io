import React from "react";
import ContactAvatar from "./ContactAvatar";
import { cn } from "@/utils/utils";

interface ContactProps {
  name: string;
  userId: string;
  selectContact: (userId: string) => void;
  online: boolean;
  selected: boolean;
}

const Contact: React.FC<ContactProps> = ({
  name,
  userId,
  selected,
  online,
  selectContact,
}) => {
  return (
    <li
      onClick={() => selectContact(userId)}
      className={cn(
        "transition-all p-2 flex items-center gap-2 cursor-pointer rounded-sm hover:bg-blue-50",
        {
          "bg-blue-200": selected,
        }
      )}
    >
      <div
        className={cn("w-1 h-12 bg-transparent rounded-md transition-colors", {
          "bg-blue-500": selected,
        })}
      />
      <ContactAvatar username={name} userId={userId} online={online} />
      <span className="text-gray-800 font-medium">{name}</span>
    </li>
  );
};

export default Contact;
