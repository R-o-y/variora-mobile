import _ from 'lodash';
import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { Badge, List, WhiteSpace } from 'antd-mobile';
import CircularProgress from '@material-ui/core/CircularProgress';
import Navbar from './nav_bar';
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';
import MailIcon from '@material-ui/icons/Mail';

class Notifications extends Component {

  componentDidMount() {
    this.props.getCombinedNotifications();
  }

  getActionDescription(action) {
    if (action === 'reply to annotation') {
      return 'replied'
    }
    else if (action === 'post annotation') {
      return 'posted'
    }
    return action;
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

  renderNotificationsList(notifications) {
    const items = notifications.map((notification) => {
      let isAnnotationRelated = ( notification.verb ==='reply to annotation' || notification.verb === 'post annotation')
      return (
        <List.Item
          key={notification.slug}
          thumb={(isAnnotationRelated && notification.data) ?
            <img src={notification.data.image_url} style={{height:50, width:50}} /> :
            <Avatar style={{height:50, width:50, backgroundColor:'#1BA39C'}}><MailIcon style={{height:40}}/></Avatar>}
          extra={this.formatNotificationTime(notification.timestamp)}
          align="top"
          multipleLine
          style={{backgroundColor: notification.unread ? '#edf9f6' : ''}}
          onClick={() => {
            this.props.markNotificationAsRead(notification.mark_read_url, notification.slug)
            if (isAnnotationRelated && notification.data) {
              this.props.history.push(notification.data.redirect_url)
            }
          }}
        >
          { notification.unread ?
            <b>{notification.actor + " " + this.getActionDescription(notification.verb) }</b> :
            notification.actor + " " + this.getActionDescription(notification.verb)
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
    if (_.isEmpty(this.props.notifications)) {
      return (
        <div>
          <Navbar title="Notifications" history={this.props.history} />
          <CircularProgress style={{color:"#1BA39C",  marginTop: "38vh"}} size='10vw' thickness={5} />
        </div>
      );
    }

    const notifications = _.orderBy(this.props.notifications, 'timestamp', 'desc');

    return (
      <div>
        <Navbar title="Notifications" history={this.props.history} />
        {this.renderNotificationsList(notifications)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    notifications: state.notifications,
  };
}

export default connect(mapStateToProps, actions)(Notifications);
