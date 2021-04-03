import OfflineBolt from '@material-ui/icons/OfflineBolt';
import Lock from '@material-ui/icons/Lock';
import Tooltip from '@material-ui/core/Tooltip';
import { observer } from 'mobx-react';
import { FunctionComponent } from 'react';
import { ConnectionState } from '../../state/connectionState';
import { State } from '../../state/state';

type ConnectionStatusProps = {
  state: State;
};

export const ConnectionStatus: FunctionComponent<ConnectionStatusProps> = observer(({ state }) =>
  state.connectionState === ConnectionState.Connected ? (
    <Tooltip title="Connection established" placement="left">
      <Lock />
    </Tooltip>
  ) : (
    <Tooltip title="You are offline!" placement="left">
      <OfflineBolt />
    </Tooltip>
  ),
);
