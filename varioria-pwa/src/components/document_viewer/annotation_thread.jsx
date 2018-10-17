import React from 'react'
import Moment from 'react-moment';
import { Flex, WingBlank, WhiteSpace, Tag, Badge } from 'antd-mobile';

function commentBlock(nickname, portrait_url, prefix, timeago, content) {
  return (
    <div>
      <WhiteSpace size='xs'/>
      <Flex align="start">
        <table style={{textAlign: 'center'}}>
          <tr><WingBlank size='sm'><img height={38} width={38} src={portrait_url} alt="annotator-avatar"/></WingBlank></tr>
          <tr><Tag small>{nickname}</Tag></tr>
        </table>
        <Flex.Item>
          <Badge
            text={(<span>{prefix} <Moment fromNow>{timeago}</Moment></span>)}
            style={{padding: '0',backgroundColor: 'inherit',color: '#999',}}
          />
          <div dangerouslySetInnerHTML={{__html: content}}></div>
        </Flex.Item>
      </Flex>
    </div>
  )
}

var AnnotationThread = (props) => {
  var selectedAnnotation = props.selectedAnnotation
  var nickname = selectedAnnotation.annotator.nickname ? selectedAnnotation.annotator.nickname : 'Anonymous'
  var portrait_url = selectedAnnotation.annotator.portrait_url ? (
      selectedAnnotation.annotator.portrait_url
      ) : ('/media/portrait/anonymous_portrait.png')
  var prefix, timeago
  if (selectedAnnotation.edit_time === null) {
    prefix = 'posted'
    timeago = selectedAnnotation.post_time
  } else {
    prefix = 'edited'
    timeago = selectedAnnotation.edit_time
  }
  var content = selectedAnnotation.content
  return (
    <div>
      {commentBlock(nickname, portrait_url, prefix, timeago, content)}
    </div>
  )
}

export { AnnotationThread }
