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
      scale: 1,
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

    this.handleScroll = () => {
      console.log(window.pageYOffset)
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

      var clearnessLevel = self.state.clearnessLevel
      var scale = self.state.scale
      const renderPage = function(num, page) {
        var pageCanvasId = 'page-canvas-' + num
        var canvas = document.getElementById(pageCanvasId)
        var context = canvas.getContext('2d')
        var viewport = page.getViewport(clearnessLevel * scale)
        console.log('test')
        canvas.height = viewport.height
        canvas.width = viewport.width
        canvas.style.height = viewport.height / clearnessLevel + 'px'
        canvas.style.width = viewport.width / clearnessLevel + 'px'

        var renderContext = {
          canvasContext: context,
          viewport: viewport,
        }

        page.render(renderContext)
      }

      {range(self.state.numPages).map((i) =>
        pdf.getPage(i+1).then((page) => renderPage(i, page))
      )}
    })

    window.addEventListener('scroll', this.handleScroll, { passive: true })
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  render() {
    return (
      <div ref={(ele) => this.viewerWrappper = ele}>
        {range(this.state.numPages).map((i) =>
          (
            <div className='page-div' key={i} id={'page-div-' + i}>
              <canvas className='page-canvas' id={'page-canvas-' + i}></canvas>
            </div>
          )
        )}
        <h1>test</h1>
        <h1>test</h1>
        <h1>test</h1>
        <h1>test</h1>
        <h1>test</h1>
        <h1>test</h1>
        <h1>test</h1>
        <h1>test</h1>
        <h1>test</h1>
        <h1>test</h1>
      </div>
    );
  }
}

export { DocumentViewer }
