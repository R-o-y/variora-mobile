import './App.css';

import { CSSTransition, TransitionGroup } from "react-transition-group"
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import React, { Component } from 'react'

import { connect } from 'react-redux';
import * as actions from './actions';
import BottomTabBar from './components/bottom_tab_bar';
import Main from './components/main';

import logo from './logo.svg'


class App extends Component {
  componentDidMount() {
    this.props.getUser();

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
  };
}

export default connect(mapStateToProps, actions)(App);
