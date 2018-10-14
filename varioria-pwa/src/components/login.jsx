import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import Navbar from './nav_bar';
import { WhiteSpace, WingBlank, Button, InputItem, Flex, List } from 'antd-mobile';
import EmailIcon from '@material-ui/icons/EmailOutlined';
import PasswordIcon from '@material-ui/icons/LockOutlined';


class Nomatch extends Component {

  componentDidMount() {
  }

  socialLoginButton(serviceName, backgroundColor, action) {
    return (
      <WingBlank>
        <Button
          style={{ backgroundColor:backgroundColor, color: 'white' }}
          icon={<img alt={serviceName} src={require('../static/img/login_'+serviceName+'.svg')}/>}
        onClick={() => {/*TODO: action*/}}
        >
          {'Log in with ' + serviceName}
        </Button>
      </WingBlank>
    )
  }

  render() {
    return (
      <div>
        <Navbar title='Login' />
        <WhiteSpace size='xs' />
        <img style={{ maxWidth:'128px', width:'40%' }} alt='Variora' src={require('../static/img/logo.svg')} />
        <WhiteSpace size='sm' />
        {this.socialLoginButton('Google', '#DD4B39' /*TODO: LINK*/)}
        <WhiteSpace size='sm' />
        {this.socialLoginButton('Facebook', '#3b5998' /*TODO: LINK*/)}
        <WhiteSpace size='sm' />
        {this.socialLoginButton('Office365', '#0078D7' /*TODO: LINK*/)}
        <WhiteSpace size='xl' />

        <WingBlank>
          <List>
            <InputItem placeholder="email address">
              <EmailIcon />
            </InputItem>

            <InputItem placeholder="password">
              <PasswordIcon />
            </InputItem>
          </List>
        </WingBlank>

        <WhiteSpace size='xl' />

        <WingBlank>
          <Flex justify='end'>
            <a className='login-form-forgot' href=''>Forgot password</a>
          </Flex>
          <WhiteSpace size='xs' />

          <Button type='primary' htmlType='submit' className='login-form-button'>
            Log in
          </Button>

          <WhiteSpace size='xs' />
          <Flex justify='start'>
            <span>Or <a href=''>register now!</a> (coming soon)</span>
          </Flex>
        </WingBlank>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps, actions)(Nomatch);
