import * as actions from '../actions';

import { Button, List, Modal, NavBar, Icon } from 'antd-mobile';
import React, { Component } from 'react';
import {
  faUserFriends,
  faUserPlus,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import Badge from '@material-ui/core/Badge';
import { getRandomColor } from '../utilities/helper';
import _ from 'lodash';
import { connect } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core'
library.add(faUsers, faUserPlus, faUserFriends)


class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coterieModal: false
    };
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

  onToggle(key) {
    this.setState({
      [key]: !this.state[key]
    });
  }

  getNavbarTitle(tab) {
    let currentCoterie = this.props.coteries[this.props.match.params.groupUuid];
    let currentTab = this.props.path ? this.props.path.split('/').pop() : '';

    if (currentCoterie && currentTab === 'explore') {
      return currentCoterie.name;
    } else if (currentTab) {
      return currentTab.charAt(0).toUpperCase() + currentTab.slice(1);
    } else {
      return currentTab
    }
  }

  goToGroup(uuid) {
    let currentTab = this.props.history.location.pathname.split('/').pop();
    this.props.history.push(`/groups/${uuid}/${currentTab}`);
  }

  renderCoterieItem(coteriePk) {
    let coterie = this.props.coteries[coteriePk];
    return (
      <List.Item
        key={coterie.pk}
        extra={coterie.members.length + " members"}
        align="top"
        style={{backgroundColor: this.props.match.params.groupUuid === coterie.uuid ? '#edf9f6' : ''}}
        onClick={() => {
          this.goToGroup(coterie.uuid);
          this.onClose('coterieModal');
        }}
      >
        {coterie.name}
        <List.Item.Brief>{coterie.description}</List.Item.Brief>
      </List.Item>
    );
  }

  render() {
    const hasAdministratedCoteries = !_.isEmpty(this.props.user.administratedCoteries);
    const hasJoinedCoteries = !_.isEmpty(this.props.user.joinedCoteries);
    const currentCoterie = this.props.coteries[this.props.match.params.groupUuid];

    return (
        <NavBar
          mode="light"
          style={{
            boxShadow: '0px 1px 3px rgba(28, 28, 28, .1)',
            zIndex: 10000000,
            position: 'fixed',
            width: '98%',
            paddingRight: 8,
            height: 50
          }}
          leftContent={
            this.props.user.portrait_url &&
            <Avatar
              alt="avatar"
              style={{width: 28, height: 28}}
              src={this.props.user.portrait_url}
              onClick={(e) => {
                this.props.history.push('/profile')
              }}
            />
          }
          rightContent={[
            <Icon
              key="0"
              type="search"
              style={{ marginRight: '16px' }}
              onClick={(e) => {this.props.match.params.groupUuid ? this.props.history.push('/search/' + this.props.match.params.groupUuid) : this.props.history.push('/search')}}
            />,
            <div key = "1">
            {
              currentCoterie
              ?
              <Badge
                color="primary"
                classes={{ badge: this.props.classes.badge }}
                badgeContent={
                  <Avatar className={this.props.classes.avatar}
                    style={{backgroundColor: getRandomColor(this.props.match.params.groupUuid)}}>
                    <span style={{fontSize: '80%'}}>
                        {this.props.coteries[this.props.match.params.groupUuid] ? this.props.coteries[this.props.match.params.groupUuid]['name'].charAt(0) : ''}
                    </span>
                  </Avatar>}
              >
                <PeopleOutlineIcon
                  style={{color: "rgb(101, 119, 134)", height: 25, width: 25}}
                  onClick={(e) => {
                    if (!this.props.user || !this.props.user.is_authenticated) {
                      return (
                        Modal.alert('', 'You need to sign in to view and switch groups', [
                          { text: 'Cancel', onPress: () => {} },
                          { text: 'Go login', onPress: () => this.props.history.push('/sign-in') },
                        ])
                      )
                    }
                    this.props.getMyCoteries();
                    this.onToggle('coterieModal');
                  }}
                />
              </Badge>
              :
              <PeopleOutlineIcon
                style={{color: "rgb(101, 119, 134)", height: 25, width: 25}}
                onClick={(e) => {
                  if (!this.props.user || !this.props.user.is_authenticated) {
                    return (
                      Modal.alert('', 'You need to sign in to view and switch groups', [
                        { text: 'Cancel', onPress: () => {} },
                        { text: 'Go login', onPress: () => this.props.history.push('/sign-in') },
                      ])
                    )
                  }
                  this.props.getMyCoteries();
                  this.onToggle('coterieModal');
                }}
              />
            }

            <Modal
              popup
              visible={this.state.coterieModal}
              onClose={() => this.onClose('coterieModal')}
              animationType="slide-up"
            >
              <List
                renderHeader={() =>
                  <b style={{color: "#1BA39C"}}>SWITCH GROUP</b>
                }
                className="popup-list"
              >
              <List
                style={{overflow: 'auto', maxHeight: '60vh'}}>
                <List.Item
                  style={{backgroundColor: this.props.match.params.groupUuid ? '' : '#edf9f6'}}
                  onClick={() => {
                    let currentTab = this.props.history.location.pathname.split('/').pop();
                    this.props.history.push(`/${currentTab}`);
                    this.onClose('coterieModal');
                  }}
                >
                  Public
                </List.Item>
                { !hasJoinedCoteries && !hasAdministratedCoteries &&
                  <div>You have not joined any groups.</div>
                }
                { hasAdministratedCoteries &&
                  <List
                    renderHeader={() =>
                      <b>Administrated</b>
                    }
                  >
                    {this.props.user.administratedCoteries.map((coteriePk) => {
                      return this.renderCoterieItem(coteriePk);
                    })}
                  </List>
                }
                { hasJoinedCoteries &&
                  <List
                    renderHeader={() =>
                      <b>Joined</b>
                    }
                  >
                    {this.props.user.joinedCoteries.map((coteriePk) => {
                      return this.renderCoterieItem(coteriePk);
                    })}
                  </List>
                }
                </List>
                <List.Item>
                  <Button
                    type="primary"
                    style={{backgroundColor: "#1BA39C"}}
                    onClick={() => {
                      this.onClose('coterieModal');
                      this.props.history.push("/create-coterie-form");
                    }}
                  >Create a new group</Button>
                </List.Item>
              </List>
            </Modal>
          </div>
          ]
          }
        >
          <span className='navbar-title'>{this.getNavbarTitle(this.props.path)}</span>
        </NavBar>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    coteries: state.coteries
  };
}

const styles = theme => ({
  badge: {
    top: 6,
    right: -16,
    border: `1px solid white`,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
});
export default connect(mapStateToProps, actions)(withStyles(styles)(Navbar));
