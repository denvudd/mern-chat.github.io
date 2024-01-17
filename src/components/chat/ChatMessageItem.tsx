import React from "react";

import axios from "@/lib/axios";
import { format } from "date-fns";
import { cn } from "@/utils/utils";
import { Paperclip } from "lucide-react";

interface ChatMessageItemProps {
  sender: string;
  userId: string;
  text: string;
  file?: string | null;
  createdAt: Date | number | undefined;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  sender,
  userId,
  text,
  file,
  createdAt,
}) => {
  console.log(createdAt);
  return (
    <li
      className={cn("relative", {
        "text-right mr-2": sender === userId,
        "text-left ml-2": sender !== userId,
      })}
    >
      <div
        className={cn("inline-flex pt-1.5 pb-2 px-2 rounded-xl text-sm ", {
          "bg-blue-500 text-white rounded-ee-none": sender === userId,
          "bg-white text-gray-500 rounded-es-none": sender !== userId,
        })}
      >
        <span className="min-w-0 max-w-xs break-words hyphens-auto whitespace-pre-wrap m-0 block">
          {text}
          {file && (
            <a
              className="underline flex items-center gap-1"
              href={axios.defaults.baseURL + `/uploads/${file}`}
              target="_blank"
            >
              <Paperclip className="w-4 h-4" />
              {file}
            </a>
          )}
          <span className="relative text-xs float-right top-1.5 ml-1.5 mr-0.5 opacity-50">
            {format(createdAt ? createdAt : Date.now(), "hh:mm")}
          </span>
        </span>
      </div>
      {sender === userId ? (
        <svg
          width="9"
          height="20"
          className="absolute -right-[8px] -bottom-[3px] fill-blue-500"
        >
          <defs>
            <filter
              x="-50%"
              y="-14.7%"
              width="200%"
              height="141.2%"
              filterUnits="objectBoundingBox"
            >
              <feOffset dy="1"></feOffset>
              <feGaussianBlur stdDeviation="1"></feGaussianBlur>
              <feColorMatrix
                values="0 0 0 0 0.0621962482 0 0 0 0 0.138574144 0 0 0 0 0.185037364 0 0 0 0.15 0"
                in="shadowBlurOuter1"
              ></feColorMatrix>
            </filter>
          </defs>
          <g>
            <path d="M6 17H0V0c.193 2.84.876 5.767 2.05 8.782.904 2.325 2.446 4.485 4.625 6.48A1 1 0 016 17z"></path>
            <path d="M6 17H0V0c.193 2.84.876 5.767 2.05 8.782.904 2.325 2.446 4.485 4.625 6.48A1 1 0 016 17z"></path>
          </g>
        </svg>
      ) : (
        <svg
          width="9"
          height="20"
          className="absolute -left-[8px] -bottom-[3px] fill-white"
        >
          <defs>
            <filter
              x="-50%"
              y="-14.7%"
              width="200%"
              height="141.2%"
              filterUnits="objectBoundingBox"
            >
              <feOffset dy="1"></feOffset>
              <feGaussianBlur stdDeviation="1"></feGaussianBlur>
              <feColorMatrix values="0 0 0 0 0.0621962482 0 0 0 0 0.138574144 0 0 0 0 0.185037364 0 0 0 0.15 0"></feColorMatrix>
            </filter>
          </defs>
          <g>
            <path d="M3 17h6V0c-.193 2.84-.876 5.767-2.05 8.782-.904 2.325-2.446 4.485-4.625 6.48A1 1 0 003 17z"></path>
            <path d="M3 17h6V0c-.193 2.84-.876 5.767-2.05 8.782-.904 2.325-2.446 4.485-4.625 6.48A1 1 0 003 17z"></path>
          </g>
        </svg>
      )}
    </li>
  );
};

export default ChatMessageItem;
