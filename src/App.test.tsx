import { render, screen } from '@testing-library/react';
import App from './App';
import { ConnectionState } from './state/connectionState';
import { State } from './state/state';

test('renders landing page, if user is not chatting', () => {
  const state = ({
    connectionState: ConnectionState.Disconnected,
    chatting: false,
  } as unknown) as State;
  render(<App state={state} />);
  expect(screen.getByText(/Enter the nickname/i)).toBeInTheDocument();
});

test('renders the chat page, if user is connected and has a nickname assigned', () => {
  const state = ({
    connectionState: ConnectionState.Connected,
    nickname: 'Ubiquiti',
    chatting: true,
    messages: [],
  } as unknown) as State;
  render(<App state={state} />);
  expect(screen.getByPlaceholderText(/Enter chat message/)).toBeInTheDocument();
});
