import _ from 'lodash';
import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import Navbar from './nav_bar';
import CircularProgress from '@material-ui/core/CircularProgress';
import { List, WingBlank, WhiteSpace, Card, Modal } from 'antd-mobile';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import EditIcon from '@material-ui/icons/Edit';
import PeopleIcon from '@material-ui/icons/People';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ExitIcon from '@material-ui/icons/ExitToApp';

class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      memberModal: false
    }
  }

  showModal(key, e) {
    e.preventDefault();
    this.setState({
      [key]: true,
    });
  }

  onClose(key) {
    this.setState({
      [key]: false,
    });
  }

  componentDidMount() {
    this.props.getMyCoteries().then(() => {
      this.setState({isFetching: false})
    })
  }

  renderMember(member) {
    return (
      <List.Item
        key={member.pk}
        thumb={member.portrait_url}
      >
        {member.nickname}
      </List.Item>
    )
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
           onClick={(e) => {this.showModal('memberModal', e)}}
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

        <Modal
          popup
          visible={this.state.memberModal}
          onClose={() => this.onClose('memberModal')}
          animationType="slide-up"
          style={{overflow: 'auto', maxHeight: '80vh'}}
        >
          <List
            renderHeader={() =>
              <b style={{color: "#1BA39C"}}>Members</b>
            }
            className="popup-list"
          >
            {currentCoterie.members.map((member) => {
              return this.renderMember(member);
            })}
          </List>
        </Modal>
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
