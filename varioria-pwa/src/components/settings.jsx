import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';

class Settings extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <h1>Settings</h1>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps, actions)(Settings);
