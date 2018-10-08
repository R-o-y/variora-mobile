import React from 'react'

/*eslint no-undef: "off"*/
class DocumentViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    PDFJS.workerSrc = '/static/pdfjs/pdf.worker.js'

    PDFJS.getDocument('/media/pdf/Consent.pdf').then(function(pdf) {  // hard code a pdf ulr and test
      var pdfDoc = pdf
      var numPages = pdfDoc.numPages
      alert(numPages)
    })
  }

  render() {
    return (
      <div>

      </div>
    );
  }
}

export { DocumentViewer }




