import React from 'react';
import Logo from '../../logo.svg';
import Button from '@material-ui/core/Button';

class NoPermission extends React.Component {

  render() {
    return (
      <div>
        <img src={Logo} alt='logo' style={{height: 108, marginTop:'20vh'}}/>
        <h3 style={{color:'grey'}}>You are not a member of this group!</h3>
        <h3 style={{color:'grey'}}>Accept invitation and try again</h3>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {this.props.history.push('/explore')}}
        >
          Back to public
        </Button>
      </div>
    )
  }
}

export default NoPermission;
