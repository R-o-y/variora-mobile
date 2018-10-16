import React from 'react'

var AnnotationThread = (props) => {
  var selectedAnnotation = props.selectedAnnotation
  return (
    <div>
      poster username: {selectedAnnotation.annotator.nickname}
      <img height={38} width={38} src={selectedAnnotation.annotator.portrait_url} alt="annotator-avatar"/>
      <br />
      <div dangerouslySetInnerHTML={{__html: selectedAnnotation.content}}></div>
      posted at: {selectedAnnotation.post_time}
      edited at: {selectedAnnotation.edit_time}
    </div>
  )
}

export { AnnotationThread }
