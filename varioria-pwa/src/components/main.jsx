import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Explore from './explore';
import Uploads from './uploads';
import Readlist from './readlist';
import Readlists from './readlists';
import Notifications from './notifications';
import Settings from './settings';

const Main = () => (
  <main>
    <Switch>
      <Route path='/explore' component={Explore}/>
      <Route path='/uploads' component={Uploads}/>
      <Route path='/readlists/:slug' component={Readlist}/>
      <Route path='/readlists' component={Readlists}/>
      <Route path='/notifications' component={Notifications}/>
      <Route path='/settings' component={Settings}/>
    </Switch>
  </main>
)

export default Main;
