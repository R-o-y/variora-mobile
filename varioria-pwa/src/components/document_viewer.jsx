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
      clearnessLevel: 1.28,  // too small then not clear, not large then rendering consumes much resource

      pageDivWidth: 660,
      // pageCanvasWidth: 660,
    }

    this.handleScroll = () => {
      console.log(window.pageYOffset)
    }

    this.renderPage = function(num, page, scale) {
      var clearnessLevel = this.state.clearnessLevel
      var canvas = document.getElementById('page-canvas-' + num)
      var context = canvas.getContext('2d')
      var viewport = page.getViewport(clearnessLevel * scale)
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
  }

  componentDidMount() {
    PDFJS.workerSrc = '/static/pdfjs/pdf.worker.js'

    const self = this

    PDFJS.getDocument('/media/pdf/Consent.pdf').then(function(pdf) {  // hard code a pdf ulr and test
      self.setState({
        pdfDoc: pdf,
        numPages: pdf.numPages,
      })

      pdf.getPage(pdf.numPages).then(function(lastPage) {
        var currentScale = (window.innerWidth * 0.8) / lastPage.getViewport(1).width

        self.setState({
          currentScale: currentScale,
          pageDivWidth: lastPage.getViewport(currentScale).width,
          sampleHeight: lastPage.getViewport(currentScale).height
        })

        self.state.pdfDoc.getPage(1).then((page) => self.renderPage(1, page, currentScale))
      })
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
            <div className='page-div' key={i + 1} id={'page-div-' + (i + 1)}
              style={{width: this.state.pageDivWidth}}
            >
              <canvas className='page-canvas' id={'page-canvas-' + (i + 1)}
                // style={{width: this.state.pageCanvasWidth}}
              ></canvas>
            </div>
          )
        )}
        {/* <h1>test</h1>
        <h1>test</h1>
        <h1>test</h1>
        <h1>test</h1>
        <h1>test</h1>
        <h1>test</h1>
        <h1>test</h1>
        <h1>test</h1>
        <h1>test</h1>
        <h1>test</h1> */}
      </div>
    );
  }
}

export { DocumentViewer }




