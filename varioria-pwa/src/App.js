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


class App extends Component {
  componentDidMount() {
    this.props.getUser();
    this.props.getMyCoteries();

    // axios.get('/file_viewer/api/documents').then(response => {
    //   this.setState({
    //     data: response.data['uploadedDocuments'].sort((a, b) => a.title > b.title)
    //   })
    //   console.log(this.state)
    // })

    // axios.get('/file_viewer/api/readlists').then(response => {
    //   console.log(response.data)
    // })
  }

  render() {
    if (_.isEmpty(this.props.user) || _.isEmpty(this.props.coteries)) {
      return (
        <CircularProgress style={{color:"#1BA39C",  marginTop: "38vh"}} size='10vw' thickness={5} />
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
