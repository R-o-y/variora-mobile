import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Explore from './explore';
import Uploads from './uploads';
import Readlists from './readlists';
import Notifications from './notifications';
import Settings from './settings';
import NoMatch from './nomatch';

const Main = () => (
  <main>
    <Switch>
      <Route path='/explore' component={Explore}/>
      <Route path='/uploads' component={Uploads}/>
      <Route path='/readlists' component={Readlists}/>
      <Route path='/notifications' component={Notifications}/>
      <Route path='/settings' component={Settings}/>
      <Route component={NoMatch}/>
    </Switch>
  </main>
)

export default Main;
