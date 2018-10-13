import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import ReduxPromise from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import * as serviceWorker from './serviceWorker';
import App from './App';
import DocumentViewer from './components/document_viewer';
import reducers from './reducers';
import './index.css';
import 'antd-mobile/dist/antd-mobile.css';

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
          <Route path="/" component={App} />
        </Switch>
      </BrowserRouter>
  </Provider>
  , document.getElementById('root'));
serviceWorker.unregister();
