import React from 'react'
import TimeAgo from 'react-timeago';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Flex, WingBlank, WhiteSpace, Tag, Badge } from 'antd-mobile';

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

function commentBlock(comment) {
  return (
    <div>
      <Card>
        <SmallChip
          label={comment.nickname}
          avatar={<Avatar src={comment.portrait_url} />}
        />
        <Typography component="p">
      <div dangerouslySetInnerHTML={{__html: comment.content /*TODO: Style this p*/}}></div>
        </Typography>
        <CardActions>
          <Button size="small" color="primary">
            Reply
          </Button>
          <Button size="small" color="primary">
            Edit
          </Button>
          <Button size="small" color="primary">
            Delete
          </Button>
        </CardActions>
      </Card>
      {/*
      <WhiteSpace size='xs'/>
      <Flex align="center">
        <Flex direction="column">
          <WingBlank size='sm'><img height={38} width={38} src={comment.portrait_url} alt="annotator-avatar"/></WingBlank>
          <Tag small>{comment.nickname}</Tag>
        </Flex>
        <Flex.Item>
          <div dangerouslySetInnerHTML={{__html: comment.content}}></div>
          <Flex justify="start">
          <Badge
            text={(<span>{comment.prefix} <TimeAgo date={comment.timeago} /></span>)}
            style={{padding: '0',backgroundColor: 'inherit',color: '#999',}}
          />
          </Flex>
        </Flex.Item>
      </Flex>
    */}
    </div>
  )
}

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
  }
}

var AnnotationThread = (props) => {
  var selectedAnnotation = props.selectedAnnotation
  var comment = reduce_comment(selectedAnnotation)
  return (
    <div>
      {commentBlock(comment)}
      {selectedAnnotation.replies.map(function(reply, i){
        return commentBlock(reduce_comment(reply))
      })}
    </div>
  )
}

export { AnnotationThread }
