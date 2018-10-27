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
      uploadedActionModal: false,
      collectedActionModal: false,
      selectedDocument: null,
      loading: true
    };

    this.handleFiles = () => {
      const file = this.finput.files[0]
      // console.log(file)

      const user = this.props.user;
      if ((user === undefined || !user.is_superuser) && !validateDocumentSize(file))
        return false

      var data = new FormData()
      // REPLACE WITH USER INPUT NAME
      data.append('title', file.name)
      data.append('file_upload', file)
      data.append('csrfmiddlewaretoken', getCookie('csrftoken'))
      this.setState({ uploading: true })
      Toast.loading('Loading...')

      if (!this.props.match.params.groupUuid) {
        this.props.uploadDocument(data).then(() => {
          Toast.success('Upload success!', 1);
          this.setState({ uploading: false })
        })
      } else {
        const coterie_pk = this.props.coteries[this.props.match.params.groupUuid].pk;
        data.append('coterie_pk', coterie_pk);
        this.props.uploadCoterieDocument(data).then(() => {
          Toast.success('Upload success!', 1);
          this.setState({ uploading: false })
        })
      }

      this.finput.value = ''
    }
  }

  componentDidMount() {
    let groupUuid = this.props.match.params.groupUuid;
    if (groupUuid) {
      this.props.getMyCoteriesDocument(groupUuid).then(() => {
        this.setState({loading: false})
      })
    } else {
      this.props.getMyDocuments().then(() => {
        this.setState({loading: false})
      })
    }
  }

  componentDidUpdate(prevProps) {
    let newGroupUuid = this.props.match.params.groupUuid;
    if (newGroupUuid !== prevProps.match.params.groupUuid) {
      if (newGroupUuid) {
        this.props.getMyCoteriesDocument(newGroupUuid);
      } else {
        this.props.getMyDocuments();
      }
    }
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

  renderListItem(item, isUpload) {
    return (
      <div key={item.slug}>
        <List.Item
          thumb={<img src='https://cdn1.iconfinder.com/data/icons/file-types-23/48/PDF-128.png' alt='pdf-icon' style={{height: 28, width: 28}} />}
          multipleLine
          onClick={() => {
            if (this.props.match.params.groupUuid)
              this.props.history.push(`/group-documents/${item.slug}`)
            else
              this.props.history.push(`/documents/${item.slug}`)
          }}
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
            this.showModal(isUpload ? 'uploadedActionModal' : 'collectedActionModal', e);
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
      return this.renderListItem(this.props.documents[itemId], true)
    })
    return (
      <List>
        {this.renderAddDocument()}
        {items}
      </List>
    )
  }

  renderCollectedList(list) {
    if (!list.length) {
      return (
        <List>
          <List.Item>
            <div style={{color: 'grey', textAlign:'center' }}>
              You haven't collected any document.
            </div>
          </List.Item>
        </List>
      )
    }
    const items = list.map((itemId) => {
      return this.renderListItem(this.props.documents[itemId], false)
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
            _renderTabBar={this.renderReactSticky}
          >
            <div style={{ justifyContent: 'center', height: '100%', backgroundColor: '#fff' }}>
              {this.renderUploadedList(_.orderBy(this.props.user.uploadedDocuments, (docSlug) => {return this.props.documents[docSlug].upload_time}, 'desc'))}
            </div>
            <div style={{ justifyContent: 'center', height: '100%', backgroundColor: '#fff' }}>
              {this.renderCollectedList(_.orderBy(this.props.user.collectedDocuments, (docSlug) => {return this.props.documents[docSlug].upload_time}, 'desc'))}
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

  renderCollectedActionModal() {
    let currDocument = this.props.documents[this.state.selectedDocument];

    return (
      <Modal
        popup
        visible={this.state.collectedActionModal}
        onClose={() => this.onClose('collectedActionModal')}
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
              this.props.history.push('/add-to-readlists')
            }}>
            <AddIcon style={{height: 18, color:'#1BA39C',marginRight: 20}}/>
            Add To Readlist
          </List.Item>
          {
            this.props.match.params.groupUuid ? null :
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
          }
          <List.Item
            onClick={() => {
              Modal.alert('Uncollect ' + currDocument.title + '?', '', [
                { text: 'Cancel' },
                { text: 'Uncollect', style:{color:'#FF0000'},
                  onPress: () => {
                    this.onClose('collectedActionModal');
                    let data = new FormData();
                    data.append('csrfmiddlewaretoken', getCookie('csrftoken'));
                    this.props.uncollectDocument(currDocument.uncollectUrl, data, currDocument.slug);
                }},
              ])
            }}
          >
            <DeleteIcon style={{height: 18, color:'#e74c3c',marginRight: 20}}/>
            <span style={{color:'#e74c3c'}}>Uncollect</span>
          </List.Item>
        </List>
      </Modal>
    )
  }

  renderUploadedActionModal() {
    let currDocument = this.props.documents[this.state.selectedDocument];
    return (
      <Modal
        popup
        visible={this.state.uploadedActionModal}
        onClose={() => this.onClose('uploadedActionModal')}
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
              this.props.history.push('/add-to-readlists/' + currDocument.slug)
            }}>
            <AddIcon style={{height: 18, color:'#1BA39C',marginRight: 20}}/>
            Add To Readlist
          </List.Item>
          {
            this.props.match.params.groupUuid ? null :
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
          }
          <List.Item
            onClick={() => {this.renderRenameModal(currDocument)}}
          >
            <CreateIcon style={{height: 18, color:'#1BA39C',marginRight: 20}}/>
            Rename
          </List.Item>
          <List.Item
            onClick={() => {
              Modal.alert('Delete ' + currDocument.title + '?', '', [
                { text: 'Cancel' },
                { text: 'Delete', style:{color:'#FF0000'},
                  onPress: () => {
                    this.onClose('uploadedActionModal');
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
    console.log(this.props.documents);

    if (this.state.loading) {
      return (
        <div>
          <Navbar title="Uploads" history={this.props.history} match={this.props.match} />
          <CircularProgress style={{color:"#1BA39C",  marginTop: "38vh"}} size='10vw' thickness={5} />
        </div>
      )
    }

    return (
      <div>
        <Navbar title="Uploads" history={this.props.history} match={this.props.match} />
        {this.renderStickyTab()}
        {this.renderUploadedActionModal()}
        {this.renderCollectedActionModal()}
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
    documents: state.documents,
    coteries: state.coteries,
  };
}

export default connect(mapStateToProps, actions)(Uploads);
