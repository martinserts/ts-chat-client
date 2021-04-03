export type IncomingMessage =
  | AcceptedMessage
  | ConnectionClosedMessage
  | TellMessage
  | ShutdownMessage
  | UserJoinedMessage;

export interface AcceptedMessage {
  command: 'Accepted';
  correlationId: string;
}

export interface ConnectionClosedMessage {
  command: 'ConnectionClosed';
  nickname: string;
  reason: string;
}

export interface TellMessage {
  command: 'Tell';
  nickname: string;
  message: string;
}

export interface ShutdownMessage {
  command: 'Shutdown';
  reason: string;
}

export interface UserJoinedMessage {
  command: 'Join';
  nickname: string;
}
