import './index.css';
import 'antd-mobile/dist/antd-mobile.css';
import 'typeface-roboto'

import * as serviceWorker from './serviceWorker';

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { applyMiddleware, compose, createStore } from 'redux';

import App from './App';
import AuthContainer from './components/auth_container';
import CreateCoterieForm from './components/create_coterie_form';
import CreateReadlistForm from './components/create_readlist_form';
import EditReadlistForm from './components/edit_readlist_form';
import DocumentViewer from './components/document_viewer/document_viewer';
import Readlist from './components/readlist';
import AddToReadlist from './components/add_to_readlist';
import Profile from './components/profile/profile'
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

const renderDocumentViewer = (match, location, history) => {
  return (
    <DocumentViewer
      isGroupDocument={false}
      match={match}
      location={location}
      history={history}
    />
)
}

const renderGroupDocumentViewer = (match, location, history) => {
  return (
    <DocumentViewer
      isGroupDocument={true}
      match={match}
      location={location}
      history={history}
    />
  )
}
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <AuthContainer>
        <BrowserRouter>
          <Switch>
            <Route path="/documents/:slug" render={({match, location, history}) => renderDocumentViewer(match, location, history)} />
            <Route path="/coteries/:coterieId/documents/:slug" render={({match, location, history}) => renderGroupDocumentViewer(match, location, history)} />
            <Route path='/readlists/:slug' component={Readlist}/>
            <Route path="/search/:groupUuid" component={Search} />
            <Route path="/search" component={Search} />
            <Route path="/profile" component={Profile} />
            <Route path="/add-to-readlists" component={AddToReadlist} />
            <Route path="/create-coterie-form" component={CreateCoterieForm} />
            <Route path="/create-readlist-form" component={CreateReadlistForm} />
            <Route path="/edit-readlist-form/:slug" component={EditReadlistForm} />
            <Route path="/sign-in" component={Login} />
            <Route exact path="/"render={() => <Redirect to="/uploads" />} />
            <Route path="/" component={App} />
          </Switch>
        </BrowserRouter>
      </AuthContainer>
    </Provider>
  </MuiThemeProvider>
  , document.getElementById('root'));
serviceWorker.unregister();
