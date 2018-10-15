import _ from 'lodash';
import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import Navbar from './nav_bar';
import Searchbar from './search_bar';
import CircularProgress from '@material-ui/core/CircularProgress';
import TimeAgo from 'react-timeago'

import { Tabs, WhiteSpace, Grid, List } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';

class Explore extends Component {

  componentDidMount() {
    this.props.getExploreDocuments();
    this.props.getExploreReadlists();
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

  renderDocumentsSubgrid(documents, title) {
    // ==========    TEMP: GRID DOESN'T WORK WELL==============
    return (
      <div>
        {this.renderExploreDocumentsSublist(documents, title)}
      </div>
    )
    // ========================================================


    // const data = documents.map((element) => ({
    //   icon: element.image,
    //   text: element.title,
    //   url: element.open_url,
    // }));
    // return (
    //   <div>
    //     <WhiteSpace />
    //     <div style={{color: '#888', fontSize: '14px'}}>{title}</div>
    //     <WhiteSpace />
    //     <Grid data={data} isCarousel onClick={(element) => {this.props.history.push(`${element.url}`)}} />
    //   </div>
    // )
  }

  renderExploreDocumentsSublist(documents, title) {
    const data = documents.map(element => {
      return (
        <List.Item
          extra={<TimeAgo date={element.upload_time} />}
          arrow="horizontal"
          thumb={element.image}
          multipleLine
          onClick={() => {this.props.history.push(`${element.open_url}`)}}
        >
          {element.title}
          <List.Item.Brief>{element.owner_name}</List.Item.Brief>
        </List.Item>
      )
    })
    return (
      <div>
        <List renderHeader={() => title}>
          {data}
        </List>
      </div>
    )
  }

  renderSearchDocumentsSublist(documents, title) {
    const data = documents.map(element => {
      return (
        <List.Item
          extra={<TimeAgo date={element.upload_time} />}
          arrow="horizontal"
          thumb={element.uploader_portrait_url}
          multipleLine
          onClick={() => {this.props.history.push(`/documents/${element.slug}`)}}
        >
          {element.title}
          <List.Item.Brief>{element.uploader_name}</List.Item.Brief>
        </List.Item>
      )
    })
    return (
      <div>
        <List renderHeader={() => title}>
          {data}
        </List>
      </div>
    )
  }

  renderReadlistsSublist(readlists, title) {
    const data = readlists.map(element => {
      return (
        <List.Item
          extra={<TimeAgo date={element.create_time} />}
          arrow="horizontal"
          thumb={element.owner.portrait_url}
          multipleLine
          onClick={() => {this.props.history.push(`/readlists/${element.id}`)}}
        >
          {element.name}
          <List.Item.Brief>{element.owner.nickname}</List.Item.Brief>
        </List.Item>
      )
    })
    return (
      <div>
        <List renderHeader={() => title}>
          {data}
        </List>
      </div>
    )
  }

  renderExploreDocuments() {
    const documents = this.props.explore.documents;
    return (
      <div>
        {this.renderDocumentsSubgrid(documents.mostViewsDocuments, "Most Views")}
        {this.renderDocumentsSubgrid(documents.mostStarsDocuments, "Most Stars")}
        {this.renderDocumentsSubgrid(documents.mostAnnotationsDocuments, "Most Annotations")}
      </div>
    )
  }

  renderSearchDocuments() {
    const documents = this.props.search.documents;
    const length = this.props.search.documents.length;
    return (
      <div>
        {this.renderSearchDocumentsSublist(documents, length + " Search Result(s)")}
      </div>
    )
  }

  renderExploreReadlists() {
    const readlists = this.props.explore.readlists;
    return (
      <div>
        {this.renderReadlistsSublist(readlists.newestReadlists, "Trending Lists")}
        {this.renderReadlistsSublist(readlists.newestReadlists, "Recent Lists")}
      </div>
    )
  }

  renderSearchReadlists() {
    const readlists = this.props.search.readlists;
    const length = this.props.search.readlists.length;
    return (
      <div>
        {this.renderReadlistsSublist(readlists, length + " Search Result(s)")}
      </div>
    )
  }

  renderStickyTab() {
    return (
      <div>
        <WhiteSpace />
        <Searchbar />
        <StickyContainer>
          <Tabs
            tabs={[{ title: "Documents"}, { title: "Readlists"}]}
            initalPage={'t2'}
            renderTabBar={this.renderReactSticky}
          >
            <div style={{ justifyContent: 'center', height: '100%'}}>
              {(this.props.search.term != '' && this.props.search.documents) ? (
                <div> {this.renderSearchDocuments()} </div>
                ) : (
                <div> {this.renderExploreDocuments()} </div>
              )}
            </div>
            <div style={{ justifyContent: 'center', height: '100%'}}>
              {(this.props.search.term != '' && this.props.search.readlists) ? (
                <div> {this.renderSearchReadlists()} </div>
                ) : (
                <div> {this.renderExploreReadlists()} </div>
              )}
            </div>
          </Tabs>
        </StickyContainer>
        <WhiteSpace />
      </div>
    )
  }

  render() {
    if (_.isEmpty(this.props.explore) || _.isEmpty(this.props.explore.documents) || _.isEmpty(this.props.explore.readlists)) {
      return (
        <div>
          <Navbar title="Explore" />
          <CircularProgress style={{color:"#1BA39C",  marginTop: "40vh"}} size={100} thickness={5} />
        </div>
      );
    }

    return (
      <div>
        <Navbar title="Explore" />
        {this.renderStickyTab()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    explore: state.explore,
    search: state.search
  };
}

export default connect(mapStateToProps, actions)(Explore);
