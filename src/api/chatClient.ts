import { ConnectionState } from '../state/connectionState';
import { MessageQueue, OnMessageReceived } from './messageQueue';

export interface ErrorResponse {
  errorCode: string;
  reason?: string;
}

export type OnConnectionStateChanged = (state: ConnectionState) => void;

export class ChatClient {
  url: string;
  reconnectTimeout: number;
  onConnectionStateChanged: OnConnectionStateChanged;
  onMessageReceived: OnMessageReceived;
  connectionState: ConnectionState = ConnectionState.Disconnected;
  webSocket?: WebSocket;
  correlationId: number = 0;
  messageQueue: MessageQueue;

  constructor(
    url: string,
    reconnectTimeout: number,
    onConnectionStateChanged: OnConnectionStateChanged,
    onMessageReceived: OnMessageReceived,
  ) {
    this.url = url;
    this.reconnectTimeout = reconnectTimeout;
    this.onConnectionStateChanged = onConnectionStateChanged;
    this.onMessageReceived = onMessageReceived;

    this.messageQueue = new MessageQueue(onMessageReceived);
  }

  connect = () => {
    this.setConnectionState(ConnectionState.Connecting);

    this.webSocket = new WebSocket(this.url);
    this.webSocket.onopen = () => {
      this.setConnectionState(ConnectionState.Connected);
    };
    this.webSocket.onclose = () => {
      this.setConnectionState(ConnectionState.Disconnected);
      setTimeout(() => this.connect(), this.reconnectTimeout);
    };
    this.webSocket.onmessage = (message: MessageEvent<string>) => {
      this.messageQueue.add(message.data);
    };
  };

  disconnect = () => {
    this.webSocket?.close();
  };

  setNickname = (nickname: string): Promise<ErrorResponse | undefined> =>
    this.sendMessageWaitForResponse({ command: 'NICKNAME', nickname });

  sendTell = (message: string): Promise<ErrorResponse | undefined> =>
    this.sendMessageWaitForResponse({ command: 'TELL', message });

  private setConnectionState = (connectionState: ConnectionState) => {
    this.connectionState = connectionState;
    this.onConnectionStateChanged(connectionState);
  };

  private generateCorrelationId = () => {
    this.correlationId++;
    return this.correlationId.toString();
  };

  private sendMessageWaitForResponse = async (message: object): Promise<ErrorResponse | undefined> => {
    const correlationId = this.sendMessage(message);
    return await this.waitForResponse(correlationId);
  };

  private sendMessage = (message: object): string => {
    const correlationId = this.generateCorrelationId();
    const data = JSON.stringify({ ...message, correlationId });
    this.webSocket?.send(data);
    return correlationId;
  };

  private waitForResponse = async (id: string): Promise<ErrorResponse | undefined> => {
    const json = await this.messageQueue.waitForResponse(id);
    if (this.isError(json)) return json;
    else return undefined;
  };

  private isError = (json: object): json is ErrorResponse => {
    return (json as ErrorResponse).errorCode !== undefined;
  };
}
