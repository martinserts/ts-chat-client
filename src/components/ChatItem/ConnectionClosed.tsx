import { observer } from 'mobx-react';
import { FunctionComponent } from 'react';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import { ConnectionClosedMessage } from '../../api/message';

type ConnectionClosedProps = {
  message: ConnectionClosedMessage & { date: string };
};

export const ConnectionClosed: FunctionComponent<ConnectionClosedProps> = observer(({ message }) => (
  <Card>
    <CardHeader
      avatar={<ArrowBack />}
      action={<Typography variant="caption">{message.date}</Typography>}
      title={message.nickname}
      subheader={message.reason}
    />
  </Card>
));
