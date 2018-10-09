import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, TabBar } from 'antd-mobile';
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
      selectedTab: this.props.path.substr(1),
      hidden: false
    };
  }

  renderContent(pageText) {
    return (
      <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
        <div style={{ paddingTop: 60 }}>Clicked “{pageText}” tab， show “{pageText}” information</div>
        <a style={{ display: 'block', marginTop: 40, marginBottom: 600, color: '#108ee9' }}
          onClick={(e) => {
            e.preventDefault();
            this.setState({
              hidden: !this.state.hidden,
            });
          }}
        >
          Click to show/hide tab-bar
        </a>
      </div>
    );
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
            {this.props.content}
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
            {this.props.content}
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
            {this.props.content}
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
            {this.props.content}
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
            {this.props.content}
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}

export default BottomTabBar;
