import _ from 'lodash';
import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { Badge, List, WhiteSpace, Modal } from 'antd-mobile';
import CircularProgress from '@material-ui/core/CircularProgress';
import NotSignedIn from './error_page/not_signed_in';
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import MailIcon from '@material-ui/icons/Mail';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import MailReadIcon from '@material-ui/icons/DraftsOutlined';
import { getCookie, getRandomColor } from '../utilities/helper';

class Notifications extends Component {
  state = { loading: true }

  componentDidMount() {
    this.props.getCombinedNotifications().then(() => {
      this.props.getInvitations().then(() => {
        this.setState({ loading: false })
      })
    })
  }

  getActionDescription(action) {
    if (action === 'reply to annotation' || action === 'reply to annotation reply') {
      return 'replied'
    }
    else if (action === 'post annotation') {
      return 'posted'
    }
    return action;
  }

  getCoterieName(uuid) {
    //Clean uuid for now
    if (uuid) {
      uuid = uuid.replace(/-/g, "");
      let coterieName = this.props.coteries[uuid].name
      console.log(uuid);
      if (coterieName.length > 14) return coterieName.slice(0, 14) + "...";
      return coterieName
    }
    return "";
  }

  formatNotificationTime(timestamp) {
    if (moment(timestamp).isSame(moment(), 'day')) {
      return moment(timestamp).format('H:mm');
    }
    else if (moment(timestamp).isSame(moment(), 'year')) {
      return moment(timestamp).format('M-d')
    }
    else {
      return moment(timestamp).format('YYYY-M-d')
    }
  }

  }

  renderInvitationList(invitations) {
    const items = invitations.map((invitation) => {
      return (
        <List.Item
          key={invitation.pk}
          thumb={<Avatar style={{height:50, width:50, backgroundColor:'#1BA39C'}}><MailIcon style={{height:40}}/></Avatar>}
          extra={
            <div style={{  display: 'flex', justifyContent: 'center', flexDirection: 'column', float:'right'}}>
              <DoneIcon style={{marginBottom: 20, color: '1BA39C'}}
                onClick={() => {
                  Modal.alert('Accept', 'Accept invitation to join ' + invitation.coterie_name + '?', [
                    { text: 'Cancel' },
                    { text: 'Join', style: {color: '#1BA39C'},
                      onPress: () => {
                        let data = new FormData();
                        data.append('csrfmiddlewaretoken', getCookie('csrftoken'));
                        this.props.acceptInvitation(invitation.accept_url, data, invitation.pk);
                    }},
                  ])
                }}
              />
              <ClearIcon style={{color: 'red'}}
                onClick={() => {
                  Modal.alert('Decline', 'Decline invitation to join ' + invitation.coterie_name + '?', [
                    { text: 'Cancel' },
                    { text: 'Decline', style: {color: '#FF0000'},
                      onPress: () => {
                        let data = new FormData();
                        data.append('csrfmiddlewaretoken', getCookie('csrftoken'));
                        this.props.declineInvitation(invitation.reject_url, data, invitation.pk);
                    }},
                  ])
                }} />
            </div>
          }
          align='middle'
          multipleLine
          wrap
          style={{backgroundColor: '#edf9f6'}}
          onClick={() => {}}
        >
          <b>{invitation.inviter_nickname + " invited you to join " + invitation.coterie_name}</b>
          <List.Item.Brief>
            { invitation.invitation_message }
          </List.Item.Brief>
        </List.Item>
      )
    })

    return (
      <div>
        <WhiteSpace />
          <List renderHeader={() => 'Pending invitaions'}
            style={{textAlign: 'left'}}
          >
            {items}
          </List>
        <WhiteSpace />
      </div>
    )
  }

  renderNotificationsList(notifications) {
    const items = notifications.map((notification) => {
      let isAnnotationRelated = ['reply to annotation', 'post annotation', 'reply to annotation reply'].includes(notification.verb);
      return (
        <List.Item
          key={notification.slug}
          thumb={(isAnnotationRelated && notification.data) ?
            <img src={notification.data.image_url} style={{height:50, width:50, borderRadius:'50%'}} /> :
            <Avatar style={{height:50, width:50, backgroundColor:'#1BA39C'}}><MailIcon style={{height:40}}/></Avatar>}
          extra={
            <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', float: 'right'}}>
              <span style={{marginBottom: 10}}>{this.formatNotificationTime(notification.timestamp)}</span>
              { notification.unread ?
                <span style={{textAlign: 'right', zIndex: 1000}}
                  onClick={(e) => {
                    this.props.markNotificationAsRead(notification.mark_read_url, notification.slug)
                    e.stopPropagation()}}>
                  <MailIcon/>
                </span> :
                <span style={{textAlign: 'right', zIndex: 1}}><MailReadIcon/></span>
              }
            </div>
          }
          align="middle"
          multipleLine
          wrap
          style={{backgroundColor: notification.unread ? '#edf9f6' : ''}}
          onClick={() => {
            this.props.markNotificationAsRead(notification.mark_read_url, notification.slug)
            if (isAnnotationRelated && notification.data) {
              this.props.history.push(notification.data.redirect_url)
            }
          }}
        >
          { notification.unread ?
            <div>
              <b>{notification.actor + " " + this.getActionDescription(notification.verb)}</b>
              { notification.data.coterie_uuid &&
                <b>{" in "}
                  <span
                    style={{color: getRandomColor(notification.data.coterie_uuid)}}>
                    {this.getCoterieName(notification.data.coterie_uuid)}
                  </span>
                </b>
              }
            </div>
            :
            <div>
              {notification.actor + " " + this.getActionDescription(notification.verb)}
              { notification.data.coterie_uuid &&
                <span>{" in "}
                  <span
                    style={{color: getRandomColor(notification.data.coterie_uuid)}}>
                    {this.getCoterieName(notification.data.coterie_uuid)}
                  </span>
                </span>
              }
            </div>
          }
          <List.Item.Brief>
            { notification.description }
          </List.Item.Brief>
        </List.Item>
      )
    })

    return (
      <div>
        <WhiteSpace />
          <List>
            {items}
          </List>
        <WhiteSpace />
      </div>
    )
  }

  render() {
    if (this.state.loading) {
      return (
        <CircularProgress style={{color:"#1BA39C",  marginTop: "38vh"}} size='10vw' thickness={5} />
      );
    }

    if (!this.props.user || !this.props.user.is_authenticated) {
      return (
        <NotSignedIn history={this.props.history}/>
      )
    }

    if (_.isEmpty(this.props.notifications) && _.isEmpty(this.props.invitations)) {
      return (
        <div>
          <List>
            <List.Item>
              <List.Item.Brief>
                You are up to date!
              </List.Item.Brief>
            </List.Item>
          </List>
        </div>
      )
    }

    const notifications = _.orderBy(this.props.notifications, 'timestamp', 'desc');
    const invitations = _.orderBy(this.props.invitations, 'pk', 'desc');

    return (
      <div>
        { invitations.length !== 0 && this.renderInvitationList(invitations) }
        { this.renderNotificationsList(notifications) }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    notifications: state.notifications,
    invitations: state.invitations,
    coteries: state.coteries,
  };
}

export default connect(mapStateToProps, actions)(Notifications);
