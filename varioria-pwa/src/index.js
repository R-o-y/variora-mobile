import './index.css';
import 'antd-mobile/dist/antd-mobile.css';
import 'typeface-roboto'

import * as serviceWorker from './serviceWorker';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { applyMiddleware, compose, createStore } from 'redux';

import App from './App';
import CreateCoterieForm from './components/create_coterie_form';
import CreateReadlistForm from './components/create_readlist_form';
import EditReadlistForm from './components/edit_readlist_form';
import DocumentViewer from './components/document_viewer/document_viewer';
import Readlist from './components/readlist';

import Search from './components/search';

import { Login } from './components/login/login'
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import ReduxPromise from 'redux-promise';
import ReduxThunk from 'redux-thunk';

import reducers from './reducers';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    suppressDeprecationWarnings: true
  },
  palette: {
    primary: {
      main: "#1BA39C"
    },
  }
});

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
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route path="/documents/:slug" component={DocumentViewer} />
            <Route path='/readlists/:slug' component={Readlist}/>
            <Route path="/search/:groupUuid" component={Search} />
            <Route path="/search" component={Search} />
            <Route path="/create-coterie-form" component={CreateCoterieForm} />
            <Route path="/create-readlist-form" component={CreateReadlistForm} />
            <Route path="/edit-readlist-form/:slug" component={EditReadlistForm} />
            <Route path="/sign-in" component={Login} />
            <Route path="/" component={App} />
          </Switch>
        </BrowserRouter>
    </Provider>
  </MuiThemeProvider>
  , document.getElementById('root'));
serviceWorker.unregister();
