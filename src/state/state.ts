import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { ChatClient } from '../api/chatClient';
import { IncomingMessage } from '../api/message';
import { ConnectionState } from './connectionState';

export type StoredMessage = IncomingMessage & { date: string; id: number };

export class State {
  connectionState: ConnectionState = ConnectionState.Disconnected;
  readonly chatClient: ChatClient;
  lastMessageId: number = 0;
  messages: StoredMessage[] = [];
  nickname?: string;
  info?: string;

  constructor(url: string, reconnectTimeout: number) {
    makeObservable(this, {
      connectionState: observable,
      messages: observable,
      nickname: observable,
      info: observable,
      chatting: computed,
      resetState: action.bound,
      onConnectionStateChanged: action.bound,
      onMessageReceived: action.bound,
      setNickname: action.bound,
      sendTell: action.bound,
      disconnect: action.bound,
      clearInfo: action.bound,
    });

    this.chatClient = new ChatClient(url, reconnectTimeout, this.onConnectionStateChanged, this.onMessageReceived);
    this.chatClient.connect();
  }

  get chatting() {
    return this.connectionState === ConnectionState.Connected && this.nickname;
  }

  resetState() {
    const lastMessage = this.messages.pop();
    if (lastMessage) {
      if (lastMessage.command === 'ConnectionClosed' && lastMessage.nickname === this.nickname)
        this.info = 'Disconnected by the server due to inactivity';
      else if (lastMessage.command === 'Shutdown') this.info = 'The server was shut down';
    }

    this.messages = [];
    this.nickname = undefined;
  }

  onConnectionStateChanged(state: ConnectionState) {
    this.connectionState = state;
    if (state === ConnectionState.Disconnected) this.resetState();
  }

  onMessageReceived(message: IncomingMessage) {
    this.messages.push({ ...message, date: new Date().toLocaleTimeString(), id: ++this.lastMessageId });
  }

  async setNickname(nickname: string): Promise<string | undefined> {
    if (this.nickname) return undefined;

    const error = await this.chatClient.setNickname(nickname);
    if (error) return error.reason ?? 'Failed to set the nickname';

    runInAction(() => {
      this.nickname = nickname;
    });
    return undefined;
  }

  async sendTell(message: string): Promise<string | undefined> {
    const error = await this.chatClient.sendTell(message);
    return error?.reason;
  }

  disconnect(): void {
    this.chatClient.disconnect();
  }

  clearInfo(): void {
    this.info = undefined;
  }
}
