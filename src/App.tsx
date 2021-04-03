import { FunctionComponent } from 'react';
import { ChatPage } from './components/ChatPage/ChatPage';
import { LandingPage } from './components/LandingPage/LandingPage';
import { observer } from 'mobx-react';
import { State } from './state/state';

type AppProps = {
  state: State;
};

const App: FunctionComponent<AppProps> = observer(({ state }) => (
  <div>{state.chatting ? <ChatPage state={state} /> : <LandingPage state={state} />}</div>
));

export default App;
