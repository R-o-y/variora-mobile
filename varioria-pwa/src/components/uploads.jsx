import _ from 'lodash';
import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Navbar from './nav_bar';
import moment from 'moment';

import { Tabs, WhiteSpace, List } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';

class Uploads extends Component {

  componentDidMount() {
    this.props.getMyDocuments();
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

  renderListItem(item) {
    return (
      <List.Item
        key={item.slug}
        arrow="horizontal"
        thumb="https://cdn1.iconfinder.com/data/icons/file-types-23/48/PDF-128.png"
        multipleLine
        onClick={() => {this.props.history.push(`/documents/${item.slug}`)}}
      >
        {item.title}
        <List.Item.Brief>{moment(item.upload_time).format("MMMM Do YYYY, h:mm a")}</List.Item.Brief>
      </List.Item>
    )
  }

  renderDocumentList(list) {
    const items = list.map((itemId) => {
      return this.renderListItem(this.props.documents[itemId])
    })
    return (
      <List>
        {items}
      </List>
    )
  }

  renderStickyTab() {
    return (
      <div>
        <WhiteSpace />
        <StickyContainer>
          <Tabs
            tabs={[{ title: "Uploaded"}, { title: "Collected"}]}
            initalPage={'t2'}
            renderTabBar={this.renderReactSticky}
          >
            <div style={{ justifyContent: 'center', height: '100%', backgroundColor: '#fff' }}>
              {this.renderDocumentList(this.props.user.uploadedDocuments)}
            </div>
            <div style={{ justifyContent: 'center', height: '100%', backgroundColor: '#fff' }}>
              {this.renderDocumentList(this.props.user.collectedDocuments)}
            </div>
          </Tabs>
        </StickyContainer>
        <WhiteSpace />
      </div>
    )
  }

  render() {
    if (_.isEmpty(this.props.documents)) {
      return (
        <div>
          <Navbar title="Uploads" history={this.props.history} />
          <CircularProgress style={{color:"#1BA39C",  marginTop: "40vh"}} size={100} thickness={5} />
        </div>
      );
    }

    return (
      <div>
        <Navbar title="Uploads" history={this.props.history} />
        {this.renderStickyTab()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    documents: state.documents
  };
}

export default connect(mapStateToProps, actions)(Uploads);
