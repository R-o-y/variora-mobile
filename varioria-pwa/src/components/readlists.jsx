import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import Navbar from './nav_bar';

class Readlists extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <Navbar title='Readlists' />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps, actions)(Readlists);
