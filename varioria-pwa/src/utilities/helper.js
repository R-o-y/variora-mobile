import { Toast } from 'antd-mobile';

export function getCookie(name) {
  var cookieValue = null
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';')
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim()
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}

export function copyToClipboard(content) {
  const temp = document.createElement('input')
  temp.style.hidden = true
  document.body.appendChild(temp)
  temp.value = content
  temp.select()
  document.execCommand('copy')
  document.body.removeChild(temp)
}

const MAX_DOCUMENT_UPLOAD_SIZE = 5 * 1024 * 1024;

export function validateDocumentSize(file) {
  if (file.size > MAX_DOCUMENT_UPLOAD_SIZE) {
    Toast.info('Document size should be less than 5 MB', 1);
    return false
  }
  return true
}

export function getValFromUrlParam(key) {
  return new URL(window.location.href).searchParams.get(key)
}

export function uuidWithHyphen(uuid) {
  return uuid.slice(0, 8) + "-"
          + uuid.slice(8, 12) + "-"
          + uuid.slice(12, 16) + "-"
          + uuid.slice(16, 20) + "-"
          + uuid.slice(20, 32);
}
