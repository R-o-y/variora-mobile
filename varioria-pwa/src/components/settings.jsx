import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import Navbar from './nav_bar';

class Settings extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <Navbar title="Settings" history={this.props.history}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps, actions)(Settings);
