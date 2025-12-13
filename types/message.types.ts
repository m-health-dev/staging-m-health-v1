export type Message = {
  id: string;

  message: string;

  sender: "user" | "bot";

  timestamp: string;

  replyTo?: {
    message?: string | null;
    sender?: string | null;
  };

  session_id?: string;
  urgent?: boolean;
};
