import _ from 'lodash';
import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Navbar from './nav_bar';
import moment from 'moment';
import AddIcon from '@material-ui/icons/AddBoxOutlined';
import ShareIcon from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/DeleteForever';

import { Tabs, WhiteSpace, List, Modal, Toast, Icon } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';
import { getCookie, copyToClipboard } from '../utilities/helper';

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
      //   this.setState({loading: false})
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
    if (_.isEmpty(list)) {
      return (
        <div></div>
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
            renderTabBar={this.renderReactSticky}
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
    if (this.state.loading) {
      return (
        <div>
          <Navbar title="Readlists" history={this.props.history} match={this.props.match}/>
          <CircularProgress style={{color:"#1BA39C",  marginTop: "38vh"}} size='10vw' thickness={5} />
        </div>
      );
    }

    return (
      <div>
        <Navbar title="Readlists" history={this.props.history} match={this.props.match}/>
        {this.renderStickyTab()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    readlists: state.readlists
  };
}


export default connect(mapStateToProps, actions)(Readlists);
