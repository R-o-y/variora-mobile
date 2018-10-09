import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Explore extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <h1>Explore</h1>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps, actions)(Explore);
