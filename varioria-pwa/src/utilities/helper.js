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
  const temp = document.createElement('span')
  temp.style.hidden = true
  temp.innerHTML = content
  document.body.appendChild(temp)
  const range = document.createRange()
  range.selectNodeContents(temp)
  const select = window.getSelection()
  select.removeAllRanges()
  select.addRange(range)
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

export function getRandomColor(uuid){
  const colors = ['#f472d0', '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#f1c40f', '#e67e22', '#e74c3c'];
  return colors[uuid.charCodeAt(0)%9];
}
