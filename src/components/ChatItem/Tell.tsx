import { observer } from 'mobx-react';
import { FunctionComponent } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import { TellMessage } from '../../api/message';

const avatarColors = ['red', 'blue', 'navy', 'green', 'olive', 'orange', 'teal'];
const avatarColor = (letter: string): string => avatarColors[letter.charCodeAt(0) % avatarColors.length];

type TellProps = {
  message: TellMessage & { date: string };
};

export const Tell: FunctionComponent<TellProps> = observer(({ message }) => {
  const avatarLetter = message.nickname[0];

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" style={{ backgroundColor: avatarColor(avatarLetter) }}>
            {avatarLetter}
          </Avatar>
        }
        action={<Typography variant="caption">{message.date}</Typography>}
        title={message.nickname}
        subheader={message.message}
      />
    </Card>
  );
});
