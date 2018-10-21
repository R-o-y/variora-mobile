import _ from 'lodash';
import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Navbar from './nav_bar';
import moment from 'moment';
import AddIcon from '@material-ui/icons/AddBoxOutlined';

import { Tabs, WhiteSpace, List, Icon } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';

class Readlists extends Component {

  componentDidMount() {
    this.props.getMyReadlists();
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

  renderAddReadlist() {
    return (
      <List.Item
        thumb={<AddIcon style={{color:'grey'}} />}
        onClick={() => {console.log('Create readlist clicked')}}
      >
        <div style={{color:'grey'}}>New readlist</div>
        <List.Item.Brief>Click to create...</List.Item.Brief>
      </List.Item>
    )
  }

  renderReadlist(list) {
    if (_.isEmpty(list)) {
      return (
        <div></div>
      )
    }
    const data = list.map(element => {
      return (
        <div key={element.slug}>
          <List.Item
            thumb="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678072-folder-document-512.png"
            multipleLine
            onClick={() => {this.props.history.push(`readlists/${element.slug}`)}}
          >
            {element.name}
            <List.Item.Brief>{moment(element.create_time).format("MMMM Do YYYY, h:mm a")}</List.Item.Brief>
          </List.Item>
          <Icon type="ellipsis"
            style={{position: 'absolute', width:'10%', marginTop: -50, right: 5, color:'#a8a8a8', zIndex: 1}}
            onClick={(e) => {
              console.log('clicked ellipsis ' + element.slug);
              this.setState({selectedDocument: element.slug})
              this.showModal('actionModal', e);
          }}/>
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
        {this.renderReadlist(this.props.readlists.createdReadlists)}
      </div>
    )
  }

  renderCollectedReadlists() {
    return (
      <div>
        {this.renderReadlist(this.props.readlists.collectedReadlists)}
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
    if (_.isEmpty(this.props.readlists)) {
      return (
        <div>
          <Navbar title="Readlists" history={this.props.history}/>
          <CircularProgress style={{color:"#1BA39C",  marginTop: "38vh"}} size='10vw' thickness={5} />
        </div>
      );
    }

    return (
      <div>
        <Navbar title="Readlists" history={this.props.history}/>
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
