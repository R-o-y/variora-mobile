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
      selectedTab: this.props.path.substr(1),
      hidden: false
    };
  }

  tabitem(title, icon, selectedIcon) {
    return (
      <TabBar.Item
        icon={icon}
        selectedIcon={selectedIcon ? selectedIcon : icon}
        title={this.state.selectedTab === title ? title : ''}
        key={title}
        selected={this.state.selectedTab === title}
        onPress={() => {
          this.setState({
            selectedTab: title,
          });
          this.props.history.push('/'+title);
        }} />
    )
  }

  render() {
    return (
      <div style={{ position: 'fixed', height: 'auto', width: '100%', bottom: '0' }}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#1BA39C"
          barTintColor="white"
          hidden={this.state.hidden}
        >
          {this.tabitem('explore', <ExploreIcon />)}
          {this.tabitem('uploads', <UploadIcon />)}
          {this.tabitem('readlists', <ReadlistIcon />)}
          {this.tabitem('notifications', <NotificationsIcon />, <NotificationsActiveIcon />)}
          {this.tabitem('settings', <SettingsIcon />)}
        </TabBar>
      </div>
    );
  }
}

export default BottomTabBar;
