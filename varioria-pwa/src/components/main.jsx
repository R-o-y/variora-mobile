import { Route, Switch } from 'react-router-dom';

import Explore from './explore';
import GroupExplore from './group_explore';
import Notifications from './notifications';
import React from 'react';
import Readlists from './readlists';
import Settings from './settings';
import Uploads from './uploads/uploads';

const Main = () => (
  <main>
    <Switch>
      <Route path="/groups" component={Groups}/>
      <Route path='/explore' component={Explore}/>
      <Route path='/uploads' component={Uploads}/>
      <Route path='/readlists' component={Readlists}/>
      <Route path='/notifications' component={Notifications}/>
      <Route path='/settings' component={Settings}/>
    </Switch>
  </main>
)

const Groups = ({match}) => {
  return(
    <Switch>
      <Route path={`${match.url}/:groupUuid?/explore`} component={GroupExplore}/>
      <Route path={`${match.url}/:groupUuid?/uploads`} component={Uploads}/>
      <Route path={`${match.url}/:groupUuid?/readlists`} component={Readlists}/>
      <Route path={`${match.url}/:groupUuid?/notifications`} component={Notifications}/>
      <Route path={`${match.url}/:groupUuid?/settings`} component={Settings}/>
    </Switch>
  );
};

export default Main;
