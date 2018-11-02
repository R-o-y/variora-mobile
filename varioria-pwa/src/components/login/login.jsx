import 'regenerator-runtime/runtime'
// import 'typeface-roboto'
import 'antd-mobile/dist/antd-mobile.css'
import './login.css'

import { Icon, WhiteSpace, Toast } from 'antd-mobile';
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
import { faUniversity} from '@fortawesome/free-solid-svg-icons'
import Logo from '../../logo.svg'
import MButton from '@material-ui/core/Button';
import React from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import axios from 'axios'
import { getCookie } from '../../utilities/helper';
import { library } from '@fortawesome/fontawesome-svg-core'
import * as actions from '../../actions';
import { connect } from 'react-redux';

// import { MySnackbarContentWrapper } from './components/alert_message.jsx'

library.add(faFacebook, faGoogle, faUsers, faUserPlus, faUniversity)

/*eslint no-undef: "off"*/
class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isAuthenticated: false,
      username: '',
      password: '',
      token: '',
      errorMessage: false,
    }

    const self = this
    this.clickLogin = function () {
      var data = new FormData()
      data.append('email_address', this.state.username)
      data.append('password', this.state.password)
      data.append('csrfmiddlewaretoken', getCookie('csrftoken'))
      axios.post('/api/signin', data)
        .then(function(response) {
          if (response.status === 200) {
            self.props.history.push('/uploads')
            self.props.getUser();
          }
        })
        .catch(function (error) {
          console.log(error)
          self.setState({ errorMessage: true })
          Toast.offline('Email or password incorrect', 1.8);
        });
    }

    this.facebookLogin = () => {
      FB.login(function (response) {
        var data = new FormData()
        data.append('csrfmiddlewaretoken', getCookie('csrftoken'))
        data.append('auth_response', JSON.stringify(response.authResponse))
        axios.post('/api/signin/facebook', data).then((response) => {
          self.props.getUser();
          window.location.href = '/'
        }).catch(e => {
          Toast.offline('Facebook login unsuccessful', 1.8);
        })
      }, { scope: 'email' })  // TODO: get user' friends also
    }

    this.nusLogin = () => {
      // TODO: implement nus login
    }

    this.handleMessageClose = (event, reason) => {
      if (reason === 'clickaway') {
        return
      }
      this.setState({ errorMessage: false })
    }
  }

  componentDidMount() {
    const self = this
    function loadFBSdk(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) return
      js = d.createElement(s); js.id = id
      js.src = 'https://connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    }
    loadFBSdk(document, 'script', 'facebook-jssdk')
    window.fbAsyncInit = function() {
      FB.init({
        appId: '213151942857648',  // TODO:
        cookie: true,
        xfbml: true,
        version: 'v3.0'
      })
      FB.AppEvents.logPageView()
      self.setState({ fbLoginButtonLoading: false })
    }


    var auth2 = undefined
    function attachSignin(element) {
      auth2.attachClickHandler(element, {},
        function(googleUser) {
          var data = new FormData()
          data.append('csrfmiddlewaretoken', getCookie('csrftoken'))
          data.append('id_token', googleUser.getAuthResponse().id_token)
          axios.post('/api/signin/google', data).then((response) => {
            self.props.getUser();
            window.location.href = '/'
          }).catch(e => {
            console.log(e.response)
            Toast.offline('Google login unsuccessful', 1.8)
          })
        }, function(error) {
          console.log(JSON.stringify(error, undefined, 2))
          Toast.offline('Google login unsuccessful', 1.8)
        }
      )
    }
    gapi.load('auth2', function(){
      auth2 = gapi.auth2.init({
        client_id: '887521980338-fj0n0r7ui5cn313f4vh6paqm411upf3o.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
      })
      attachSignin(document.getElementById('google-button'))
    })
  }


  render() {
    return (
      <div>
        <Card id="login-card">
          <div className="social" id="logo-div">
            <img id='logo' src={Logo} />
          </div>

          <div className="social">
            <MButton
              // onClick = {() => this.setState({ showSettleUpModal: true })}
              variant="contained" size="small"
              id="google-button"
              className="social-button"
            >
              <FontAwesomeIcon icon={['fab', 'google']} className="social-icon" />
              <span className="social-text">Log in with Google</span>
            </MButton>
          </div>


          <WhiteSpace size="lg" />

          <div className="social">
            <MButton
              // onClick = {() => this.setState({ showSettleUpModal: true })}
              variant="contained" color="primary" size="small"
              id="facebook-button"
              className="social-button"
              onClick={this.facebookLogin}
            >
              <FontAwesomeIcon icon={['fab', 'facebook']} className="social-icon" />
              <span className="social-text">Log in with Facebook</span>
            </MButton>
          </div>

          <WhiteSpace size="lg" />

          <div className="social">
            <MButton
              variant="contained" size="small"
              id="nus-button"
              className="social-button"
              onClick={this.nusLogin}
            >
              <FontAwesomeIcon icon="university" className="social-icon" />
              <span className="social-text">Log in with NUS ID</span>
            </MButton>
          </div>

          <WhiteSpace size="lg" />
          <WhiteSpace size="lg" />

          <div style={{ textAlign: 'center' }}>
            <TextField
              className="input-width"
              label="Email Address"
              value={this.state.username}
              onChange={(event) => {
                this.setState({ username: event.target.value })
              }}
            />
            <WhiteSpace size="lg" />
            <TextField
              className="input-width"
              type="password"
              label="Password"
              value={this.state.password}
              onChange={(event) => this.setState({ password: event.target.value })}
            />
          </div>

          <WhiteSpace size="lg" />
          <WhiteSpace size="lg" />

          <div className="social">
            <MButton
              onClick={(event) => this.clickLogin()}
              variant="outlined" color="primary" size="small"
              className="social-button"
            >
              <Icon type={'check-circle-o'} id="submit-icon" style={{ color: '#1BA39C', marginRight: 8 }} />
              <span className="login-text" style={{ color: '#1BA39C' }}>Log in</span>
            </MButton>
          </div>

          <WhiteSpace size="lg" />

          <div className="social">
            <MButton
              // onClick={(event) => window.location.href='/register'}
              color="primary" size="small"
              className='social-butto'
            >
              {/*<FontAwesomeIcon icon='user-plus' id="submit-icon" style={{ color: '0060c0', marginRight: 8 }} />*/}
              <span className="login-text" style={{ color: '#1BA39C' }}>Create an Account <br />(Coming soon)</span>
            </MButton>
          </div>
        </Card>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps, actions)(Login);
