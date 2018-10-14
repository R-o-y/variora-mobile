import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavBar } from 'antd-mobile';
import Avatar from '@material-ui/core/Avatar';

class Navbar extends Component {

  render() {
    return (
      <NavBar
        mode="light"
        leftContent={<img alt='logo' style={{ height: '100%' }}src='/favicon.ico'/>}
        rightContent={
          <Avatar alt="avatar"
            style={{width: 25,height: 25}}
            src={this.props.user.portrait_url}
            onClick={() => {console.log("Avatar is clicked")}}
          />
        }
      >{this.props.title}</NavBar>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(Navbar);
