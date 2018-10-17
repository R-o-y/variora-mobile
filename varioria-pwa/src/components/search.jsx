import _ from 'lodash';
import React from 'react'
import { NavBar, Icon, ActivityIndicator, List, WhiteSpace } from 'antd-mobile';
import { connect } from 'react-redux';
import Toolbar from "@material-ui/core/Toolbar";
import InputBase from "@material-ui/core/InputBase";
import * as actions from '../actions';
import TimeAgo from 'react-timeago'
import { StickyContainer } from 'react-sticky';

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      searchTerm: ''
    }
  }

  onChange = (e) => {
    e.preventDefault();
    const searchTerm = e.target.value;
    console.log(searchTerm, "onChange")
    this.setState({searchTerm: searchTerm})
    if (searchTerm !== '') {
      this.props.getSearchResults(searchTerm);
    }
  };

  renderSearchResultList(results) {
    if (!results || this.state.searchTerm === '') {
      return (
        <div></div>
      )
    }
    let data = [];
    if (results.documents) {
      const documents = results.documents.map(element => {
        return (
          <List.Item
            key={element.slug}
            arrow="horizontal"
            thumb="https://cdn1.iconfinder.com/data/icons/file-types-23/48/PDF-128.png"
            multipleLine
            onClick={() => {this.props.history.push(`/documents/${element.slug}`)}}
          >
            {element.title}
            <List.Item.Brief>
              Uploaded by {element.uploader_name}, <TimeAgo date={element.upload_time} />
            </List.Item.Brief>
          </List.Item>
        )
      })
      data = data.concat(documents);
    }
    if (results.readlists) {
      const readlists = results.readlists.map(element => {
        return (
          <List.Item
            key={element.slug}
            arrow="horizontal"
            thumb="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678072-folder-document-512.png"
            multipleLine
            onClick={() => {this.props.history.push(`${element.url}`)}}
          >
            {element.name}
            <List.Item.Brief>
              Created by {element.owner.nickname}, <TimeAgo date={element.create_time} />
            </List.Item.Brief>
          </List.Item>
        )
      })
      data = data.concat(readlists);
    }
    console.log(data);
    return (
      <div>
        <List>
          {data}
        </List>
      </div>
    )
  }

  render() {
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
                placeholder="Search" 
                autoFocus={true}
                value={this.state.searchTerm || ''}
                onChange={this.onChange}
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
        <WhiteSpace />

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    search: state.search
  };
}

export default connect(mapStateToProps, actions)(Search);
