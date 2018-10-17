import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import Navbar from './nav_bar';
import CircularProgress from '@material-ui/core/CircularProgress';
import { WhiteSpace, List } from 'antd-mobile';
import moment from 'moment';

class Readlist extends Component {

  componentDidMount() {
    const { slug } = this.props.match.params
    this.props.getReadlist(slug);
  }

  renderDocumentList() {
    const data = this.props.readlists.readlist.documents.map(element => {
      return (
        <List.Item
          key={element.slug}
          arrow="horizontal"
          thumb="https://cdn1.iconfinder.com/data/icons/file-types-23/48/PDF-128.png"
          multipleLine
          onClick={() => {this.props.history.push(`/documents/${element.slug}`)}}
        >
          {element.title}
          <List.Item.Brief>{moment(element.upload_time).format("MMMM Do YYYY, h:mm a")}</List.Item.Brief>
        </List.Item>
      )
    })
    return (
      <div>
        <WhiteSpace />
        <List>
          {data}
        </List>
      </div>
    )
  }

  render() {
    if (!this.props.readlists.readlist) {
      return (
        <div>
          <Navbar title="Readlists" history={this.props.history}/>
          <CircularProgress style={{color:"#1BA39C",  marginTop: "38vh"}} size='10vw' thickness={5} />
        </div>
      )
    }
    const title = "Readlist (" + this.props.readlists.readlist.name + ")"
    return (
      <div>
        <Navbar title={title} history={this.props.history}/>
        {this.renderDocumentList()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    readlists: state.readlists
  };
}

export default connect(mapStateToProps, actions)(Readlist);
