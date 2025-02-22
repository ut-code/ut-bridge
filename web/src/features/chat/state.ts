import type { Message } from "server/routes/chat";

export type Handlers = {
  // retval: prevent default if true
  onCreate: ((data: Message) => boolean) | undefined;
  onUpdate: ((id: string, data: { content: string }) => void) | undefined;
  onDelete: ((id: string) => void) | undefined;
};

export const handlers: Handlers = {
  onCreate: undefined,
  onUpdate: undefined,
  onDelete: undefined,
};
