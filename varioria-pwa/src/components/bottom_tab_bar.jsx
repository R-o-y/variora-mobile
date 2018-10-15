import React from 'react';
import { TabBar } from 'antd-mobile';
import ExploreIcon from '@material-ui/icons/Explore';
import UploadIcon from '@material-ui/icons/CloudUpload';
import ReadlistIcon from '@material-ui/icons/ViewList';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import SettingsIcon from '@material-ui/icons/Settings';

class BottomTabBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: this.props.path.split('/')[1],
      hidden: false
    };
  }

  render() {
    return (
      <div style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}>
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
              this.props.history.push('/explore');
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
              this.props.history.push('/uploads');
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
              this.props.history.push('/readlists');
            }}
          >
            {this.state.selectedTab === 'readlists' && this.props.content}
          </TabBar.Item>
          <TabBar.Item
            icon={<NotificationsIcon />}
            selectedIcon={<NotificationsActiveIcon />}
            title={this.state.selectedTab === 'notifications' ? 'notifications' : ''}
            key="Notifications"
            selected={this.state.selectedTab === 'notifications'}
            onPress={() => {
              this.setState({
                selectedTab: 'notifications',
              });
              this.props.history.push('/notifications');
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
              this.props.history.push('/settings');
            }}
          >
            {this.state.selectedTab === 'settings' && this.props.content}
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}

export default BottomTabBar;
