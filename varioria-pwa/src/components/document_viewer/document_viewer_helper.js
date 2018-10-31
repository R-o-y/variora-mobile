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


function getPrevAnnotation(selectedAnnotation, annotationsByPage) {
  if (selectedAnnotation === undefined || annotationsByPage === undefined) return undefined

  const thisPage = selectedAnnotation.page_index
  const thisPageAnnotations = annotationsByPage[thisPage]
  const indexInPage = thisPageAnnotations.indexOf(selectedAnnotation)

  if (indexInPage > 0)
    return thisPageAnnotations[indexInPage - 1]
  else {
    const prevPageWithAnnotations = getPreviousPageIndexWithAnnotations(thisPage, annotationsByPage)
    if (prevPageWithAnnotations === undefined)
      return undefined

    const annotations = annotationsByPage[prevPageWithAnnotations]
    return annotations[annotations.length - 1]
  }
}


function getNextAnnotation(selectedAnnotation, annotationsByPage, numPages) {
  if (selectedAnnotation === undefined || annotationsByPage === undefined || numPages === undefined) return undefined

  const thisPage = selectedAnnotation.page_index
  const thisPageAnnotations = annotationsByPage[thisPage]
  const indexInPage = thisPageAnnotations.indexOf(selectedAnnotation)

  if (indexInPage < thisPageAnnotations.length - 1)
    return thisPageAnnotations[indexInPage + 1]
  else {
    const nextPageWithAnnotations = getNextPageIndexWithAnnotations(thisPage, annotationsByPage, numPages)
    if (nextPageWithAnnotations === undefined)
      return undefined

    const annotations = annotationsByPage[nextPageWithAnnotations]
    return annotations[0]
  }
}


export {
  range,
  constructGetAnnotationsQueryUrl,
  constructGetDocumentQueryUrl,
  renderMathJax,
  getNextAnnotation,
  getPrevAnnotation,
}
