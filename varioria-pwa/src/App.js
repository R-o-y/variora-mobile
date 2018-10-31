import './App.css';

import { CSSTransition, TransitionGroup } from "react-transition-group"
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import React, { Component } from 'react'
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from './actions';
import BottomTabBar from './components/bottom_tab_bar';
import Main from './components/main';
import CircularProgress from '@material-ui/core/CircularProgress';
import logo from './logo.svg'
import Grid from '@material-ui/core/Grid';


class App extends Component {
  state = {
    loading: true
  }

  componentDidMount() {
    this.props.getMyCoteries().then(() => {
      this.setState({loading: false})
    });
    this.props.getCombinedNotifications();
    this.props.getInvitations();
  }

  render() {
    if (_.isEmpty(this.props.user) || this.state.loading) {
      return (
        <Grid container justify="center" alignItems="center" wrap="nowrap" style={{height: '95vh'}}>
            <CircularProgress style={{color:"#1BA39C"}} size='10vw' thickness={5} />
        </Grid>
      )
    }

    return (
      <div className="App">
        <BottomTabBar
          path={this.props.location.pathname}
          history={this.props.history}
          content={<Main />}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    coteries: state.coteries,
  };
}

export default connect(mapStateToProps, actions)(App);
