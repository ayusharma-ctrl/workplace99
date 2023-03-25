import React from 'react';
import './App.css';
import Navs from './navs/Navs'
import { Provider } from 'react-redux';
import store from './store/Store'
import { ThemeProvider } from './components/common/Darkmode/index'
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

//wrapping redux store, theme contextAPi and reactnotifications for Toast

function App() {
  return (
    <div className="App">

      <Provider store={store} >
        <ThemeProvider>
          <ReactNotifications/>
          <Navs />
        </ThemeProvider>
      </Provider>

    </div>
  );
}

export default App;
