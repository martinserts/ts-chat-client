import { observer } from 'mobx-react';
import { FunctionComponent } from 'react';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import { UserJoinedMessage } from '../../api/message';

type JoinProps = {
  message: UserJoinedMessage & { date: string };
};

export const Join: FunctionComponent<JoinProps> = observer(({ message }) => (
  <Card>
    <CardHeader
      avatar={<ArrowForward />}
      action={<Typography variant="caption">{message.date}</Typography>}
      title={message.nickname}
      subheader="Joined the chat"
    />
  </Card>
));
