import React from 'react'
import Moment from 'react-moment';
import { Flex, WingBlank, WhiteSpace, Tag, Badge } from 'antd-mobile';

function commentBlock(comment) {
  return (
    <div>
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
            text={(<span>{comment.prefix} <Moment fromNow>{comment.timeago}</Moment></span>)}
            style={{padding: '0',backgroundColor: 'inherit',color: '#999',}}
          />
          </Flex>
        </Flex.Item>
      </Flex>
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
