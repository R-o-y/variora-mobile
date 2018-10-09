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
      selectedTab: 'Explore',
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
            title={this.state.selectedTab === 'Explore' ? 'Explore' : ''}
            key="Explore"
            selected={this.state.selectedTab === 'Explore'}
            onPress={() => {
              this.setState({
                selectedTab: 'Explore',
              });
              this.props.history.push('/explore');
            }}
          >
            {this.props.content}
          </TabBar.Item>
          <TabBar.Item
            icon={<UploadIcon />}
            selectedIcon={<UploadIcon />}
            title={this.state.selectedTab === 'Uploads' ? 'Uploads' : ''}
            key="Uploads"
            selected={this.state.selectedTab === 'Uploads'}
            onPress={() => {
              this.setState({
                selectedTab: 'Uploads',
              });
              this.props.history.push('/uploads');
            }}
          >
            {this.props.content}
          </TabBar.Item>
          <TabBar.Item
            icon={<ReadlistIcon />}
            selectedIcon={<ReadlistIcon />}
            title={this.state.selectedTab === 'Readlists' ? 'Readlists' : ''}
            key="Readlists"
            selected={this.state.selectedTab === 'Readlists'}
            onPress={() => {
              this.setState({
                selectedTab: 'Readlists',
              });
              this.props.history.push('/readlists');
            }}
          >
            {this.props.content}
          </TabBar.Item>
          <TabBar.Item
            icon={<NotificationsIcon />}
            selectedIcon={<NotificationsActiveIcon />}
            title={this.state.selectedTab === 'Notifications' ? 'Notifications' : ''}
            key="Notifications"
            selected={this.state.selectedTab === 'Notifications'}
            onPress={() => {
              this.setState({
                selectedTab: 'Notifications',
              });
              this.props.history.push('/notifications');
            }}
          >
            {this.props.content}
          </TabBar.Item>
          <TabBar.Item
            icon={<SettingsIcon />}
            selectedIcon={<SettingsIcon />}
            title={this.state.selectedTab === 'Settings' ? 'Settings' : ''}
            key="Settings"
            selected={this.state.selectedTab === 'Settings'}
            onPress={() => {
              this.setState({
                selectedTab: 'Settings',
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
