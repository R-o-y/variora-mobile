import './bottom_tab_bar.css';

import { Badge, TabBar } from 'antd-mobile';

import ExploreIcon from '@material-ui/icons/Explore';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationsIcon from '@material-ui/icons/Notifications';
import React from 'react';
import ReadlistIcon from '@material-ui/icons/ViewList';
import SettingsIcon from '@material-ui/icons/Settings';
import UploadIcon from '@material-ui/icons/CloudUpload';
import _ from 'lodash';
import { connect } from 'react-redux';

class BottomTabBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: this.props.path.split('/').pop(),
      hidden: false
    };
  }

  getGroupPath() {
    const path = this.props.path
    const slices = path.split('/').slice(1)
    if (slices.length >= 1 && slices[0] === 'groups')
      return path.split('/').slice(0, -1).join('/')
    return ''
  }

  renderNotificationTabWithBadge() {
    const unread = _.filter(this.props.notifications, 'unread');
    if (_.isEmpty(unread) && _.isEmpty(this.props.invitations)) {
      return (
        <NotificationsIcon />
      )
    } else {
      return (
        <Badge dot><NotificationsIcon /></Badge>
      )
    }
  }

  getVisibleHeightString() {
    // This function is especially for adapting the iPhoneX view
    if (window.navigator.standalone === true) return 'calc(100% - 50px - env(safe-area-inset-bottom))';
    else return 'calc(100% - 50px)';
  }

  render() {
    return (
      <div style={{
        position: 'fixed',
        height: this.getVisibleHeightString(),
        width: 'calc(100% - env(safe-area-inset-left) - env(safe-area-inset-right)',
        top: 50,
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#1BA39C"
          barTintColor="white"
          hidden={this.state.hidden}
        >
          <TabBar.Item
            icon={<ExploreIcon />}
            selectedIcon={<ExploreIcon />}
            title={this.state.selectedTab === 'explore' ? 'explore' : ''}
            key="explore"
            selected={this.state.selectedTab === 'explore'}
            onPress={() => {
              this.setState({
                selectedTab: 'explore',
              });
              this.props.history.push(`${this.getGroupPath()}/explore`);
            }}
          >
            {this.state.selectedTab === 'explore' && this.props.content}
          </TabBar.Item>
          <TabBar.Item
            icon={<UploadIcon />}
            selectedIcon={<UploadIcon />}
            title={this.state.selectedTab === 'uploads' ? 'uploads' : ''}
            key="Uploads"
            selected={this.state.selectedTab === 'uploads'}
            onPress={() => {
              this.setState({
                selectedTab: 'uploads',
              });
              this.props.history.push(`${this.getGroupPath()}/uploads`);
            }}
          >
            {this.state.selectedTab === 'uploads' && this.props.content}
          </TabBar.Item>
          <TabBar.Item
            icon={<ReadlistIcon />}
            selectedIcon={<ReadlistIcon />}
            title={this.state.selectedTab === 'readlists' ? 'readlists' : ''}
            key="Readlists"
            selected={this.state.selectedTab === 'readlists'}
            onPress={() => {
              this.setState({
                selectedTab: 'readlists',
              });
              this.props.history.push(`${this.getGroupPath()}/readlists`);
            }}
          >
            {this.state.selectedTab === 'readlists' && this.props.content}
          </TabBar.Item>
          <TabBar.Item
            icon={this.renderNotificationTabWithBadge()}
            selectedIcon={<NotificationsActiveIcon />}
            title={this.state.selectedTab === 'notifications' ? 'notifications' : ''}
            key="Notifications"
            selected={this.state.selectedTab === 'notifications'}
            onPress={() => {
              this.setState({
                selectedTab: 'notifications',
              });
              this.props.history.push(`${this.getGroupPath()}/notifications`);
            }}
          >
            {this.state.selectedTab === 'notifications' && this.props.content}
          </TabBar.Item>
          <TabBar.Item
            icon={<SettingsIcon />}
            selectedIcon={<SettingsIcon />}
            title={this.state.selectedTab === 'settings' ? 'settings' : ''}
            key="Settings"
            selected={this.state.selectedTab === 'settings'}
            onPress={() => {
              this.setState({
                selectedTab: 'settings',
              });
              this.props.history.push(`${this.getGroupPath()}/settings`);
            }}
          >
            {this.state.selectedTab === 'settings' && this.props.content}
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    notifications: state.notifications,
    invitations: state.invitations
  };
}

export default connect(mapStateToProps)(BottomTabBar);
