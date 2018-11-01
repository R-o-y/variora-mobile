import React from 'react';
import Logo from '../../logo.svg';
import Button from '@material-ui/core/Button';

class NotSignedIn extends React.Component {

  render() {
    return (
      <div>
        <img src={Logo} alt='logo' style={{height: 108, marginTop:'20vh'}}/>
        <h3 style={{color:'grey'}}>You are not signed in!</h3>
        <h3 style={{color:'grey'}}>Sign in for more functionalities</h3>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {this.props.history.push('/sign-in')}}
        >
          Sign in
        </Button>
      </div>
    )
  }
}

export default NotSignedIn;
