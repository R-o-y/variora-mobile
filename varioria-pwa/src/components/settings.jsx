import _ from 'lodash';
import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import Navbar from './nav_bar';
import CircularProgress from '@material-ui/core/CircularProgress';
import { List, WingBlank, WhiteSpace, Card } from 'antd-mobile';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import EditIcon from '@material-ui/icons/Edit';
import PeopleIcon from '@material-ui/icons/People';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ExitIcon from '@material-ui/icons/ExitToApp';

class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isFetching: true
    }
  }

  componentDidMount() {
    this.props.getMyCoteries().then(() => {
      this.setState({isFetching: false})
    })
  }

  render() {
    if (_.isEmpty(this.props.user) || this.state.isFetching) {
      return (
        <div>
          <Navbar title="Settings" history={this.props.history} />
          <CircularProgress style={{color:"#1BA39C",  marginTop: "38vh"}} size='10vw' thickness={5} />
        </div>
      );
    }

    if (!this.props.user.currentCoterie) {
      return (
        <div>
          <Navbar title="Settings" history={this.props.history} />
          <h2> You are in the public group. </h2>
        </div>
      )
    }

    const currentCoterie = this.props.coteries[this.props.user.currentCoterie];
    return (
      <div>
        <Navbar title="Settings" history={this.props.history}/>
        <WingBlank size="lg">
          <WhiteSpace size="lg" />
          <Card>
            <Card.Header
              title={<span style={{marginLeft:20}}>{currentCoterie.name}</span>}
              thumb={<PeopleOutlineIcon style={{color: 'rgb(101, 119, 134)'}}  />}
              extra={<EditIcon onClick={() => console.log('edit clicked')} />}
            />
            <Card.Body>
              <div>{currentCoterie.description}</div>
            </Card.Body>
          </Card>
          <WhiteSpace size="lg" />
        </WingBlank>

        <List>
          <List.Item
           thumb={<PeopleIcon style={{color: '42A5F5'}} />}
           extra={currentCoterie.members.length}
           arrow="horizontal"
           onClick={() => {}}
          >
            Members
          </List.Item>
          <List.Item
           thumb={<PersonAddIcon style={{color: '#1BA39C'}} />}
           onClick={() => {}}
          >
            Add someone
          </List.Item>
        </List>

        <WhiteSpace size="lg" />
        <List>
          <List.Item
           thumb={<ExitIcon style={{color: '#FF0000'}} />}
           onClick={() => {}}
          >
            Leave group
          </List.Item>
        </List>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    coteries: state.coteries
  };
}

export default connect(mapStateToProps, actions)(Settings);
