import React from 'react'
import ReactDOM from 'react-dom';
import TimeAgo from 'react-timeago';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLocationArrow,
  faReply,
  faThumbsUp as faThumbsUped,
  faEllipsisV,
  faTrashAlt,
  faPencilAlt,
  faLink,
} from '@fortawesome/free-solid-svg-icons'
import {
  faThumbsUp,
} from '@fortawesome/fontawesome-free-regular'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const SmallChip = withStyles({
  root: {
    height: '20px',
    margin: '5px',
  },
  avatar: {
    height: '20px',
    width: '20px',
  },
})(Chip);

const SmallButton = withStyles({
  root: {
    minWidth: 0,
  }
})(Button);

function reduce_comment(comment) {
  var nickname, portrait_url, prefix, timeago, content
  var author = comment.annotator ? comment.annotator : comment.replier
  nickname = author.nickname ? author.nickname : 'Anonymous'
  portrait_url = author.portrait_url ? (
    author.portrait_url
    ) : ('/media/portrait/anonymous_portrait.png')
  if (comment.edit_time === null) {
    prefix = 'posted'
    timeago = comment.post_time
  } else {
    prefix = 'edited'
    timeago = comment.edit_time
  }
  var content = comment.content
  return {
    nickname: nickname,
    portrait_url: portrait_url,
    prefix: prefix,
    timeago: timeago,
    content: content,
    uuid: comment.uuid,
  }
}

const MENU_ITEM_HEIGHT = 48;

class AnnotationThread extends React.Component {
  constructor (props) {
    super(props);
    //this.handleClickOpen = this.handleClickOpen.bind(this);
    //how come I don't need this?
  }

  commentBlock (comment, isHead=false) {
    return (
      <div key={comment.uuid} className={isHead ? 'comment-head' : 'comment-body'}>
        <Grid>
          {/* TOP ROW OF COMMENT --- Contains: content */}
          <Grid>
            <div className='comment-text' dangerouslySetInnerHTML={{__html: comment.content /*TODO: Style this p*/}}></div>
          </Grid>
          {/* BOTTOM ROW OF COMMENT --- Contains: User info, 4 buttons to modify comment */}
          <Grid container justify="space-between" alignItems="center" wrap="nowrap">
            {/* BOTTOM ROW LEFT SIDE --- Contains: portrait, name, post/edit time */}
            <Grid container justify="flex-start" alignItems="center" wrap="nowrap">
              <Grid item>
                <SmallChip
                  label={comment.nickname}
                  avatar={<Avatar src={comment.portrait_url} />}
                />
              </Grid>
              <Grid item>
                <Typography variant="caption">{comment.prefix} <TimeAgo date={comment.timeago} /></Typography>
              </Grid>
            </Grid>
            {/* BOTTOM ROW RIGHT SIDE --- Contains: Locate, Reply, Like, More options */}
            {isHead && 
            <Grid item>
              <SmallButton size="small" color="primary" onClick={() => {ReactDOM.findDOMNode(this.props.annotationArea.scrollIntoView())/* TODO: enable smooth scroll */}} >
                <FontAwesomeIcon icon={faLocationArrow} />
              </SmallButton>
            </Grid>}
            <Grid item>
              <SmallButton size="small" color="primary" onClick={() => {/* TODO:function to reply */}} >
                <FontAwesomeIcon icon={faReply} />
              </SmallButton>
            </Grid>
            <Grid item>
              <SmallButton size="small" color="primary" onClick={() => {/* TODO:function to like */}} >
                <FontAwesomeIcon icon={faThumbsUp} />
              </SmallButton>
            </Grid>
            <Grid item>
              <SmallButton size="small" color="primary" onClick={this.handleClick}>
                <FontAwesomeIcon icon={faEllipsisV} />
              </SmallButton>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }

  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = value => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    var selectedAnnotation = this.props.selectedAnnotation;
    return (
      <div>
        {this.commentBlock(reduce_comment(selectedAnnotation), true)}
        {selectedAnnotation.replies.map(reply =>
          this.commentBlock(reduce_comment(reply))
        )}
        <Menu
          className='menu'
          anchorEl={anchorEl}
          open={open}
          onClose={this.handleClose}
          PaperProps={{
            style: {
              maxHeight: MENU_ITEM_HEIGHT * 4.5,
            },
          }}
        >
          <MenuItem onClick={this.handleClose}>
            <SmallButton size="small" color="primary">
              <FontAwesomeIcon icon={faPencilAlt} />
            </SmallButton><Typography variant={'caption'}>Edit</Typography>
          </MenuItem>
          <MenuItem onClick={this.handleClose}>
            <SmallButton size="small" color="primary">
              <FontAwesomeIcon icon={faLink} />
            </SmallButton><Typography variant={'caption'}>Share link</Typography>
          </MenuItem>
          <MenuItem onClick={this.handleClose}>
            <SmallButton size="small" color="primary">
              <FontAwesomeIcon icon={faTrashAlt} />
            </SmallButton><Typography variant={'caption'}>Delete</Typography>
          </MenuItem>
        </Menu>
      </div>
    )
  }
}

export default AnnotationThread;