import React from 'react'
import axios from 'axios'

/*eslint no-undef: "off"*/

function range(end) {
  return Array(end - 0).fill().map((_, idx) => 0 + idx)
}

class DocumentViewer extends React.Component {
  constructor(props) {
    super(props)

    this.document = undefined
    this.pdfDoc = undefined
    this.taskList = []
    this.finishList = []
    this.rendering = false
    this.clearnessLevel = 3.8  // too small then not clear, not large then rendering consumes much resource
    this.currentPageIndex = 1
    this.state = {
      numPages: 0,
      currentScale: 1,
      scaleFactor: 1.08,
      sampleWidth: undefined,
      sampleHeight: undefined,
      annotations: [],
      // pageCanvasWidth: 660,
    }

    this.handleScroll = () => {
      var pageIndex = Math.ceil((window.pageYOffset / this.viewerWrappper.scrollHeight * this.state.numPages))
      if (pageIndex === this.currentPageIndex)
        return

      this.currentPageIndex = pageIndex

      const left = 2
      const right = 6
      var renderOrNot = range(right + left + 1).map(i => true)

      // clear pages which are out of view
      var index = 0
      for (var i = 0; i < this.finishList.length; i++) {
        if (this.finishList[index] - pageIndex >= -left && this.finishList[index] - pageIndex <= right) {
          renderOrNot[this.finishList[index] - (pageIndex - left)] = false
          index += 1
        } else {
          var pre = document.getElementById('page-canvas-' + this.finishList[index])
          pre.width = 0
          pre.height = 0
          this.finishList.splice(index, 1)
        }
      }
      // keep the first renderTask since it is still in RENDERING status,
      // delete the rest since they are in PENDING status
      this.taskList.splice(1)
      // add in the new task
      for (var i = 0; i < renderOrNot.length; i++)
        if (renderOrNot[i])
          this.pushNewPageRenderingTask(pageIndex - left + i)
      // console.log(this.taskList.map(t => t.pageIndex))
      // console.log(this.rendering)
      if (!this.rendering)
        this.renderTaskList()
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
      this.pdfDoc.getPage(currentPageIndex).then(function(page) {
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
    axios.get('/file_viewer/api/documents/' + this.props.documentPk).then(response => {
      this.document = response.data
      PDFJS.workerSrc = '/static/pdfjs/pdf.worker.js'

      const self = this

      PDFJS.getDocument(this.document.url).then(function(pdf) {  // hard code a pdf ulr and test
        self.pdfDoc = pdf
        self.setState({
          numPages: pdf.numPages,
        })

        pdf.getPage(pdf.numPages).then(function(lastPage) {
          var currentScale = (window.innerWidth * 100 / 100) / lastPage.getViewport(1).width

          self.setState({
            currentScale: currentScale,
            sampleWidth: lastPage.getViewport(currentScale).width,
            sampleHeight: lastPage.getViewport(currentScale).height
          })
          self.pushNewPageRenderingTask(1)
          self.pushNewPageRenderingTask(2)
          self.renderTaskList()
        })
      })

      window.addEventListener('scroll', this.handleScroll, { passive: true })
    })

    axios.get('/file_viewer/api/documents/' + this.props.documentPk + '/annotations').then(response => {
      console.log(response.data)
      this.setState({annotations: response.data})
    })
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
              style={{width: this.state.sampleWidth, height: this.state.sampleHeight}}
            >
              <canvas className='page-canvas' id={'page-canvas-' + (i + 1)}></canvas>
            </div>
          )
        )}
      </div>
    );
  }
}

export { DocumentViewer }




