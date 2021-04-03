import { fireEvent, render, screen } from '@testing-library/react';
import { State } from '../../state/state';
import { TopToolBar } from './TopToolBar';

test('renders the toolbar, disconnects when requested', async () => {
  const disconnect = jest.fn();
  const state = ({
    nickname: 'Nickname',
    disconnect,
  } as unknown) as State;

  render(<TopToolBar state={state} />);

  expect(screen.getByText(/Welcome to Ubiquiti chat!/)).toBeInTheDocument();
  expect(screen.getByText(/Nickname/)).toBeInTheDocument();

  const disconnectButton = screen.getByRole('button');
  fireEvent.click(disconnectButton);
  expect(disconnect).toBeCalled();
});
