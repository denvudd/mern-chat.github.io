import { cn } from "@/utils/utils";
import React from "react";

interface AvatarProps {
  userId: string;
  username: string;
  online: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ userId, username, online }) => {
  const backgrounds = [
    "bg-red-200",
    "bg-green-200",
    "bg-purple-200",
    "bg-blue-200",
    "bg-yellow-200",
    "bg-teal-200",
  ];

  const userIdBase10 = parseInt(userId, 16);
  const colorIndex = userIdBase10 % backgrounds.length;
  const color = backgrounds[colorIndex];

  return (
    <div
      className={cn(
        "w-9 h-9 relative bg-red-200 rounded-full flex items-center",
        {
          [color]: true,
        }
      )}
    >
      <span className="text-center font-medium w-full uppercase opacity-70">
        {username[0]}
      </span>
      <div
        className={cn(
          "absolute w-3.5 h-3.5 border border-white rounded-full -bottom-0.5 -right-0.5",
          { "bg-green-500": online, "bg-gray-500": !online }
        )}
      />
    </div>
  );
};

export default Avatar;
