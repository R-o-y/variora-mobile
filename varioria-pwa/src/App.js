import './App.css';

import { CSSTransition, TransitionGroup } from "react-transition-group"
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { Provider, connect } from 'react-redux'
import React, { Component } from 'react'
import axios from 'axios'

import logo from './logo.svg'

class App extends Component {
  componentDidMount() {
    axios.get('/api/users/1').then((response) => {
      console.log(response.data)
    })
  }

  render() {
    return (
      <div className="App">
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

export default App
