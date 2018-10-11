import _ from 'lodash';
import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from './nav_bar';
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
    const data = documents.map((element) => ({
      icon: element.image,
      text: element.title,
      url: element.open_url,
    }));
    return (
      <div>
        <WhiteSpace />
        <div style={{color: '#888', fontSize: '14px'}}>{title}</div>
        <WhiteSpace />
        <Grid data={data} isCarousel onClick={(element) => {this.props.history.push(`${element.url}`)}} />
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

  renderExploreDocuments(list) {
    return (
      <div>
        {this.renderDocumentsSubgrid(list.mostViewsDocuments, "Most Views")}
        {this.renderDocumentsSubgrid(list.mostStarsDocuments, "Most Stars")}
        {this.renderDocumentsSubgrid(list.mostAnnotationsDocuments, "Most Annotations")}
      </div>
    )
  }

  renderExploreReadlists(list) {
    return (
      <div>
        {this.renderReadlistsSublist(list.newestReadlists, "Trending Lists")}
        {this.renderReadlistsSublist(list.newestReadlists, "Recent Lists")}
      </div>
    )
  }

  renderStickyTab() {
    return (
      <div>
        <WhiteSpace />
        <StickyContainer>
          <Tabs
            tabs={[{ title: "Documents"}, { title: "Readlists"}]}
            initalPage={'t2'}
            renderTabBar={this.renderReactSticky}
          >
            <div style={{ justifyContent: 'center', height: '100%'}}>
              {this.renderExploreDocuments(this.props.explore.documents)}
            </div>
            <div style={{ justifyContent: 'center', height: '100%'}}>
              {this.renderExploreReadlists(this.props.explore.readlists)}
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
    explore: state.explore
  };
}

export default connect(mapStateToProps, actions)(Explore);
