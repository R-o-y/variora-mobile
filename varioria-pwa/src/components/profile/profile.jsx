import 'regenerator-runtime/runtime'
import 'antd-mobile/dist/antd-mobile.css'

import { Icon, Toast, NavBar, Button } from 'antd-mobile';
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
import { library } from '@fortawesome/fontawesome-svg-core'

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
        window.location.href = '/sign-in'
      })
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" onClick={() => this.props.history.goBack()}/>}
          style={{
            boxShadow: '0px 1px 3px rgba(28, 28, 28, .1)',
            zIndex: 10000000,
            position: 'relative',
            // borderBottom: '1px solid #c8c8c8',
            // height: 38
          }}
        >
          <span>
            Profile
          </span>
        </NavBar>

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

export default Profile
