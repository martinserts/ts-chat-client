import { mocked } from 'ts-jest/utils';
import { ConnectionState } from '../state/connectionState';
import { ChatClient } from './chatClient';
import { IncomingMessage } from './message';
import { MessageQueue } from './messageQueue';

jest.mock('./messageQueue');

describe('ChatClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    chatClient = new ChatClient(url, reconnectTimeout, onConnectionStateChanged, onMessageReceived);
  });

  const url = 'URL';
  const reconnectTimeout = 5000;
  const onConnectionStateChanged = jest.fn();
  const onMessageReceived = jest.fn();
  let chatClient: ChatClient;

  describe('connect', () => {
    it('should set up webSocket connection', () => {
      expect(chatClient.connectionState).toBe(ConnectionState.Disconnected);

      const webSocketMock = { onopen: jest.fn(), onclose: jest.fn(), onmessage: jest.fn() };
      const webSocket = (webSocketMock as unknown) as WebSocket;
      jest.spyOn(global, 'WebSocket').mockImplementation(() => webSocket);

      chatClient.connect();

      expect(chatClient.connectionState).toBe(ConnectionState.Connecting);
      expect(onConnectionStateChanged).toBeCalledWith(ConnectionState.Connecting);

      onConnectionStateChanged.mockClear();
      webSocketMock.onopen();

      expect(chatClient.connectionState).toBe(ConnectionState.Connected);
      expect(onConnectionStateChanged).toBeCalledWith(ConnectionState.Connected);

      onConnectionStateChanged.mockClear();
      webSocketMock.onclose();

      expect(chatClient.connectionState).toBe(ConnectionState.Disconnected);
      expect(onConnectionStateChanged).toBeCalledWith(ConnectionState.Disconnected);

      // Does a reconnect after a timeout
      onConnectionStateChanged.mockClear();
      jest.advanceTimersByTime(reconnectTimeout);

      expect(chatClient.connectionState).toBe(ConnectionState.Connecting);
      expect(onConnectionStateChanged).toBeCalledWith(ConnectionState.Connecting);
    });
  });

  describe('disconnect', () => {
    it('should close the webSocket', () => {
      const webSocketMock = { onopen: jest.fn(), onclose: jest.fn(), onmessage: jest.fn(), close: jest.fn() };
      const webSocket = (webSocketMock as unknown) as WebSocket;
      jest.spyOn(global, 'WebSocket').mockImplementation(() => webSocket);

      chatClient.connect();

      expect(webSocketMock.close).not.toBeCalled();

      chatClient.disconnect();

      expect(webSocketMock.close).toBeCalled();
    });
  });

  describe('setNickname', () => {
    it('should send a set nickname command and wait for the response', async () => {
      const webSocketMock = { onopen: jest.fn(), onclose: jest.fn(), onmessage: jest.fn(), send: jest.fn() };
      const webSocket = (webSocketMock as unknown) as WebSocket;
      jest.spyOn(global, 'WebSocket').mockImplementation(() => webSocket);

      const mockedMessageQueue = mocked(MessageQueue, true);
      const incomingMessage = ({} as unknown) as IncomingMessage;
      mockedMessageQueue.prototype.waitForResponse.mockResolvedValue(incomingMessage);

      chatClient.connect();
      const result = await chatClient.setNickname('Ubiquiti');

      expect(webSocketMock.send).toBeCalled();
      expect(JSON.parse(webSocketMock.send.mock.calls[0][0])).toStrictEqual({
        command: 'NICKNAME',
        nickname: 'Ubiquiti',
        correlationId: '1',
      });
      expect(result).toBeUndefined();

      const failedIncomingMessage = ({ errorCode: '777', reason: 'reason' } as unknown) as IncomingMessage;
      mockedMessageQueue.prototype.waitForResponse.mockResolvedValue(failedIncomingMessage);

      const failedResult = await chatClient.setNickname('Ubiquiti');

      expect(failedResult).toBe(failedIncomingMessage);
    });
  });

  describe('sendTell', () => {
    it('should send a tell command and wait for the response', async () => {
      const webSocketMock = { onopen: jest.fn(), onclose: jest.fn(), onmessage: jest.fn(), send: jest.fn() };
      const webSocket = (webSocketMock as unknown) as WebSocket;
      jest.spyOn(global, 'WebSocket').mockImplementation(() => webSocket);

      const mockedMessageQueue = mocked(MessageQueue, true);
      const incomingMessage = ({} as unknown) as IncomingMessage;
      mockedMessageQueue.prototype.waitForResponse.mockResolvedValue(incomingMessage);

      chatClient.connect();
      const result = await chatClient.sendTell('Hello!');

      expect(webSocketMock.send).toBeCalled();
      expect(JSON.parse(webSocketMock.send.mock.calls[0][0])).toStrictEqual({
        command: 'TELL',
        message: 'Hello!',
        correlationId: '1',
      });
      expect(result).toBeUndefined();

      const failedIncomingMessage = ({ errorCode: '777', reason: 'reason' } as unknown) as IncomingMessage;
      mockedMessageQueue.prototype.waitForResponse.mockResolvedValue(failedIncomingMessage);

      const failedResult = await chatClient.sendTell('Hello!');

      expect(failedResult).toBe(failedIncomingMessage);
    });
  });
});
