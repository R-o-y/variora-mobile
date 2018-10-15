import _ from 'lodash';
import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Navbar from './nav_bar';
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/AddBoxOutlined';
import CreateIcon from '@material-ui/icons/Create';
import ShareIcon from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import { Button, Icon, List, Modal, Tabs, WhiteSpace } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';

class Uploads extends Component {

  constructor(props) {
    super(props);
    this.state = {
      actionModal: false,
      selectedDocument: null,
    };
  }

  componentDidMount() {
    this.props.getMyDocuments();
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
      <div key={item.slug}>
        <List.Item
          thumb="https://cdn1.iconfinder.com/data/icons/file-types-23/48/PDF-128.png"
          multipleLine
          onClick={() => {this.props.history.push(`/documents/${item.slug}`)}}
        >
          {item.title}
          <List.Item.Brief>{moment(item.upload_time).format("MMMM Do YYYY, h:mm a")}</List.Item.Brief>
        </List.Item>
        <Icon type="ellipsis"
          style={{position: 'absolute', width:'10%', marginTop: -50, right: 5, color:'#a8a8a8', zIndex: 1}}
          onClick={(e) => {
            console.log('clicked ellipsis ' + item.slug);
            this.setState({selectedDocument: item.slug})
            this.showModal('actionModal', e);
          }}/>
      </div>
    )
  }

  renderAddDocument() {
    return (
      <List.Item
        thumb={<AddIcon style={{color:'grey'}} />}
        onClick={() => {console.log('Upload document clicked')}}
      >
        <div style={{color:'grey'}}>New document</div>
        <List.Item.Brief>Click to upload...</List.Item.Brief>
      </List.Item>
    )
  }

  renderUploadedList(list) {
    const items = list.map((itemId) => {
      return this.renderListItem(this.props.documents[itemId])
    })
    return (
      <List>
        {this.renderAddDocument()}
        {items}
      </List>
    )
  }

  renderCollectedList(list) {
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
            swipeable={false}
            renderTabBar={this.renderReactSticky}
          >
            <div style={{ justifyContent: 'center', height: '100%', backgroundColor: '#fff' }}>
              {this.renderUploadedList(this.props.user.uploadedDocuments)}
            </div>
            <div style={{ justifyContent: 'center', height: '100%', backgroundColor: '#fff' }}>
              {this.renderCollectedList(this.props.user.collectedDocuments)}
            </div>
          </Tabs>
        </StickyContainer>
        <WhiteSpace />
      </div>
    )
  }

  renderActionModal() {
    console.log(this.props);
    let currDocument = this.props.documents[this.state.selectedDocument];

    return (
      <Modal
        popup
        visible={this.state.actionModal}
        onClose={() => this.onClose('actionModal')}
        animationType="slide-up"
      >
        <List
          renderHeader={() =>
            <b style={{color: "#1BA39C"}}>{currDocument.title}</b>
          }
          className="popup-list"
        >
          <List.Item
            onClick={() => {console.log('Share clicked' + currDocument.slug)}}
          >
            <ShareIcon style={{height: 15, color:'#1BA39C',marginRight: 20}}/>
            Share
          </List.Item>
          <List.Item
            onClick={() => {console.log('Rename clicked' + currDocument.slug)}}
          >
            <CreateIcon style={{height: 15, color:'#1BA39C',marginRight: 20}}/>
            Remane
          </List.Item>
          <List.Item
            onClick={() => {console.log('Delete clicked' + currDocument.slug)}}
          >
            <DeleteIcon style={{height: 15, color:'#FF0000',marginRight: 20}}/>
            <span style={{color:'#FF0000'}}>Delete</span>
          </List.Item>
        </List>
      </Modal>
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
        {this.renderActionModal()}
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
