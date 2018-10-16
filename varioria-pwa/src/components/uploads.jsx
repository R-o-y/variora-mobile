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
import { Button, Icon, List, Modal, Tabs, Toast, WhiteSpace } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';
import { getCookie, copyToClipboard, validateDocumentSize } from '../utilities/helper';

class Uploads extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actionModal: false,
      selectedDocument: null,
    };

    this.handleFiles = () => {
      const file = this.finput.files[0]
      console.log(file)

      const user = this.props.user;
      if ((user == undefined || !user.is_superuser) && !validateDocumentSize(file))
        return false

      var data = new FormData()
      // REPLACE WITH USER INPUT NAME
      data.append('title', file.name)
      data.append('file_upload', file)
      data.append('csrfmiddlewaretoken', getCookie('csrftoken'))
      this.setState({ uploading: true })
      // NOT SURE HOW TO HANDLE UPLOADING
      Toast.loading('Loading...')
        this.props.uploadDocument(data).then(() => {
          console.log('ha');
          Toast.success('Upload success!', 1);
          this.setState({ uploading: false })
        }).catch(() => {
          Toast.fail('Upload failed!', 1);
          this.setState({ uploading: false })
        })

      this.finput.value = ''
    }
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
          thumb={<img src='https://cdn1.iconfinder.com/data/icons/file-types-23/48/PDF-128.png' alt='pdf-icon' style={{height: 28, width: 28}} />}
          multipleLine
          onClick={() => {this.props.history.push(`/documents/${item.slug}`)}}
        >
          <div style={{width: '88%', overflow: 'hidden', textOverflow: 'ellipsis'}}>
            {item.title}
          </div>
          <List.Item.Brief>{moment(item.upload_time).format("MMMM Do YYYY, h:mm a")}</List.Item.Brief>
        </List.Item>
        <Icon type="ellipsis"
          style={{position: 'absolute', width:'10%', marginTop: -50, right: 5, color:'#a8a8a8', zIndex: 1}}
          onClick={(e) => {
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
        onClick={() => this.finput.click()}
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

  renderRenameModal(currDocument) {
    return (
      Modal.prompt('Rename', 'Enter the new name', [
      { text: 'Cancel' },
      { text: 'Confirm', onPress: value => {
        let data = new FormData();
        data.append('new_title', value);
        data.append('csrfmiddlewaretoken', getCookie('csrftoken'));
        this.props.renameDocument(currDocument.renameUrl, data);
      }},
    ], 'default', currDocument.title)
    )
  }

  renderActionModal() {
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
            <b style={{ color: "#1BA39C"}}>{currDocument.title}</b>
          }
          className="popup-list"
        >
          <List.Item
            onClick={() => {
              const location = window.location;
              const url = [location.protocol, '//', location.host, '/documents/', currDocument.slug].join('');
              copyToClipboard(url);
              Toast.success('Copied to clipboard!', 1);}}
          >
            <ShareIcon style={{height: 18, color:'#1BA39C',marginRight: 20}}/>
            Share
          </List.Item>
          <List.Item
            onClick={() => {this.renderRenameModal(currDocument)}}
          >
            <CreateIcon style={{height: 18, color:'#1BA39C',marginRight: 20}}/>
            Remane
          </List.Item>
          <List.Item
            onClick={() => {
              Modal.alert('Delete ' + currDocument.title + '?', '', [
                { text: 'Cancel' },
                { text: 'Delete', style:{color:'#FF0000'},
                  onPress: () => {
                    this.onClose('actionModal');
                    let data = new FormData();
                    data.append('csrfmiddlewaretoken', getCookie('csrftoken'));
                    this.props.deleteDocument(currDocument.delete_url, data, currDocument.slug);
                }},
              ])
            }}
          >
            <DeleteIcon style={{height: 18, color:'#e74c3c',marginRight: 20}}/>
            <span style={{color:'#e74c3c'}}>Delete</span>
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
          <CircularProgress style={{color:"#1BA39C",  marginTop: "38vh"}} size='10vw' thickness={5} />
        </div>
      );
    }

    return (
      <div>
        <Navbar title="Uploads" history={this.props.history} />
        {this.renderStickyTab()}
        {this.renderActionModal()}
        <input
          ref={item => this.finput = item}
          style={{ visibility: 'hidden' }}
          type={'file'}
          accept="application/pdf"
          onChange={async () => this.handleFiles()}>
        </input>
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
