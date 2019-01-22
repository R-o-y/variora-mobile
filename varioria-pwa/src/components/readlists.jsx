import * as actions from '../actions';

import { ActivityIndicator, Icon, List, Modal, Tabs, Toast, WhiteSpace } from 'antd-mobile';
import React, { Component } from 'react';
import { Sticky, StickyContainer } from 'react-sticky';
import { copyToClipboard, getCookie } from '../utilities/helper';

import AddIcon from '@material-ui/icons/AddBoxOutlined';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import NoPermission from './error_page/no_permission';
import NotSignedIn from './error_page/not_signed_in';
import ShareIcon from '@material-ui/icons/Share';
import _ from 'lodash';
import { connect } from 'react-redux';
import moment from 'moment';

class Readlists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createdReadlistActionModal: false,
      collectedReadlistActionModal: false,
      selectedReadlist: null,
      loading: true
    };
  }

  componentDidMount() {
    let groupUuid = this.props.match.params.groupUuid;
    if (groupUuid) {
      // this.props.getMyCoteriesReadlists(groupUuid).then(() => {
        this.setState({loading: false})
      // })
    } else {
      this.props.getMyReadlists().then(() => {
        this.setState({loading: false})
      })
    }
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

  renderAddReadlist() {
    // ================ TODO: TEMP CODE UNTIL GROUP-BASED READLISTS ========================
    let groupUuid = this.props.match.params.groupUuid;
    if (groupUuid) {
      return (
        <div></div>
      )
    }
    // =====================================================================================
    return (
      <List.Item
        thumb={<AddIcon style={{color:'grey'}} />}
        onClick={() => {this.props.history.push("/create-readlist-form")}}
      >
        <div style={{color:'grey'}}>New readlist</div>
        <List.Item.Brief>Click to create...</List.Item.Brief>
      </List.Item>
    )
  }

  renderReadlist(list, isCreated) {
    // ================ TODO: TEMP CODE UNTIL GROUP-BASED READLISTS ========================
    let groupUuid = this.props.match.params.groupUuid;
    if (groupUuid) {
      return (
        <List>
          <List.Item>
            <div style={{color: 'grey', textAlign:'center' }}>
              Group-based readlists still in development.
            </div>
          </List.Item>
        </List>
      )
    }
    // =====================================================================================

    if (!list.length) {
      return (
        <List>
          <List.Item>
            <div style={{color: 'grey', textAlign:'center' }}>
              You haven't {isCreated ? 'created' : 'collected'} any readlists.
            </div>
          </List.Item>
        </List>
      )
    }
    const data = list.map(slug => {
      let element = this.props.readlists[slug];
      return (
        <div key={slug}>
          <List.Item
            thumb="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678072-folder-document-512.png"
            multipleLine
            arrow="horizontal"
            onClick={() => {this.props.history.push(`readlists/${slug}`)}}
          >
            {element.name}
            <List.Item.Brief>{moment(element.create_time).format("MMMM Do YYYY, h:mm a")}</List.Item.Brief>
          </List.Item>
        </div>
      )
    })
    return (
      <div>
        <List>
          {data}
        </List>
      </div>
    )
  }

  renderCreatedReadlists() {
    return (
      <div>
        {this.renderAddReadlist()}
        {this.renderReadlist(_.orderBy(this.props.user.createdReadlists, (readlistSlug) => {return this.props.readlists[readlistSlug].create_time}, 'desc'), true)}
      </div>
    )
  }

  renderCollectedReadlists() {
    return (
      <div>
        {this.renderReadlist(_.orderBy(this.props.user.collectedReadlists, (readlistSlug) => {return this.props.readlists[readlistSlug].create_time}, 'desc'), false)}
      </div>
    )
  }

  renderStickyTab() {
    return (
      <div>
        <WhiteSpace />
        <StickyContainer>
          <Tabs
            tabs={[{ title: "Created"}, { title: "Collected"}]}
            initalPage={'t2'}
            _renderTabBar={this.renderReactSticky}
          >
            <div style={{ justifyContent: 'center', height: '100%', backgroundColor: '#fff' }}>
              {this.renderCreatedReadlists()}
            </div>
            <div style={{ justifyContent: 'center', height: '100%', backgroundColor: '#fff' }}>
              {this.renderCollectedReadlists()}
            </div>
          </Tabs>
        </StickyContainer>
        <WhiteSpace />
      </div>
    )
  }

  render() {
    if (this.state.loading)
      return <ActivityIndicator toast animating={this.state.loading} />

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
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    readlists: state.readlists,
    coteries: state.coteries,
  };
}


export default connect(mapStateToProps, actions)(Readlists);
