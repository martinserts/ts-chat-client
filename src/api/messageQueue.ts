import { action, makeObservable, observable, runInAction, when } from 'mobx';
import { IncomingMessage } from './message';

const correlationId = 'correlationId';

export type OnMessageReceived = (message: IncomingMessage) => void;

export class MessageQueue {
  readonly onMessageReceived: OnMessageReceived;
  responses: Record<string, IncomingMessage> = {};

  constructor(onMessageReceived: OnMessageReceived) {
    this.onMessageReceived = onMessageReceived;
    makeObservable(this, {
      responses: observable,
      add: action.bound,
      waitForResponse: action.bound,
    });
  }

  add(message: string) {
    try {
      const json = JSON.parse(message);
      if (correlationId in json) this.responses[json[correlationId]] = json;
      else this.onMessageReceived(json);
    } catch {}
  }

  async waitForResponse(id: string): Promise<IncomingMessage> {
    await when(() => id in this.responses);
    const response = this.responses[id];
    runInAction(() => {
      delete this.responses[id];
    });
    return response;
  }
}
