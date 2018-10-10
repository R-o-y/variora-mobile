import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from './nav_bar';

class Explore extends Component {

  componentDidMount() {
    this.props.getExploreDocuments();
    this.props.getExploreReadlists();
    console.log("HERE");
    console.log(this.props.explore);
  }

  render() {
    return (
      <div>
        <Navbar title="Explore" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    explore: state.explore
  };
}

export default connect(mapStateToProps, actions)(Explore);
