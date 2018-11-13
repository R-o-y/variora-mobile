import * as actions from '../../actions';

import { Icon, List, Modal, Tabs, Toast, WhiteSpace } from 'antd-mobile';
import React, { Component } from 'react';
import { Sticky, StickyContainer } from 'react-sticky';
import { copyToClipboard, getCookie, validateDocumentSize } from '../../utilities/helper';

import AddIcon from '@material-ui/icons/AddBoxOutlined';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import ConfirmationDialog from './confirmation_dialog';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Navbar from '../nav_bar';
import NoPermission from '../error_page/no_permission';
import NotSignedIn from '../error_page/not_signed_in';
import ShareIcon from '@material-ui/icons/Share';
import TextField from '@material-ui/core/TextField';
import _ from 'lodash';
import { connect } from 'react-redux';
import moment from 'moment';
import pdfIcon from '../../utilities/pdf.png';

class Uploads extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedActionModal: false,
      collectedActionModal: false,
      uploadDialog: false,
      chooseReadlistRadio: false,
      uploadedFile: null,
      selectedDocument: null,
      loading: true,
    };

    this.handleFileDialog = () => {
      const file = this.finput.files[0];
      this.setState({uploadDialog: true, uploadedFile: file});
    }

    this.handleConfirmationDialogClose = value => {
      this.setState({ value, chooseReadlistRadio: false });
    };

    this.handleFileSubmit = () => {
      const file = this.state.uploadedFile;
      const filenameWithoutExtension = file.name.split('.').slice(0, -1).join('.');
      const filename = this.state.name ? this.state.name : filenameWithoutExtension;
      const readlist = this.state.value ? this.props.readlists[this.state.value].uuid : undefined;

      if (file.type !== 'application/pdf') {
        Toast.fail('File type is not PDF', 1.8)
        return
      }

      const user = this.props.user;
      if ((user === undefined || !user.is_superuser) && !validateDocumentSize(file))
        return false

      if (filename.includes('.')) {
        Toast.fail('Special characters are not allowed in file name', 2.8)
        return
      }

      var data = new FormData()
      // TODO: REPLACE WITH USER INPUT NAME
      data.append('title', filename)
      data.append('file_upload', file)
      data.append('csrfmiddlewaretoken', getCookie('csrftoken'))
      this.setState({ uploading: true })
      Toast.loading('Loading...')

      if (!this.props.match.params.groupUuid) {
        this.props.uploadDocument(data)
        .then((response) => {
          let pk = response.payload.data.pk;
          if (readlist) {
            let readlistData = new FormData();
            readlistData.append('csrfmiddlewaretoken', getCookie('csrftoken'));
            readlistData.append('add_readlists[]', readlist);
            this.props.documentChangeReadlists(pk, readlistData)
            .catch((error) => {
              Toast.fail('Add to readlist failed!', 2);
            })
          }
        })
        .then(() => {
          Toast.success('Upload success!', 1);
          this.setState({ uploading: false })
        })
        .catch((error) => {
          Toast.fail('Upload failed!', 2);
        })
      } else {
        const coterie_pk = this.props.coteries[this.props.match.params.groupUuid].pk;
        data.append('coterie_pk', coterie_pk);
        this.props.uploadCoterieDocument(data).then(() => {
          // TODO: NEED TO ADD READLIST FOR GROUP ALSO
          Toast.success('Upload success!', 1);
          this.setState({ uploading: false })
        }).catch((error) => {
          Toast.fail('Upload failed!', 1);
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
      }).catch((error) => {
        this.setState({loading: false})
      })
    } else {
      this.props.getMyDocuments().then(() => {
        this.setState({loading: false})
      }).catch((error) => {
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
          thumb={<img src={pdfIcon} alt='pdf-icon' style={{height: 28, width: 24}} />}
          multipleLine
          onClick={() => {
            const groupUuid = this.props.match.params.groupUuid
            if (groupUuid) {
              const coterie = this.props.coteries[groupUuid]
              const coterieId = coterie.pk
              this.props.history.push(`/coteries/${coterieId}/documents/${item.slug}`)
            } else
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
            swipeable
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
          {
            // ===== temporarily disable add to list if in group =====
            this.props.match.params.groupUuid ? null :
            // =======================================================
            <List.Item
              onClick={() => {
                this.props.history.push('/add-to-readlists')
              }}>
              <AddIcon style={{height: 18, color:'#1BA39C',marginRight: 20}}/>
              Add To Readlist
            </List.Item>
          }
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
        {
          <List.Item
            onClick={() => {
              const groupUuid = this.props.match.params.groupUuid
              if (groupUuid) {
                this.props.history.push('/add-to-readlists/' + groupUuid + "/" + currDocument.slug)
              } else {
                this.props.history.push('/add-to-readlists/' + currDocument.slug)
              }
            }}>
            <AddIcon style={{height: 18, color:'#1BA39C',marginRight: 20}}/>
            Add To Readlist
          </List.Item>
        }
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

  renderFileItem(file) {
    if (!file) return (<div>File upload failed!</div>)
    return (
      <ListItem style={{paddingLeft: 0, paddingRight: 0}}>
        <img src={pdfIcon} alt='pdf-icon' style={{height: 28, width: 24}} />
        <ListItemText
          primary={<div style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>{file.name}</div>}
          secondary={"Modified " + moment(file.lastModified).format('MMM D, HH:mm')}
        />
      </ListItem>
    )
  }

  renderFileNameTextField(file) {
    if (!file) return (<div></div>)
    return (
      <TextField
        multiline
        margin="dense"
        id="name"
        label="Name"
        defaultValue={file.name.split('.').slice(0, -1).join('.')}
        fullWidth
        onChange={(e) => this.setState({name: e.target.value})}
      />
    )
  }

  renderReadlistSelect(){
    return (
      <div>
        <ListItem
          style={{padding: 0}}
          button
          divider
          aria-haspopup="true"
          onClick={(e) => {this.showModal('chooseReadlistRadio', e)}}
        >
          <ListItemText primary="Readlist"
            secondary={this.state.value ?
              this.props.readlists[this.state.value].name :
              'Click to select... (optional)'
            }
          />
        </ListItem>
        <ConfirmationDialog
          open={this.state.chooseReadlistRadio}
          onClose={this.handleConfirmationDialogClose}
          value={this.state.value}
        />
      </div>
    )
  }

  renderUploadDialog() {
    let file = this.state.uploadedFile;
    return (
      <Dialog
        onClose={() => {this.onClose('uploadDialog'); this.finput.value = ''}}
        open={this.state.uploadDialog}
        aria-labelledby="simple-dialog-title">
        <DialogTitle id="simple-dialog-title">Upload</DialogTitle>
        <DialogContent>
          {this.renderFileItem(file)}
          {this.renderFileNameTextField(file)}
          {!this.props.match.params.groupUuid && this.renderReadlistSelect()}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              this.onClose('uploadDialog');
              this.finput.value = '';
            }}
            color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              this.onClose('uploadDialog');
              this.handleFileSubmit();
              this.finput.value = '';
            }}
            color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  render() {
    if (this.state.loading) {
      return (
        <CircularProgress style={{color:"#1BA39C",  marginTop: "38vh"}} size='10vw' thickness={5} />
      )
    }

    if (!this.props.user || !this.props.user.is_authenticated) {
      return (
        <NotSignedIn history={this.props.history}/>
      )
    }

    const currentCoterie = this.props.coteries[this.props.match.params.groupUuid];

    if (this.props.match.params.groupUuid && !currentCoterie) {
      return (
        <NoPermission />
      )
    }

    return (
      <div>
        {this.renderStickyTab()}
        {this.renderUploadedActionModal()}
        {this.renderCollectedActionModal()}
        {this.renderUploadDialog()}
        <input
          ref={item => this.finput = item}
          style={{ visibility: 'hidden' }}
          type={'file'}
          accept="application/pdf"
          onChange={async () => this.handleFileDialog()}>
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
    readlists: state.readlists,
  };
}

export default connect(mapStateToProps, actions)(Uploads);
