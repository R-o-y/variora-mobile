import React from 'react'

/*eslint no-undef: "off"*/

function range(end) {
  return Array(end - 0).fill().map((_, idx) => 0 + idx)
}

class DocumentViewer extends React.Component {
  constructor(props) {
    super(props)
    this.taskList = []
    this.finishList = []
    this.rendering = false
    this.clearnessLevel = 1.38  // too small then not clear, not large then rendering consumes much resource
    this.state = {
      pdfDoc: undefined,
      numPages: 0,
      currentScale: 1,
      scaleFactor: 1.08,
      sampleWidth: undefined,
      sampleHeight: undefined,

      pageDivWidth: 0,
      // pageCanvasWidth: 660,
    }

    this.handleScroll = () => {
      console.log(window.pageYOffset)
    }

    this.pushNewPageRenderingTask = (pageIndex) => {
      if (pageIndex >= 1 && pageIndex <= this.state.numPages)
        this.taskList.push({
          pageIndex: pageIndex,
          status: 'PENDING',
          taskObj: null,
        })
    }

    this.renderTaskList = () => {
      if (this.taskList.length <= 0)
        return
      this.rendering = true
      var scale = this.state.currentScale
      var clearnessLevel = this.clearnessLevel

      var currentPageIndex = this.taskList[0].pageIndex
      const self = this
      this.state.pdfDoc.getPage(currentPageIndex).then(function(page) {
        var canvas = document.getElementById('page-canvas-' + currentPageIndex)
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
        self.taskList[0].status = 'RENDERING'
        self.taskList[0].taskObj = page.render(renderContext)
        self.taskList[0].taskObj.promise.then(function() {
          self.taskList.shift()
          self.finishList.push(currentPageIndex)
          self.rendering = false
          self.renderTaskList()
        })
      })
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
        var currentScale = (window.innerWidth * 100 / 100) / lastPage.getViewport(1).width

        self.setState({
          currentScale: currentScale,
          pageDivWidth: lastPage.getViewport(currentScale).width,
          sampleHeight: lastPage.getViewport(currentScale).height
        })
        self.pushNewPageRenderingTask(1)
        self.pushNewPageRenderingTask(2)
        self.renderTaskList()
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
      </div>
    );
  }
}

export { DocumentViewer }




