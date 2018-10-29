function range(end) {
  return Array(end - 0).fill().map((_, idx) => 0 + idx)
}


function constructGetAnnotationsQueryUrl(slug, isGroupDocument) {
  if (!isGroupDocument)
    return '/file_viewer/api/documents/byslug/' + slug + '/annotations'
  else
    return '/coteries/api/coteriedocuments/byslug/' + slug + '/annotations'
}


function constructGetDocumentQueryUrl(slug, isGroupDocument) {
  if (!isGroupDocument)
    return '/file_viewer/api/documents/byslug/' + slug
  else
    return '/coteries/api/coteriedocuments/byslug/' + slug
}


/*eslint no-undef: "off"*/
function renderMathJax() {
  if (window.hasOwnProperty('MathJax'))
    MathJax.Hub.Queue(['Typeset', MathJax.Hub])
}


function getNextPageIndexWithAnnotations(currentPageIndex, annotationsByPage, numPages) {
  var i = currentPageIndex + 1
  while (true) {
    if (i > numPages) return undefined  // index starts from 1

    if (annotationsByPage[i].length > 0) return i
    else i += 1
  }
}


function getPreviousPageIndexWithAnnotations(currentPageIndex, annotationsByPage) {
  var i = currentPageIndex - 1
  while (true) {
    if (i < 1) return undefined

    if (annotationsByPage[i].length > 0) return i
    else i -= 1
  }
}


export {
  range,
  constructGetAnnotationsQueryUrl,
  constructGetDocumentQueryUrl,
  renderMathJax,
  getNextPageIndexWithAnnotations,
  getPreviousPageIndexWithAnnotations,
}
