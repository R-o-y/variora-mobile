import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import Navbar from './nav_bar';
import CircularProgress from '@material-ui/core/CircularProgress';
import { WhiteSpace, List } from 'antd-mobile';
import moment from 'moment';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
import EditIcon from '@material-ui/icons/Edit';
import TimeAgo from 'react-timeago'

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

  renderReadlistCard() {
    const readlist = this.props.readlists.readlist;
    return (
      <Card style={{margin: '15px 15px 5px 15px'}}>
        <CardContent>
          <CardHeader
            style={{paddingTop: '0', paddingRight: '0'}}
            action={
              <IconButton>
                <EditIcon />
              </IconButton>
            }
          />
          <Typography variant="h5" component="h5">
            {readlist.name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {readlist.owner.nickname} created {<TimeAgo date={readlist.create_time} />}
          </Typography>
        </CardContent>
        <CardActions>
          <IconButton aria-label="Add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="Share">
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>
    )
  }

  render() {
    if (!this.props.readlists.readlist) {
      return (
        <div>
          <Navbar title="Readlists" history={this.props.history} match={this.props.match}/>
          <CircularProgress style={{color:"#1BA39C",  marginTop: "38vh"}} size='10vw' thickness={5} />
        </div>
      )
    }
    return (
      <div>
        <Navbar title="Readlists" history={this.props.history} match={this.props.match}/>
        {this.renderReadlistCard()}
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
