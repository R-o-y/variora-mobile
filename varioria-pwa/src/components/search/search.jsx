import _ from 'lodash';
import React from 'react'
import { NavBar, Icon, ActivityIndicator, List, WhiteSpace } from 'antd-mobile';
import { connect } from 'react-redux';
import Toolbar from "@material-ui/core/Toolbar";
import InputBase from "@material-ui/core/InputBase";
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import * as actions from '../../actions';
import TimeAgo from 'react-timeago'
import { StickyContainer } from 'react-sticky';
import ApplyCoterieDialog from './applyCoterieDialog';

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      searchTerm: '',
      applyCoterieDialog: false,
    }
  }

  componentDidMount() {
    this.props.getMyCoteries();
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

  onChange = (e) => {
    e.preventDefault();
    const searchTerm = e.target.value;
    const groupUuid = this.props.match.params.groupUuid;
    this.setState({searchTerm: searchTerm})
    if (searchTerm !== '') {
      if (groupUuid) {
        this.props.getCoterieSearchResults(searchTerm, groupUuid);
        return;
      }
      this.props.getSearchResults(searchTerm);
    }
  };

  renderSearchResultList(results) {
    if (!results || this.state.searchTerm === '') {
      return (
        <div></div>
      )
    }
    const groupUuid = this.props.match.params.groupUuid;
    let data = [];
    let documentsPath = `/documents/`
    if (groupUuid) {
      documentsPath = `/group-documents/`
    }
    if (results.documents) {
      const documents = results.documents.map(element => {
        return ({
          sortKey: element.title,
          jsx: (
            <List.Item
              key={element.slug}
              arrow="horizontal"
              thumb="https://cdn1.iconfinder.com/data/icons/file-types-23/48/PDF-128.png"
              multipleLine
              onClick={() => {this.props.history.push(documentsPath + `${element.slug}`)}}
            >
              {element.title}
              <List.Item.Brief>
                Uploaded by {element.uploader_name}, <TimeAgo date={element.upload_time} />
              </List.Item.Brief>
            </List.Item>
          )
        })
      })
      data = data.concat(documents);
    }
    if (results.readlists) {
      const readlists = results.readlists.map(element => {
        return ({
          sortKey: element.name,
          jsx: (
            <List.Item
              key={element.slug}
              arrow="horizontal"
              thumb="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678072-folder-document-512.png"
              multipleLine
              onClick={() => {this.props.history.push(`readlists/${element.slug}`)}}
            >
              {element.name}
              <List.Item.Brief>
                Created by {element.owner.nickname}, <TimeAgo date={element.create_time} />
              </List.Item.Brief>
            </List.Item>
          )
        })
      })
      data = data.concat(readlists);
    }
    if (results.users) {
      const users = results.users.map(element => {
        return ({
          sortKey: element.nickname,
          jsx: (
            <List.Item
              key={element.pk}
              arrow="horizontal"
              thumb={element.portrait_url}
              multipleLine
              onClick={() => {console.log("user with pk " + element.pk + " clicked")}}
            >
              {element.nickname}
              <List.Item.Brief>
                {element.email_address}
              </List.Item.Brief>
            </List.Item>
          )
        })
      })
      data = data.concat(users);
    }
    if (results.coteries) {
      const coterie = results.coteries.map(element => {
        return ({
          sortKey: element.name,
          jsx: (
            <List.Item
              key={element.pk}
              arrow="horizontal"
              thumb={<PeopleOutlineIcon style={{color: 'grey'}}/>}
              multipleLine
              onClick={(e) => {
                if (this.props.user.administratedCoteries.includes(element.uuid) ||
                  this.props.user.joinedCoteries.includes(element.uuid)) {
                    this.props.history.push(`/groups/${element.uuid}/explore`);
                  }
                else {
                  this.setState({selectedCoterie: element})
                  this.showModal('applyCoterieDialog', e);
                }
              }}
            >
              {element.name}
              <List.Item.Brief>
                {element.description}
              </List.Item.Brief>
            </List.Item>
          )
        })
      })
      data = data.concat(coterie);
    }

    data = data
      .sort((a, b) => ('' + a.sortKey).localeCompare(b.sortKey))
      .map(element => element.jsx);

    return (
      <div>
        <List>
          {data}
        </List>
      </div>
    )
  }

  render() {
    let placeholder = "Search globally.."
    let groupUuid = this.props.match.params.groupUuid;
    if (groupUuid && this.props.coteries[this.props.match.params.groupUuid]) {
      placeholder = "Search within " + this.props.coteries[this.props.match.params.groupUuid]['name'];
      if (placeholder.length > 25) placeholder = placeholder.slice(0, 25) + '...';
    }
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" onClick={() => this.props.history.goBack()}/>}
          style={{
            boxShadow: '0px 1px 3px rgba(28, 28, 28, .1)',
            zIndex: 10000000,
            position: 'relative',
            // borderBottom: '1px solid #c8c8c8',
            // height: 38
          }}
        >
          <span className='document-title'>
            <Toolbar>
              <InputBase
                placeholder={placeholder}
                autoFocus={true}
                value={this.state.searchTerm || ''}
                onChange={this.onChange}
                fullWidth={true}
              />
            </Toolbar>
          </span>
        </NavBar>
        <WhiteSpace />
        <StickyContainer>

        <div style={{ justifyContent: 'center', height: '100%'}}>
          {this.renderSearchResultList(this.props.search)}
        </div>
        </StickyContainer>
        <ApplyCoterieDialog
          open={this.state.applyCoterieDialog}
          onClose={() => this.onClose('applyCoterieDialog')}
          coterie={this.state.selectedCoterie}
          history={this.props.history}
        />
        <WhiteSpace />

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    search: state.search,
    coteries: state.coteries,
    user: state.user,
  };
}

export default connect(mapStateToProps, actions)(Search);
