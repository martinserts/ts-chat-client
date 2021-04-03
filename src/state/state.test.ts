import { ConnectionState } from './connectionState';
import { State, StoredMessage } from './state';
import { IncomingMessage } from '../api/message';

const mockSetNickname = jest.fn();
const mockSendTell = jest.fn();
const mockDisconnect = jest.fn();
jest.mock('../api/chatClient', () => {
  return {
    ChatClient: function () {
      return { connect: () => {}, setNickname: mockSetNickname, sendTell: mockSendTell, disconnect: mockDisconnect };
    },
  };
});

describe('State', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    state = new State(url, reconnectTimeout);
  });

  const url = 'ws://URL';
  const reconnectTimeout = 5000;
  let state: State;

  describe('chatting', () => {
    it('should return true, if user is connected with a nonempty nickname', () => {
      state.connectionState = ConnectionState.Connected;
      state.nickname = 'Uniquiti';

      expect(state.chatting).toBeTruthy();
    });

    it('should return false, if user is not connected', () => {
      state.connectionState = ConnectionState.Disconnected;

      expect(state.chatting).toBeFalsy();
    });
  });

  describe('resetState', () => {
    it('should clear messages and the nickname', () => {
      state.nickname = 'Ubiquiti';
      const shutdownMessage: StoredMessage = {
        command: 'Accepted',
        correlationId: '321',
        date: 'DATE',
        id: 1,
      };
      state.messages = [shutdownMessage];

      state.resetState();

      expect(state.messages).toStrictEqual([]);
      expect(state.nickname).toBeUndefined();
    });

    it('should show info message, when connection is closed due to idleness', () => {
      state.nickname = 'Ubiquiti';
      const connectionClosed: StoredMessage = {
        command: 'ConnectionClosed',
        nickname: 'Ubiquiti',
        reason: 'reason',
        date: 'DATE',
        id: 1,
      };
      state.messages = [connectionClosed];

      state.resetState();

      expect(state.info).toBe('Disconnected by the server due to inactivity');
    });

    it('should show info message, when server is shut down', () => {
      const shutdownMessage: StoredMessage = {
        command: 'Shutdown',
        reason: 'reason',
        date: 'DATE',
        id: 1,
      };
      state.messages = [shutdownMessage];

      state.resetState();

      expect(state.info).toBe('The server was shut down');
    });
  });

  describe('onConnectionStateChanged', () => {
    it('should update state and reset it, in case it is disconnected', () => {
      state.nickname = 'Ubiquiti';
      state.connectionState = ConnectionState.Connected;

      state.onConnectionStateChanged(ConnectionState.Disconnected);

      expect(state.connectionState).toBe(ConnectionState.Disconnected);
      expect(state.nickname).toBeUndefined();
    });

    it('should update state and not reset in other state changes', () => {
      state.nickname = 'Ubiquiti';

      state.onConnectionStateChanged(ConnectionState.Connected);

      expect(state.connectionState).toBe(ConnectionState.Connected);
      expect(state.nickname).toBe('Ubiquiti');
    });
  });

  describe('onMessageReceived', () => {
    it('should add the message to store', () => {
      const shutdownMessage: IncomingMessage = {
        command: 'Shutdown',
        reason: 'reason',
      };

      state.onMessageReceived(shutdownMessage);

      expect(state.messages.length).toBe(1);
      expect(state.messages[0]).toMatchObject({
        command: 'Shutdown',
        reason: 'reason',
        id: 1,
      });
    });
  });

  describe('setNickname', () => {
    it('should do nothing, if nickname is already set', async () => {
      state.nickname = 'Ubiquiti';

      await state.setNickname('Test');

      expect(mockSetNickname).not.toBeCalled();
    });

    it('should return error, if setting the nickname fails', async () => {
      mockSetNickname.mockResolvedValue({ reason: 'Error' });

      const result = await state.setNickname('Ubiquiti');

      expect(mockSetNickname).toBeCalledWith('Ubiquiti');
      expect(result).toBe('Error');

      mockSetNickname.mockClear();

      mockSetNickname.mockResolvedValue({});

      const result2 = await state.setNickname('Ubiquiti');

      expect(result2).toBe('Failed to set the nickname');
    });

    it('should set the nickname, if there are no errors', async () => {
      const result = await state.setNickname('Ubiquiti');

      expect(result).toBeUndefined();
      expect(state.nickname).toBe('Ubiquiti');
    });
  });

  describe('sendTell', () => {
    it('should send tell and return the error, if any', async () => {
      const result = await state.sendTell('Hello!');

      expect(result).toBeUndefined();

      mockSendTell.mockResolvedValue({ reason: 'Error' });

      const result2 = await state.sendTell('Hello!');

      expect(result2).toBe('Error');
    });
  });

  describe('disconnect', () => {
    it('should disconnect the client', () => {
      state.disconnect();

      expect(mockDisconnect).toBeCalled();
    });
  });

  describe('clearInfo', () => {
    it('should clear the info', () => {
      state.info = 'INFO';

      state.clearInfo();

      expect(state.info).toBeUndefined();
    });
  });
});
