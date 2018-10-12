import _ from 'lodash';
import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
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
      let isAnnotationRelated = ( notification.verb ==='reply to annotation' || notification.verb === 'post annotation')
      return (
        <List.Item
          key={notification.slug}
          arrow="horizontal"
          thumb={(isAnnotationRelated && notification.data) ? notification.data.image_url : ""}
          multipleLine
          onClick={() => {
            this.props.markNotificationAsRead(notification.mark_read_url, notification.slug)
            if (isAnnotationRelated && notification.data) {
              this.props.history.push(`/document/${notification.data.document_pk}`)
            }
          }}
        >
          { notification.unread ?
            <b>{notification.actor + " " + notification.verb + " some random stuff"}</b> :
            notification.actor + " " + notification.verb + " some random stuff"
          }
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
