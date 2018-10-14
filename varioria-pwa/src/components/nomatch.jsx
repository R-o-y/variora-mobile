import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import Navbar from './nav_bar';
import { WhiteSpace, WingBlank } from 'antd-mobile';

class Nomatch extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <Navbar title='Page Not Found' />
        <WhiteSpace size='xl' />
        <WingBlank size='lg'>The page you were looking for does not exist, or you do not have access to it.</WingBlank>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps, actions)(Nomatch);
