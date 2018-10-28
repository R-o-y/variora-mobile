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
import KeyIcon from '@material-ui/icons/VpnKey';
import ClearIcon from '@material-ui/icons/Clear';
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
      adminModal: false,
      inviteDialog: false,
      editDialog: false
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
    data.append('invitation_message', this.state.message ? this.state.message : 'No message');
    data.append('csrfmiddlewaretoken', getCookie('csrftoken'));
    this.props.inviteToCoterie(data);
  }

  handleGroupEdit() {
    let currentCoterie = this.props.coteries[this.props.match.params.groupUuid];

    let data = new FormData();
    data.append('csrfmiddlewaretoken', getCookie('csrftoken'));

    if (this.state.new_name && (this.state.new_name !== currentCoterie.name)) {
      data.append('new_name', this.state.new_name);
    }
    if (this.state.new_desc && (this.state.new_desc !== currentCoterie.description)) {
      data.append('new_desc', this.state.new_desc);
    }
    this.props.updateCoterie(data, currentCoterie.pk).then((response) => {
      this.props.updateCoterieSuccess(currentCoterie.uuid, this.state.new_name, this.state.new_desc)
    })
  }

  renderMember(member, currentCoterie) {
    let isAdmin = this.props.user.administratedCoteries.includes(currentCoterie.uuid);
    return (
      <List.Item
        key={member.pk}
        thumb={<img src={member.portrait_url} style={{borderRadius: '50%'}} />}
        align='middle'
        extra={
          isAdmin &&
            <ClearIcon style={{color: 'red'}}
              onClick={() => {
                Modal.alert('Remove member ' + member.nickname + '?', '', [
                  { text: 'Cancel' },
                  { text: 'Remove', style:{color:'#FF0000'},
                    onPress: () => {
                      let data = new FormData();
                      data.append('csrfmiddlewaretoken', getCookie('csrftoken'));
                      data.append('member_email_address', member.email_address);
                      this.props.removeMember(currentCoterie.remove_member_url, data, currentCoterie.uuid, member.email_address);
                  }},
                ])
              }}
            />
        }
      >
        {member.nickname}
      </List.Item>
    )
  }

  renderAdmin(member) {
    return (
      <List.Item
        key={member.pk}
        thumb={<img src={member.portrait_url} style={{borderRadius: '50%'}} />}
      >
        {member.nickname}
      </List.Item>
    )
  }

  renderGroupInfo(currentCoterie) {
    let isAdmin = this.props.user.administratedCoteries.includes(currentCoterie.uuid);
    return (
      <WingBlank size="lg">
        <WhiteSpace size="lg" />
        <Card>
          <Card.Header
            title={<span style={{marginLeft:20}}>{currentCoterie.name}</span>}
            thumb={<PeopleOutlineIcon style={{color: 'rgb(101, 119, 134)'}} />}
            extra={ isAdmin &&
              <EditIcon onClick={(e) => {this.showModal('editDialog', e)}} />
            }
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
            return this.renderMember(member, currentCoterie);
          })}
        </List>
      </Modal>
    )
  }

  renderAdminModal(currentCoterie) {
    return (
      <Modal
        popup
        visible={this.state.adminModal}
        onClose={() => this.onClose('adminModal')}
        animationType="slide-up"
        style={{overflow: 'auto', maxHeight: '80vh'}}
      >
        <List
          renderHeader={() =>
            <b style={{color: "#1BA39C"}}>Administrators</b>
          }
          className="popup-list"
        >
          {currentCoterie.administrators.map((admin) => {
            return this.renderAdmin(admin);
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
            <Button disabled={_.isEmpty(this.state.emails)}
              onClick={() => {this.onClose('inviteDialog'); this.handleFormSubmit();}} color="primary">
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }

  renderEditDialog() {
    let currentCoterie = this.props.coteries[this.props.match.params.groupUuid];

    return (
      <div>
        <Dialog
          open={this.state.editDialog}
          onClose={() => this.onClose('editDialog')}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit Group Info</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              multiline
              margin="dense"
              id="new_name"
              label="New name"
              defaultValue={currentCoterie.name}
              fullWidth
              onChange={this.handleChange('new_name')}
            />
            <TextField
              multiline
              margin="dense"
              id="new_desc"
              label="New description"
              defaultValue={currentCoterie.description}
              fullWidth
              onChange={this.handleChange('new_desc')}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.onClose('editDialog')} color="primary">
              Cancel
            </Button>
            <Button onClick={() => {this.onClose('editDialog'); this.handleGroupEdit();}} color="primary">
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
    let isAdmin = this.props.user.administratedCoteries.includes(currentCoterie.uuid);
    return (
      <div>
        <Navbar title="Settings" history={this.props.history} match={this.props.match}/>
        {this.renderGroupInfo(currentCoterie)}

        <List>
          <List.Item
           thumb={<KeyIcon style={{color: 'orange'}} />}
           extra={currentCoterie.administrators.length}
           arrow="horizontal"
           onClick={(e) => {this.showModal('adminModal', e)}}
          >
            Administrators
          </List.Item>
          <List.Item
           thumb={<PeopleIcon style={{color: '42A5F5'}} />}
           extra={currentCoterie.members.length}
           arrow="horizontal"
           onClick={(e) => {this.showModal('memberModal', e)}}
          >
            Members
          </List.Item>
          { isAdmin &&
            <List.Item
             thumb={<PersonAddIcon style={{color: '#1BA39C'}} />}
             onClick={(e) => {this.showModal('inviteDialog', e)}}
            >
              Add someone
            </List.Item>
          }
        </List>

        <WhiteSpace size="lg" />
        { !isAdmin &&
          <List>
            <List.Item
             thumb={<ExitIcon style={{color: '#FF0000'}} />}
             onClick={() => {
               Modal.alert('Leave ' + currentCoterie.name + '?',
               'Are you sure to exit this group? This cannot be undone',
               [
                 { text: 'Cancel' },
                 { text: 'Leave', style:{color:'#FF0000'},
                   onPress: () => {
                     let data = new FormData();
                     data.append('csrfmiddlewaretoken', getCookie('csrftoken'));
                     this.props.leaveCoterie(data, currentCoterie.pk, currentCoterie.uuid);
                     this.props.history.push('/explore');
                 }},
               ])
             }}>
              Leave group
            </List.Item>
          </List>
        }
        { isAdmin &&
          <List>
            <List.Item
             thumb={<ExitIcon style={{color: '#FF0000'}} />}
             onClick={() => {
               Modal.alert('Delete ' + currentCoterie.name + '?',
               'Are you sure? Deleting the group can affect all existing members. This cannot be undone',
               [
                 { text: 'Cancel' },
                 { text: 'Leave', style:{color: '#FF0000'},
                   onPress: () => {
                     let data = new FormData();
                     data.append('csrfmiddlewaretoken', getCookie('csrftoken'));
                     this.props.deleteCoterie(data, currentCoterie.pk, currentCoterie.uuid);
                     this.props.history.push('/explore');
                 }},
               ])
             }}>
              Delete group
            </List.Item>
          </List>
        }

        {this.renderAdminModal(currentCoterie)}
        {this.renderMemberModal(currentCoterie)}
        {this.renderInviteDialog()}
        {this.renderEditDialog()}

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
