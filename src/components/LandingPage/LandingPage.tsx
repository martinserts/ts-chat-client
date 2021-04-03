import { observer } from 'mobx-react';
import { FunctionComponent, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Container from '@material-ui/core/Container';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { CustomAlert } from '../CustomAlert/CustomAlert';
import { State } from '../../state/state';
import chatHeader from './chat-header.png';
import { ConnectionState } from '../../state/connectionState';
import { TopToolBar } from '../TopToolBar/TopToolBar';

type LandingPageProps = {
  state: State;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
    },
    card: {
      marginTop: 10,
    },
    media: {
      height: 240,
      backgroundSize: 250,
    },
    enter: {
      marginLeft: 'auto',
    },
  }),
);

export const LandingPage: FunctionComponent<LandingPageProps> = observer(({ state }) => {
  const classes = useStyles();

  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };
  const handleNicknameKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && validNickname()) handleEnterChat();
  };
  const handleEnterChat = async () => {
    setError(await state.setNickname(nickname));
  };
  const clearError = () => {
    setError(undefined);
  };
  const validNickname = () => /^[A-Za-z0-9]{3,15}$/.test(nickname);

  return (
    <div>
      <TopToolBar state={state} />
      <Fade in>
        <Container>
          <div className={classes.root}>
            <Card className={classes.card}>
              <CardMedia className={classes.media} image={chatHeader} title="Chat" />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Enter the nickname
                </Typography>
                <TextField
                  label="Nickname"
                  role="Nickname"
                  required
                  fullWidth
                  helperText="Must consist of 3-15 alphanumeric characters."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                  value={nickname}
                  onChange={handleNicknameChange}
                  onKeyUp={handleNicknameKeyUp}
                  autoFocus
                />
              </CardContent>

              <CardActions>
                <Button
                  className={classes.enter}
                  size="small"
                  color="primary"
                  disabled={state.connectionState !== ConnectionState.Connected || !validNickname()}
                  onClick={() => handleEnterChat()}
                >
                  Enter chat
                </Button>
              </CardActions>
            </Card>
          </div>
        </Container>
      </Fade>
      <CustomAlert alert={error} clearAlert={clearError} severity="error" />
      <CustomAlert alert={state.info} clearAlert={state.clearInfo} severity="info" />
    </div>
  );
});
