import './App.css';

import { CSSTransition, TransitionGroup } from "react-transition-group"
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import React, { Component } from 'react'
import axios from 'axios'

import { connect } from 'react-redux';
import * as actions from './actions';
import BottomTabBar from './components/bottom_tab_bar';
import Main from './components/main';
import NavBar from './components/nav_bar';

import logo from './logo.svg'

import { DocumentViewer } from './components/document_viewer.jsx'

import { StickyContainer, Sticky } from 'react-sticky';

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
    let pathname = this.props.location.pathname
    return (
      <div className="App">
        <StickyContainer>
          <NavBar title={pathname.substr(1)} />
          <Main />
          <Sticky>
            {({ style }) =>
              <BottomTabBar
                path={pathname}
                history={this.props.history}
                style={style}
              />
            }
          </Sticky>
        </StickyContainer>
        {/*<DocumentViewer documentPk={8} />*/}
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header> */}

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
