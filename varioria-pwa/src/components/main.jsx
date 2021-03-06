import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Explore from './explore/explore';
import GroupExplore from './explore/group_explore';
import Uploads from './uploads/uploads';
import Readlists from './readlists/readlists';
import Notifications from './notifications';
import Settings from './settings';

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
