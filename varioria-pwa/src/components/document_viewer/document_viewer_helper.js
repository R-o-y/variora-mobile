function range(end) {
  return Array(end - 0).fill().map((_, idx) => 0 + idx)
}


function constructGetAnnotationsQueryUrl(slug) {
  return '/file_viewer/api/documents/byslug/' + slug + '/annotations'
}


function constructGetDocumentQueryUrl(slug) {
  return '/file_viewer/api/documents/byslug/' + slug
}


export {
  range,
  constructGetAnnotationsQueryUrl,
  constructGetDocumentQueryUrl,
}
