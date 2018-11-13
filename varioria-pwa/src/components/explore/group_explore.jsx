import '../theme.css'

import _ from 'lodash';
import React, { Component } from 'react';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import NotSignedIn from '../error_page/not_signed_in';
import NoPermission from '../error_page/no_permission';
import CircularProgress from '@material-ui/core/CircularProgress';
import TimeAgo from 'react-timeago';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import { Tabs, WhiteSpace, List } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';

class GroupExplore extends Component {
  state = { loading: true }

  componentDidMount() {
    this.props.getMyCoteries().then(() => {
      this.setState({ loading: false });
    });
  }

  renderReactSticky(props) {
    return (
      <Sticky>
        {({ style }) =>
          <div style={{  ...style, zIndex: 1 }}>
            <Tabs.DefaultTabBar {...props} />
          </div>
        }
      </Sticky>
    )
  }

  renderCoterieDocuments() {
    const coterieDocs = this.props.coteries[this.props.match.params.groupUuid].coteriedocument_set;
    const data = coterieDocs.map(element => {
      return (
        <List.Item
          key={element.slug}
          extra={<TimeAgo date={element.upload_time} />}
          thumb="https://cdn1.iconfinder.com/data/icons/file-types-23/48/PDF-128.png"
          multipleLine
          onClick={() => {
            const groupUuid = this.props.match.params.groupUuid
            const coterie = this.props.coteries[groupUuid]
            const coterieId = coterie.pk
            this.props.history.push(`/coteries/${coterieId}/documents/${element.slug}`)
          }}
        >
          {element.title}
          <List.Item.Brief>{element.uploader_name}</List.Item.Brief>
        </List.Item>
      )
    }).reverse()
    return (
      <List>
        {data}
      </List>
    )
  }

  renderCoterieReadlists() {
    const coterieReadlists = this.props.coteries[this.props.match.params.groupUuid].coteriereadlist_set;
    const data = coterieReadlists.map(element => {
      return (
        <List.Item
          key={element.slug}
          extra={<TimeAgo date={element.create_time} />}
          thumb="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678072-folder-document-512.png"
          multipleLine
          onClick={() => {
            const groupUuid = this.props.match.params.groupUuid
            const coterie = this.props.coteries[groupUuid]
            const coterieId = coterie.pk
            this.props.history.push(`/coteries/${coterieId}/readlists/${element.slug}`)
          }}
        >
          {element.name}
          <List.Item.Brief>{element.owner.nickname}</List.Item.Brief>
        </List.Item>
      )
    }).reverse()
    return (
      <List>
        {data}
      </List>
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
            swipeable={true}
            _renderTabBar={this.renderReactSticky}
          >
            <div style={{ justifyContent: 'center', height: '100%'}}>
              {this.renderCoterieDocuments()}
            </div>
            <div style={{ justifyContent: 'center', height: '100%'}}>
              {this.renderCoterieReadlists()}
            </div>
          </Tabs>
        </StickyContainer>
        <WhiteSpace />
      </div>
    )
  }

  render() {
    if (this.state.loading) {
      return (
        <CircularProgress style={{color:"#1BA39C",  marginTop: "38vh"}} size='10vw' thickness={5} />
      );
    }

    if (!this.props.user || !this.props.user.is_authenticated) {
      return (
        <NotSignedIn history={this.props.history}/>
      )
    }

    const currentCoterie = this.props.coteries[this.props.match.params.groupUuid];

    if (!currentCoterie) {
      return (
        <NoPermission />
      )
    }

    return (
      <div>
        {this.renderStickyTab()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    explore: state.explore,
    coteries: state.coteries
  };
}

export default connect(mapStateToProps, actions)(GroupExplore);
