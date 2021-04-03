import { observer } from 'mobx-react';
import { FunctionComponent } from 'react';
import { StoredMessage } from '../../state/state';
import { Join } from './Join';
import { Tell } from './Tell';
import { ConnectionClosed } from './ConnectionClosed';

type ChatItemProps = {
  message: StoredMessage;
};

export const ChatItem: FunctionComponent<ChatItemProps> = observer(({ message }) => {
  switch (message.command) {
    case 'Join':
      return <Join message={message} />;
    case 'Tell':
      return <Tell message={message} />;
    case 'ConnectionClosed':
      return <ConnectionClosed message={message} />;
    default:
      return <></>;
  }
});
