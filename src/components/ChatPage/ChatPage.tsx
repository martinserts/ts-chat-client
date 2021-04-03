import { observer } from 'mobx-react';
import { FunctionComponent, useLayoutEffect, useRef, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { TopToolBar } from '../TopToolBar/TopToolBar';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Send from '@material-ui/icons/Send';
import { ChatItem } from '../ChatItem/ChatItem';
import { CustomAlert } from '../CustomAlert/CustomAlert';
import { State } from '../../state/state';
import React from 'react';

type ChatPageProps = {
  state: State;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'absolute',
      height: '100%',
      minHeight: '100%',
      width: '100%',
    },
    wrapper: {
      display: 'flex',
      flex: '1 1 auto',
      flexDirection: 'column',
      height: '100%',
    },
    header: {
      flex: '1 1 5%',
    },
    chatBody: {
      flex: '1 1 85%',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      alignContent: 'flex-start',
      overflow: 'auto',
    },
    footer: {
      display: 'flex',
      flex: '1 1 10%',
      minHeight: '3em',
      maxHeight: '3em',
    },
    fullWidth: {
      width: '100%',
    },
    textRoot: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }),
);

export const ChatPage: FunctionComponent<ChatPageProps> = observer(({ state }) => {
  const classes = useStyles();

  const [chatMessage, setChatMessage] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const chatBody = useRef<HTMLDivElement>(null);

  const chatMessageEmpty = () => chatMessage.trim().length === 0;

  const handleChatMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChatMessage(event.target.value);
  };
  const handleChatMessageKeyUp = (event: React.KeyboardEvent<HTMLDivElement | HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !chatMessageEmpty()) handleSendChatMessage();
  };
  const handleSendChatMessage = async () => {
    const error = await state.sendTell(chatMessage);
    setError(error);
    if (!error) setChatMessage('');
  };
  const clearError = () => {
    setError(undefined);
  };
  const scrollToBottom = () => {
    if (chatBody.current) {
      chatBody.current.scrollTop = chatBody.current.scrollHeight;
    }
  };
  useLayoutEffect(() => {
    scrollToBottom();
  });

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <div className={classes.header}>
          <TopToolBar state={state} />
        </div>
        <div className={classes.chatBody} ref={chatBody}>
          {state.messages.map((message) => (
            <div className={classes.fullWidth} key={message.id}>
              <ChatItem message={message} />
            </div>
          ))}
        </div>
        <div className={classes.footer}>
          <Paper className={classes.textRoot} elevation={6}>
            <InputBase
              className={classes.input}
              placeholder="Enter chat message"
              value={chatMessage}
              onChange={handleChatMessageChange}
              onKeyUp={handleChatMessageKeyUp}
              autoFocus
            />
            <Divider className={classes.divider} orientation="vertical" />
            <IconButton
              role="sendMessage"
              color="primary"
              className={classes.iconButton}
              onClick={() => handleSendChatMessage()}
              disabled={chatMessageEmpty()}
            >
              <Send />
            </IconButton>
          </Paper>
        </div>
        <CustomAlert alert={error} clearAlert={clearError} severity="error" />
      </div>
    </div>
  );
});
