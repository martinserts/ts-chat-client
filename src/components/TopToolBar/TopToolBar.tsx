import { observer } from 'mobx-react';
import { FunctionComponent } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ExitToApp from '@material-ui/icons/ExitToApp';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { ConnectionStatus } from '../ConnectionStatus/ConnectionStatus';
import { State } from '../../state/state';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbarText: {
      marginRight: 'auto',
    },
    chip: {
      marginRight: 30,
    },
    exitApp: {
      color: 'white',
      marginLeft: '13px',
    },
  }),
);

type TopToolBarProps = {
  state: State;
};

export const TopToolBar: FunctionComponent<TopToolBarProps> = observer(({ state }) => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography className={classes.toolbarText} variant="h6" noWrap>
          Welcome to Ubiquiti chat!
        </Typography>
        {state.nickname ? (
          <Chip className={classes.chip} label={state.nickname} avatar={<Avatar>{state.nickname[0]}</Avatar>} />
        ) : null}
        <ConnectionStatus state={state} />
        {state.nickname ? (
          <Tooltip title="Disconnect">
            <IconButton onClick={() => state.disconnect()} className={classes.exitApp}>
              <ExitToApp />
            </IconButton>
          </Tooltip>
        ) : null}
      </Toolbar>
    </AppBar>
  );
});
