import React from 'react'
import ReactDOM from 'react-dom';
import TimeAgo from 'react-timeago';
import axios from 'axios'
import { getCookie, copyToClipboard } from '../../utilities/helper';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow, faReply, faThumbsUp as faThumbsUped, faEllipsisV, faTrashAlt, faPencilAlt, faLink } from '@fortawesome/free-solid-svg-icons'
import { faThumbsUp } from '@fortawesome/fontawesome-free-regular'
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
  var isAnnotation = comment.annotator ? true : false
  var author = isAnnotation ? comment.annotator : comment.replier
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
    pk: comment.pk,
    numReplies: comment.replies ? comment.replies.length : 0,
    isAnnotation: isAnnotation
  }
}

const MENU_ITEM_HEIGHT = 48;

class AnnotationThread extends React.Component {
  constructor (props) {
    super(props);
    this.state.likeSet = new Set();
  }

  commentBlock (comment, isHead=false) {
    return (
      <div key={comment.uuid} className={isHead ? 'comment-head' : 'comment-body'}>
        <Grid>
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
          {/* TOP ROW OF COMMENT --- Contains: content */}
          <Grid>
            <div className='comment-text' dangerouslySetInnerHTML={{__html: comment.content}}></div>
          </Grid>
          {/* BOTTOM ROW OF COMMENT --- Contains: User info, 4 buttons to modify comment */}
          <Grid container justify="space-between" alignItems="center" wrap="nowrap">
            {/* BOTTOM ROW LEFT SIDE --- Contains: portrait, name, post/edit time */}
            <Grid container justify="flex-start" alignItems="center" wrap="nowrap">
              {isHead && <SmallChip icon={<KeyboardArrowDown/>} label={comment.numReplies + ((comment.numReplies==1) ? ' reply' : ' replies')} variant='outlined'></SmallChip>}
            </Grid>
            {/* BOTTOM ROW RIGHT SIDE --- Contains: Locate, Reply, Like, More options */}
            <Grid container justify="flex-end" alignItems="center" wrap="nowrap">
              {isHead && //Locate Arrow only exists for header
              <Grid item>
                <SmallButton color="primary" onClick={() => {this.locateComment(this.props.annotationArea)}} >
                  <FontAwesomeIcon icon={faLocationArrow} />
                </SmallButton>
              </Grid>}
              <Grid item>
                <SmallButton color="primary" onClick={() => {isHead ? this.replyAnnotation(comment) : this.replyReply(comment)}} >
                  <FontAwesomeIcon icon={faReply} />
                </SmallButton>
              </Grid>
              <Grid item>
                <SmallButton color="primary" style={{color: '#1BA39C'}} disabled={this.state.likeSet.has(comment.uuid)} onClick={() => {isHead ? this.likeAnnotation(comment) : this.likeReply(comment)}} >
                  <FontAwesomeIcon icon={this.state.likeSet.has(comment.uuid) ? faThumbsUped : faThumbsUp} />
                </SmallButton>
              </Grid>
              <Grid item>
                <SmallButton color="primary" onClick={event => this.openContextMenu(event, comment, isHead)}>
                  <FontAwesomeIcon icon={faEllipsisV} />
                </SmallButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }

  state = {
    commentMenuElement: null,
    commentMenuUuid: null,
  };

  openContextMenu = (event, comment, isHead) => {
    this.setState({
      commentMenuElement: event.currentTarget,
      selectedComment: comment,
      selectedCommentIsReply: !isHead,
    });
  };

  closeContextMenu = value => {
    this.setState({
      commentMenuElement: null,
      selectedComment: null,
    });
  };

  /** LOCATE REPLY LIKE EDIT SHARE DELETE */

  locateComment = (element) => {
    element.scrollIntoView({behavior: "smooth"});
  }

  replyAnnotation = (comment) => {
    this.props.setParentState({
      replyToAnnotationReplyId: null,
      replyToAnnotationReplyUuid: null,
      annotationOpen: false,
      annotationLinearLinkedListOpen: true,
    }) /**Hide current annotation drawer and show text input */
  }

  replyReply = (comment) => {
    this.props.setParentState({
      replyToAnnotationReplyId: comment.pk,
      replyToAnnotationReplyUuid: comment.uuid,
      annotationOpen: false,
      annotationLinearLinkedListOpen: true,
    }) /**Hide current annotation drawer and show text input */
  }

  likeAnnotation = (comment) => {
    var data = new FormData()
    data.append('csrfmiddlewaretoken', getCookie('csrftoken'))
    data.append('operation', 'like_annotation')
    data.append('annotation_id', comment.pk)
    axios.post(window.location.pathname + '/', data).then(response => {
      this.setState({likeSet: this.state.likeSet.add(comment.uuid)})
    })
  }

  likeReply = (comment) => {
    var data = new FormData()
    data.append('csrfmiddlewaretoken', getCookie('csrftoken'))
    data.append('operation', 'like_annotation_reply')
    data.append('annotation_reply_id', comment.pk)
    axios.post(window.location.pathname + '/', data).then(response => {
      this.setState({likeSet: this.state.likeSet.add(comment.uuid)})
    })
  }

  editComment = () => {
    this.closeContextMenu();
    this.props.setParentState({
      annotationOpen: false,
      editCommentOpen: true,
      editTextContent: this.state.selectedComment.content,
      selectedComment: this.state.selectedComment,
    })
  }

  shareComment = () => {
    let url = [window.location.protocol, '//', window.location.host, window.location.pathname].join('') + '?annotation=' + this.state.selectedComment.uuid;
    copyToClipboard(url);
    /* TODO: Debug why not copying. Add toast to indicate copied to clipboard to util? or here. Change to share function in future?*/
    console.log(url)
    this.closeContextMenu();
  }

  deleteComment = () => {
    var operation = this.state.selectedCommentIsReply ? 'delete_annotation_reply' : 'delete_annotation'
    var idType = this.state.selectedCommentIsReply ? 'reply_id' : 'annotation_id'
    var index = parseInt(this.state.selectedComment.page_index)
    var data = new FormData()
    data.append('csrfmiddlewaretoken', getCookie('csrftoken'))
    data.append('operation', operation)
    data.append(idType, this.state.selectedComment.pk)
    data.append('document_id', this.props.pdfDocument.pk)
    console.log(this.state.selectedComment)
    var selectedAnnotation = this.props.selectedAnnotation;
    var annotations = this.props.annotations
    var annotationsByPage = this.props.annotationsByPage
    var selectedComment = this.state.selectedComment
    axios.post(window.location.pathname + '/', data).then(response => {
      console.log(response)
      console.log(annotations)
      console.log(annotationsByPage)
      if (this.state.selectedCommentIsReply) {
        var i = 0
        selectedAnnotation.replies.map((reply) => {
          if (reply.uuid == selectedComment.uuid) {
            selectedAnnotation.replies.splice(i, 1)
            annotations[selectedAnnotation.uuid] = selectedAnnotation
            this.props.setParentState({annotations: annotations})
          }
          i++;
        })
      } else {
        delete annotations[selectedAnnotation.uuid]
        var i = 0
        annotationsByPage[selectedAnnotation.page_index].map((annotation) => {
          if (annotation.uuid == selectedAnnotation.uuid) {
            annotationsByPage[selectedAnnotation.page_index].splice(i, 1)
            this.props.setParentState({
              annotations: annotations,
              annotationsByPage: annotationsByPage,
              annotationOpen: false,
              selectedAnnotation: undefined,
            })
          }
          i ++;
        })
      }
    })
    this.closeContextMenu();
  }

  render() {
    const { commentMenuElement } = this.state;
    const open = Boolean(commentMenuElement);
    var selectedAnnotation = this.props.selectedAnnotation;
    return (
      <div>
        {this.commentBlock(reduce_comment(selectedAnnotation), true)}
        {selectedAnnotation.replies.map(reply =>
          this.commentBlock(reduce_comment(reply))
        )}
        <Menu
          className='menu'
          anchorEl={commentMenuElement}
          open={open}
          onClose={this.closeContextMenu}
          PaperProps={{
            style: {
              maxHeight: MENU_ITEM_HEIGHT * 4.5,
            },
          }}
        >
          <MenuItem onClick={this.editComment}>
            <SmallButton color="primary">
              <FontAwesomeIcon icon={faPencilAlt} />
            </SmallButton><Typography>Edit</Typography>
          </MenuItem>
          <MenuItem onClick={this.shareComment}>
            <SmallButton color="primary">
              <FontAwesomeIcon icon={faLink} />
            </SmallButton><Typography>Share link</Typography>
          </MenuItem>
          <MenuItem onClick={this.deleteComment}>
            <SmallButton color="primary">
              <FontAwesomeIcon icon={faTrashAlt} />
            </SmallButton><Typography>Delete</Typography>
          </MenuItem>
        </Menu>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    coteries: state.coteries,
    document: state.document,
  };
}

export default connect(mapStateToProps, actions)(AnnotationThread);