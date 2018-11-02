import 'regenerator-runtime/runtime'
import 'antd-mobile/dist/antd-mobile.css'

import { Icon, Toast, NavBar, Button, List, WhiteSpace } from 'antd-mobile';
import {
  faFacebook,
  faGoogle
} from '@fortawesome/free-brands-svg-icons'
import {
  faUserPlus,
  faUsers
} from '@fortawesome/free-solid-svg-icons'

import Card from '@material-ui/core/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Logo from '../../logo.svg'
import MButton from '@material-ui/core/Button';
import React from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import axios from 'axios'
import { getCookie } from '../../utilities/helper';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as actions from '../../actions';
import { connect } from 'react-redux';

// import { MySnackbarContentWrapper } from './components/alert_message.jsx'

library.add(faFacebook, faGoogle, faUsers, faUserPlus)

/*eslint no-undef: "off"*/
class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.signOff = () => {
      var data = new FormData()
      data.append('csrfmiddlewaretoken', getCookie('csrftoken'))
      axios.post('/api/signoff', data).then(response => {
        this.props.getUser();
        this.props.history.goBack()
      })
    }
  }

  componentDidMount() {
  }

  renderNavBar() {
    return (
      <NavBar
        mode="light"
        icon={<Icon type="left" onClick={() => this.props.history.goBack()}/>}
        style={{
          boxShadow: '0px 1px 3px rgba(28, 28, 28, .1)',
          zIndex: 10000000,
          position: 'relative',

        }}
      >
        <span>
          Profile
        </span>
      </NavBar>
    )
  }

  render() {

    if (!this.props.user) {
      return (
        <div>
          {this.renderNavBar()}
          You are not signed in!
        </div>
      )
    }

    console.log(this.props.user);
    return (
      <div>
        {this.renderNavBar()}

        <WhiteSpace />
        <List>
          <List.Item
            extra={<img src={this.props.user.portrait_url} alt='img' style={{borderRadius:'50%'}} />} >
            Portrait
          </List.Item>
          <List.Item
            extra={this.props.user.nickname}>
            Nickname
          </List.Item>
          <List.Item>
            Email
            <List.Item.Brief style={{textAlign:'right'}}>{this.props.user.email_address}</List.Item.Brief>
          </List.Item>
        </List>

        <Button
          type="primary"
          style={{backgroundColor: "#1BA39C", marginTop: 28}}
          onClick={() => this.signOff()}
        >
          Log out
        </Button>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps, actions)(Profile);
