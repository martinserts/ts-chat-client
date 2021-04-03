import { MessageQueue } from './messageQueue';

describe('MessageQueue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    messageQueue = new MessageQueue(onMessageReceived);
  });

  const onMessageReceived = jest.fn();
  let messageQueue: MessageQueue;

  describe('add', () => {
    it('should do nothing, if message json is invalid', () => {
      messageQueue.add('invalid');
      expect(messageQueue.responses).toStrictEqual({});
    });

    it('shoud add the message to response storage, if it has a correlationId', () => {
      messageQueue.add('{"correlationId":"321","message":"test"}');
      expect(messageQueue.responses).toStrictEqual({ '321': { correlationId: '321', message: 'test' } });
    });

    it('should emit onMessageReceived event, if received message does not have a correlationId', () => {
      messageQueue.add('{"message":"test"}');
      expect(messageQueue.responses).toStrictEqual({});
      expect(onMessageReceived).toBeCalledWith({ message: 'test' });
    });
  });

  describe('waitForResponse', () => {
    it('should return response deleting it from store deleting beforehand', async () => {
      messageQueue.add('{"correlationId":"321","message":"test"}');
      const message = await messageQueue.waitForResponse('321');
      expect(message).toStrictEqual({ correlationId: '321', message: 'test' });
      expect(messageQueue.responses).toStrictEqual({});
    });
  });
});
