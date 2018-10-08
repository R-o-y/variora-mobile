import './App.css';

import { CSSTransition, TransitionGroup } from "react-transition-group"
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { Provider, connect } from 'react-redux'
import React, { Component } from 'react'
import axios from 'axios'

import logo from './logo.svg'

import { DocumentViewer } from './components/document_viewer.jsx'

class App extends Component {
  componentDidMount() {
    axios.get('/api/users/1').then((response) => {
      console.log(response.data)
    })

    axios.get('/file_viewer/api/documents').then(response => {
      this.setState({
        data: response.data['uploadedDocuments'].sort((a, b) => a.title > b.title)
      })
      console.log(this.state)
    })

    axios.get('/file_viewer/api/readlists').then(response => {
      console.log(response.data)
    })
  }

  render() {
    return (
      <div className="App">
        <DocumentViewer />
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
