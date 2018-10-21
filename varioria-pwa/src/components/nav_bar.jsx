import * as actions from '../actions';

import { Button, List, Modal, NavBar, Icon } from 'antd-mobile';
import React, { Component } from 'react';
import {
  faUserFriends,
  faUserPlus,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'

import Avatar from '@material-ui/core/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import _ from 'lodash';
import { connect } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core'
library.add(faUsers, faUserPlus, faUserFriends)


class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coterieModal: false,
      searchMode: false
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

  getNewPathname(uuid) {
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
        onClick={() =>
          Modal.alert('Switch to group ' + coterie.name + '?', '', [
            { text: 'Cancel' },
            { text: 'OK', style:{color:'#1BA39C'},
              onPress: () => {
              this.getNewPathname(coterie.uuid);
              this.onClose('coterieModal');
            }},
          ])
        }
      >
        {coterie.name}
        <List.Item.Brief>{coterie.description}</List.Item.Brief>
      </List.Item>
    );
  }

  render() {
    const hasAdministratedCoteries = !_.isEmpty(this.props.user.administratedCoteries);
    const hasJoinedCoteries = !_.isEmpty(this.props.user.joinedCoteries);
    console.log(this.props)
    return (
      <div>
        <NavBar
          mode="light"
          style={{
            boxShadow: '0px 1px 3px rgba(28, 28, 28, .1)',
            zIndex: 10000000,
            position: 'relative',
          }}
          leftContent={
            <Avatar
              alt="avatar"
              style={{width: 28, height: 28}}
              src={this.props.user.portrait_url}
              onClick={(e) => {console.log("User avatar clicked")}}
            />
          }
          rightContent={[
            <Icon 
              key="0" 
              type="search" 
              style={{ marginRight: '16px' }} 
              onClick={(e) => {this.props.history.push('/search')}} />,
            <div key = "1">
            <PeopleOutlineIcon
              style={{color: "rgb(101, 119, 134)", height: 25, width: 25}}
              onClick={(e) => {
                this.props.getMyCoteries();
                this.showModal('coterieModal', e);
              }}
            />
            <Modal
              popup
              visible={this.state.coterieModal}
              onClose={() => this.onClose('coterieModal')}
              animationType="slide-up"
              style={{overflow: 'auto', maxHeight: '80vh'}}
            >
              <List
                renderHeader={() =>
                  <b style={{color: "#1BA39C"}}>SWITCH GROUP</b>
                }
                className="popup-list"
              >
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
          {this.props.title}
        </NavBar>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    coteries: state.coteries
  };
}

export default connect(mapStateToProps, actions)(Navbar);
