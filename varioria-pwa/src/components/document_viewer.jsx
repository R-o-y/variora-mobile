import React from 'react'

/*eslint no-undef: "off"*/

function range(end) {
  return Array(end - 0).fill().map((_, idx) => 0 + idx)
}

class DocumentViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pdfDoc: undefined,
      numPages: 0,
      currentScale: 1,
      scaleFactor: 1.08,
      finishList: [],
      taskList: [],
      rendering: false,
      sampleWidth: undefined,
      sampleHeight: undefined,
      clearnessLevel: 1.8  // too small then not clear, not large then rendering consumes much resource
    }
  }

  componentDidMount() {
    PDFJS.workerSrc = '/static/pdfjs/pdf.worker.js'

    const self = this
    PDFJS.getDocument('/media/pdf/Consent.pdf').then(function(pdf) {  // hard code a pdf ulr and test
      self.setState({
        pdfDoc: pdf,
        numPages: pdf.numPages,
      })
    })
  }

  render() {
    return (
      <div>
      {/* for (var i = 1; i <= pdfDoc.numPages; i++) {
        const new_page_div_id = 'page_div_' + i
        const new_page_canvas_id = 'page_canvas_' + i
        const new_page = "<div class='page_div' id=" + "'" + new_page_div_id + "'>" +
          "<canvas class='PageCanvas' id=" + "'" + new_page_canvas_id + "'" + "></canvas>" +
          "</div>" +
          "<br>"
        appendPages += new_page
      } */}

        {range(this.state.numPages).map((i) =>
          (
            <div className='page-div' key={i}>
              <canvas className='page-canvas'></canvas>
            </div>
          )
        )}
      </div>
    );
  }
}

export { DocumentViewer }




