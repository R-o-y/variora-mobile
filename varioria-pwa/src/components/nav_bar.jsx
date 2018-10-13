import _ from 'lodash';
import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { NavBar, Modal, List, Button } from 'antd-mobile';
import Avatar from '@material-ui/core/Avatar';
import GroupIcon from '@material-ui/icons/Group';


class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coterieModal: false,
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

  renderCoterieItem(coteriePk) {
    let coterie = this.props.coteries[coteriePk];
    return (
      <List.Item
        key={coterie.pk}
        extra={coterie.members.length + " members"}
        align="top"
        onClick={() => {
          this.props.switchCoterie(coterie.pk);
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

    return (
      <div>
        <NavBar
          mode="light"
          leftContent={
            <Avatar
              alt="avatar"
              style={{width: 30, height: 30}}
              src={this.props.user.portrait_url}
              onClick={(e) => {console.log("User avatar clicked")}}
            />
          }
          rightContent={
            <div>
              <GroupIcon
                style={{color: "#1BA39C", height: 35, width: 35}}
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
                    <Button type="primary"
                      style={{backgroundColor: "#1BA39C"}}
                      onClick={() => this.onClose('coterieModal')}
                    >Create a new group</Button>
                  </List.Item>
                </List>
              </Modal>
            </div>
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
