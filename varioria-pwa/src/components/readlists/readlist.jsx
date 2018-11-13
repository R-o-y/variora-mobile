import * as actions from '../../actions';

import { Icon, List, NavBar, Toast, WhiteSpace } from 'antd-mobile';
import React, { Component } from 'react';
import { copyToClipboard, getCookie } from '../../utilities/helper';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditIcon from '@material-ui/icons/Edit';
import Favorite from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';
import Navbar from '../nav_bar';
import ShareIcon from '@material-ui/icons/Share';
import TimeAgo from 'react-timeago'
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import moment from 'moment';
import pdfIcon from '../../utilities/pdf.png';

class Readlist extends Component {

  state = {
    collected: false,
    loading: true
  }

  componentDidMount() {
    const { slug } = this.props.match.params;
    const coterieId = this.props.match.params.coterieId;
    const fetchData = async () => {
      try {
        if (coterieId) {
          await this.props.getCoterieReadlist(slug, coterieId);
          await this.props.getUser();
          await this.props.getMyReadlists();
        } else {
          await this.props.getReadlist(slug);
          await this.props.getUser();
          await this.props.getMyReadlists();
        }    
      } catch (error) {
        console.error(error);
        return;
      }
      const collected = this.props.user.collectedReadlists.includes(this.props.readlists.readlist.slug);
      const isOwner = this.props.user.pk == this.props.readlists.readlist.owner.pk;
      this.setState({
        collected,
        isOwner,
        loading: false
      });
    };
    fetchData();
  }

  onCollectIconClick = () => {
    const readlist = this.props.readlists.readlist;
    const coterieId = this.props.match.params.coterieId;
    if (this.state.isOwner) {
      Toast.fail('You are the owner of this readlist')
      return
    }
    let data = new FormData();
    data.append('csrfmiddlewaretoken', getCookie('csrftoken'));
    if (this.state.collected) {
      if (coterieId) {
        this.props.uncollectCoterieReadlist(data, readlist.slug, coterieId).then(() => {
          this.setState({collected: false})
        });  
      } else {
        this.props.uncollectReadlist(data, readlist.slug).then(() => {
          this.setState({collected: false})
        });  
      }
    } else {
      if (coterieId) {
        this.props.collectCoterieReadlist(data, readlist.slug, coterieId).then(() => {
          this.setState({collected: true})
        });  
      } else {
        this.props.collectReadlist(data, readlist.slug).then(() => {
          this.setState({collected: true})
        });  
      }
    }
  }

  onShareIconClick() {
    const url = window.location;
    copyToClipboard(url);
    Toast.success('Copied to clipboard!', 1);
  }

  renderDocumentList() {
    const data = this.props.readlists.readlist.documents.map(element => {
      return (
        <List.Item
          key={element.slug}
          arrow="horizontal"
          thumb={<img src={pdfIcon} alt='pdf-icon' style={{height: 28, width: 24}} />}
          multipleLine
          onClick={() => {
            const coterieId = this.props.match.params.coterieId
            if (coterieId) {
              this.props.history.push(`/coteries/${coterieId}/documents/${element.slug}`)
            } else {
              this.props.history.push(`/documents/${element.slug}`)
            }
          }}
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
    const isOwner = this.state.isOwner;
    return (
      <Card style={{margin: '15px 15px 5px 15px'}}>
        <CardContent>
          <CardHeader
            style={{paddingTop: '0', paddingRight: '0'}}
            action={
              isOwner ? (
                <IconButton>
                  <EditIcon onClick={() => {
                    const coterieId = this.props.match.params.coterieId;
                    if (coterieId) {
                      this.props.history.push("/edit-readlist-form/" + coterieId + "/" + this.props.readlists.readlist.slug)
                    } else {
                      this.props.history.push("/edit-readlist-form/" + this.props.readlists.readlist.slug)
                    }
                  }} />
                </IconButton>
              ) : (
                <div></div>
              )
            }
          />
          <div style={{textAlign: 'center'}}>
            <Typography variant="h5" component="h5">
              {readlist.name}
            </Typography>
            <Typography variant="subtitle1" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', hyphens: 'auto', fontSize: 12, marginTop: 12 }}>
              {readlist.description}
            </Typography>
            <br />
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Avatar alt={readlist.owner.nickname} src={readlist.owner.portrait_url} style={{width: 28, height: 28}}/>
              <Typography variant="subtitle2" color="textSecondary" style={{paddingLeft: 5}}>
                {readlist.owner.nickname} created {<TimeAgo date={readlist.create_time} />}
              </Typography>
            </div>
          </div>
        </CardContent>
        <CardActions>
          <IconButton aria-label="Add to favorites">
            {this.state.collected?
              <FavoriteIcon onClick={this.onCollectIconClick}/> :
              <Favorite onClick={this.onCollectIconClick}/>
            }
          </IconButton>
          <IconButton aria-label="Share">
            <ShareIcon onClick={this.onShareIconClick}/>
          </IconButton>
        </CardActions>
      </Card>
    )
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <Navbar title="Readlists" history={this.props.history} match={this.props.match}/>
          <CircularProgress style={{color:"#1BA39C",  marginTop: "38vh"}} size='10vw' thickness={5} />
        </div>
      )
    }
    return (
      <div>
        <NavBar
          mode="light"
          history={this.props.history}
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
          Readlists
          </span>
        </NavBar>
        {this.renderReadlistCard()}
        {this.renderDocumentList()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    readlists: state.readlists,
    user: state.user
  };
}

export default connect(mapStateToProps, actions)(Readlist);
