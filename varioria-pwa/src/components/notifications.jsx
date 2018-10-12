import _ from 'lodash';
import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Badge, List, WhiteSpace } from 'antd-mobile';
import CircularProgress from '@material-ui/core/CircularProgress';
import Navbar from './nav_bar';
import moment from 'moment';

class Notifications extends Component {

  componentDidMount() {
    this.props.getCombinedNotifications();
  }

  renderNotificationsList(notifications) {
    const items = notifications.map((notification) => {
      return (
        <List.Item
          arrow="horizontal"
          thumb={notification.data.image_url}
          multipleLine
          onClick={() => {console.log("clicked")}}
        >
          {notification.actor + " " + notification.verb + " some more random"}

          <List.Item.Brief>
            { moment(notification.timestamp).fromNow() }
            { notification.unread &&
              <Badge text="NEW"
                style={{
                  marginLeft: 12,
                  padding: '0 3px',
                  backgroundColor: '#fff',
                  borderRadius: 2,
                  color: '#1BA39C',
                  border: '1px solid #1BA39C',
                }}
              />
            }
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
          <Navbar title="Notifications" />
          <CircularProgress style={{color:"#1BA39C",  marginTop: "40vh"}} size={100} thickness={5} />
        </div>
      );
    }

    const notifications = _.orderBy(this.props.notifications, 'timestamp', 'desc');

    return (
      <div>
        <Navbar title="Notifications" />
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
