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

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { getCookie } from '../utilities/helper';


class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      memberModal: false,
      inviteDialog: false
    }
  }

  componentDidMount() {
    this.props.getMyCoteries().then(() => {
      this.setState({isFetching: false})
    })
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

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleFormSubmit() {
    var data = new FormData();
    data.append('coterie_id', this.props.coteries[this.props.match.params.groupUuid].pk);
    data.append('invitee_emails', this.state.emails);
    data.append('invitation_message', this.state.message);
    data.append('csrfmiddlewaretoken', getCookie('csrftoken'));
    this.props.inviteToCoterie(data);
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

  renderGroupInfo(currentCoterie) {
    return (
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
    )
  }

  renderMemberModal(currentCoterie) {
    return (
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
    )
  }

  renderInviteDialog() {
    return (
      <div>
        <Dialog
          open={this.state.inviteDialog}
          onClose={() => this.onClose('inviteDialog')}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Invite new members</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To invite new member to the group, enter the email addresses here separated by commas. We will send invitation messages.
            </DialogContentText>
            <TextField
              required
              autoFocus
              multiline
              margin="dense"
              id="emails"
              label="Email Address"
              type="email"
              fullWidth
              onChange={this.handleChange('emails')}
            />
            <TextField
              required
              multiline
              margin="dense"
              id="message"
              label="Message"
              fullWidth
              onChange={this.handleChange('message')}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.onClose('inviteDialog')} color="primary">
              Cancel
            </Button>
            <Button onClick={() => {this.onClose('inviteDialog'); this.handleFormSubmit();}} color="primary">
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }

  render() {
    if (_.isEmpty(this.props.user) || this.state.isFetching) {
      return (
        <div>
          <Navbar title="Settings" history={this.props.history} match={this.props.match} />
          <CircularProgress style={{color:"#1BA39C",  marginTop: "38vh"}} size='10vw' thickness={5} />
        </div>
      );
    }

    if (!this.props.match.params.groupUuid) {
      return (
        <div>
          <Navbar title="Settings" history={this.props.history} match={this.props.match} />
          <h2> You are in the public group. </h2>
        </div>
      )
    }

    const currentCoterie = this.props.coteries[this.props.match.params.groupUuid];
    return (
      <div>
        <Navbar title="Settings" history={this.props.history} match={this.props.match}/>
        {this.renderGroupInfo(currentCoterie)}

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
           onClick={(e) => {this.showModal('inviteDialog', e)}}
          >
            Add someone
          </List.Item>
        </List>

        <WhiteSpace size="lg" />
        <List>
          <List.Item
           thumb={<ExitIcon style={{color: '#FF0000'}} />}
           onClick={() => {}}>
            Leave group
          </List.Item>
        </List>

        {this.renderMemberModal(currentCoterie)}
        {this.renderInviteDialog()}

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
