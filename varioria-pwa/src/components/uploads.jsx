import _ from 'lodash';
import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import FileIcon from '@material-ui/icons/DescriptionOutlined';
import FileNewIcon from '@material-ui/icons/ControlPoint';
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
        thumb={<FileIcon />}
        multipleLine
        onClick={() => {this.props.history.push(`/documents/${item.slug}`)}}
      >
        {item.title}
        <List.Item.Brief>{moment(item.upload_time).format("MMMM Do YYYY, h:mm a")}</List.Item.Brief>
      </List.Item>
    )
  }

  renderDocumentList(list, createPrompt = null) {
    const items = list.map((itemId) => {
      return this.renderListItem(this.props.documents[itemId])
    })
    if (createPrompt) {
      var create_item = <List.Item
        key=""//What is this key?
        arrow="empty"
        thumb={<FileNewIcon />}
        onClick={() => {this.props.history.push(`/explore`)}} //TODO: Need to toggle action to open upload/modal on click.
      >
        New
        <List.Item.Brief>{createPrompt}</List.Item.Brief>
      </List.Item>
    }

    return (
      <List>
        {create_item}
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
              {this.renderDocumentList(this.props.user.uploadedDocuments, 'Upload a new PDF', )}
            </div>
            <div style={{ justifyContent: 'center', height: '100%', backgroundColor: '#fff' }}>
              {this.renderDocumentList(this.props.user.collectedDocuments, 'Start a new Collection', )}
            </div>
          </Tabs>
        </StickyContainer>
        <WhiteSpace />
      </div>
    )
  }

  render() {
    return (
      //check for documents
      _.isEmpty(this.props.documents) ? (
        //show loading if empty
        <CircularProgress style={{color:"#1BA39C",  marginTop: "40vh"}} size={100} thickness={5} />
      ) : (
        //render documents if exist
        this.renderStickyTab()
      )
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
