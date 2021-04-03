import { render, screen } from '@testing-library/react';
import { UserJoinedMessage } from '../../api/message';
import { Join } from './Join';

test('renders a join message', () => {
  const message = {
    command: 'Join',
    nickname: 'Ubiquiti',
    date: 'DATE',
  } as UserJoinedMessage & { date: string };

  render(<Join message={message} />);

  expect(screen.getByText(/Ubiquiti/)).toBeInTheDocument();
  expect(screen.getByText(/DATE/)).toBeInTheDocument();
});
