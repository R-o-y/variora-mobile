import _ from 'lodash';
import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Navbar from './nav_bar';
import moment from 'moment';

import { Tabs, WhiteSpace, List } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';

class Readlists extends Component {

  componentDidMount() {
    this.props.getMyReadlists();
  }

  renderReactSticky(props) {
    return (
      <Sticky>
        {({ style }) =>
          <div style={{ ...style, zIndex: 1 }}>
            <Tabs.DefaultTabBar {...props} />
          </div>
        }
      </Sticky>
    )
  }

  renderReadlist(list) {
    if (_.isEmpty(list)) {
      return (
        "No Lists Items found!"
      )
    }
    const data = list.map(element => {
      return (
        <List.Item
          arrow="horizontal"
          thumb="https://cdn1.iconfinder.com/data/icons/file-types-23/48/PDF-128.png"
          multipleLine
          onClick={() => {this.props.history.push(`/readlist/${element.id}`)}}
        >
          {element.name}
          <List.Item.Brief>{moment(element.create_time).format("MMMM Do YYYY, h:mm a")}</List.Item.Brief>
        </List.Item>
      )
    })
    return (
      <div>
        <List>
          {data}
        </List>
      </div>
    )
  }

  renderStickyTab() {
    return (
      <div>
        <WhiteSpace />
        <StickyContainer>
          <Tabs
            tabs={[{ title: "Created"}, { title: "Collected"}]}
            initalPage={'t2'}
            renderTabBar={this.renderReactSticky}
          >
            <div style={{ justifyContent: 'center', height: '100%', backgroundColor: '#fff' }}>
              {this.renderReadlist(this.props.readlists.createdReadlists)}
            </div>
            <div style={{ justifyContent: 'center', height: '100%', backgroundColor: '#fff' }}>
              {this.renderReadlist(this.props.readlists.collectedReadlists)}
            </div>
          </Tabs>
        </StickyContainer>
        <WhiteSpace />
      </div>
    )
  }

  render() {
    if (_.isEmpty(this.props.readlists)) {
      return (
        <div>
          <Navbar title="Readlists" />
          <CircularProgress style={{color:"#1BA39C",  marginTop: "40vh"}} size={100} thickness={5} />
        </div>
      );
    }

    return (
      <div>
        <Navbar title="Readlists" />
        {this.renderStickyTab()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    readlists: state.readlists
  };
}


export default connect(mapStateToProps, actions)(Readlists);
