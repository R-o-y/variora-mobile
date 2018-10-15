import './index.css';
import 'antd-mobile/dist/antd-mobile.css';
import 'typeface-roboto'

import * as serviceWorker from './serviceWorker';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { applyMiddleware, compose, createStore } from 'redux';
import {
  faUserPlus,
  faUsers,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons'

import App from './App';
import CreateCoterieForm from './components/create_coterie_form';
import DocumentViewer from './components/document_viewer/document_viewer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Login } from './components/login/login'
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import ReduxPromise from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import { library } from '@fortawesome/fontawesome-svg-core'
import reducers from './reducers';

library.add(faUsers, faUserPlus, faUserFriends)

const store = createStore(
  reducers,
  compose(
    applyMiddleware(ReduxPromise, ReduxThunk),
  )
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
ReactDOM.render(
  <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path="/documents/:slug" component={DocumentViewer} />
          <Route path="/create-coterie-form" component={CreateCoterieForm} />
          <Route path="/login" component={Login} />
          <Route path="/" component={App} />
        </Switch>
      </BrowserRouter>
  </Provider>
  , document.getElementById('root'));
serviceWorker.unregister();
