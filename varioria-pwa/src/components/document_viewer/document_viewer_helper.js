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


export {
  range,
  constructGetAnnotationsQueryUrl,
  constructGetDocumentQueryUrl,
}
