import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from './nav_bar';

class Notifications extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <Navbar title="Notifications" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps, actions)(Notifications);
