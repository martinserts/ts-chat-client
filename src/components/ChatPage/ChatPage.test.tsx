import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConnectionState } from '../../state/connectionState';
import { StoredMessage } from '../../state/state';
import { State } from '../../state/state';
import { ChatPage } from './ChatPage';

test('renders top bar and chat messages', () => {
  const joinMessage = {
    command: 'Join',
    nickname: 'Nickname1',
    date: 'DATE',
    id: 1,
  } as StoredMessage;
  const tellMessage = {
    command: 'Tell',
    nickname: 'Nickname2',
    message: 'Hello world!',
    date: 'DATE',
    id: 2,
  } as StoredMessage;
  const state = ({
    connectionState: ConnectionState.Connected,
    messages: [joinMessage, tellMessage],
    nickname: 'Ubiquiti',
  } as unknown) as State;

  render(<ChatPage state={state} />);

  expect(screen.getByText(/Welcome to Ubiquiti chat!/)).toBeInTheDocument();
  expect(screen.getByText(/Nickname1/)).toBeInTheDocument();
  expect(screen.getByText(/Nickname2/)).toBeInTheDocument();
});

test('handles chat message input', async () => {
  const sendTell = jest.fn();
  const state = ({
    connectionState: ConnectionState.Connected,
    messages: [],
    nickname: 'Ubiquiti',
    sendTell,
  } as unknown) as State;

  render(<ChatPage state={state} />);

  const control = screen.getByPlaceholderText(/Enter chat message/);

  fireEvent.change(control, { target: { value: 'Hello guys!' } });
  await waitFor(() => screen.getByDisplayValue('Hello guys!'));

  fireEvent.keyUp(control, { key: 'Enter', code: 'Enter' });
  await waitFor(() => expect(sendTell).toBeCalledWith('Hello guys!'));

  expect(control).toHaveDisplayValue('');

  const button = screen.getByRole('sendMessage');
  expect(button).toBeDisabled();

  fireEvent.change(control, { target: { value: 'Another message' } });
  await waitFor(() => screen.getByDisplayValue('Another message'));

  expect(button).toBeEnabled();
  sendTell.mockClear();

  fireEvent.click(button);
  await waitFor(() => expect(sendTell).toBeCalledWith('Another message'));
});

test('displays error on submission failure', async () => {
  const sendTell = jest.fn();
  const state = ({
    connectionState: ConnectionState.Connected,
    messages: [],
    nickname: 'Ubiquiti',
    sendTell,
  } as unknown) as State;

  render(<ChatPage state={state} />);

  const control = screen.getByPlaceholderText(/Enter chat message/);
  const button = screen.getByRole('sendMessage');

  fireEvent.change(control, { target: { value: 'Hello guys!' } });
  await waitFor(() => screen.getByDisplayValue('Hello guys!'));

  sendTell.mockReturnValue('Error occured!');
  fireEvent.click(button);

  await waitFor(() => expect(screen.getByText(/Error occured!/)).toBeInTheDocument());
});
