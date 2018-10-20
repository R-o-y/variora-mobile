import './document_viewer.css'

import { ActivityIndicator, Icon, NavBar } from 'antd-mobile';
import {
  constructGetAnnotationsQueryUrl,
  constructGetDocumentQueryUrl,
  range,
} from './document_viewer_helper'

import AnnotationThread from './annotation_thread'
import Drawer from '@material-ui/core/Drawer';
import FloatButton from './float_button'
import React from 'react'
import Rnd from 'react-rnd'
import Tappable from 'react-tappable';
import axios from 'axios'

var HtmlToReactParser = require('html-to-react').Parser;
var htmlToReactParser = new HtmlToReactParser();
// import Drawer from 'rc-drawer';

// const TAP_TIME_THRESHOLD = 180  // in milisecond

/*eslint no-undef: "off"*/

const RENDERING = 'RENDERING'
class DocumentViewer extends React.Component {
  constructor(props) {
    super(props)

    this.pdfDoc = undefined
    this.taskList = []
    this.finishList = []
    this.rendering = false
    this.clearnessLevel = 3.8  // too small then not clear, not large then rendering consumes much resource
    this.currentPageIndex = 1
    this.annotationAreas = {}
    this.prevScroll = window.pageYOffset
    // this.touchLength = 0
    this.state = {
      document: {
        title: ''
      },
      loading: true,
      numPages: 0,
      currentScale: 1,
      scaleFactor: 1.08,
      sampleWidth: undefined,
      sampleHeight: undefined,
      annotations: {},
      annotationsByPage: {},
      annotationOpen: false,
      selectedAnnotation: undefined,
      mode: 'view',  // view or comment
      showFloatButton: true,
      // pageCanvasWidth: 660,
    }

    this.dynamicRenderOnScroll = () => {
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
      if (!this.rendering)
        this.renderTaskList()
    }

    this.handleScroll = () => {
      this.dynamicRenderOnScroll()
      const thisScroll = window.pageYOffset
      if (thisScroll - this.prevScroll > 8)  // scroll down
        this.setState({showFloatButton: false})
      else if (this.prevScroll - thisScroll > 8)
        this.setState({showFloatButton: true})
      this.prevScroll = thisScroll
    }

    this.pushNewPageRenderingTask = (pageIndex) => {
      if (pageIndex >= 1 && pageIndex <= this.state.numPages)
        this.taskList.push({
          pageIndex: pageIndex,
          status: RENDERING,
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
        if (canvas === null) return
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
        self.taskList[0].status = RENDERING
        self.taskList[0].taskObj = page.render(renderContext)
        self.taskList[0].taskObj.promise.then(function() {
          self.taskList.shift()
          self.finishList.push(currentPageIndex)
          self.rendering = false
          self.renderTaskList()
        })
      })
    }

    this.renderAnnotationAreas = (numPages) => {
      axios.get(constructGetAnnotationsQueryUrl(this.props.match.params.slug )).then(response => {
        var data = response.data

        var annotationsByPage = {}
        var annotations = {}
        for (var i = 1; i <= numPages; i++)
          annotationsByPage[i] = []
        for (var annotation of data) {
          annotationsByPage[parseInt(annotation.page_index)].push(annotation)
          annotations[annotation.uuid] = annotation
        }

        this.setState({
          annotations: annotations,
          annotationsByPage: annotationsByPage
        })
        console.log(annotations)
        console.log(annotationsByPage)
      })
    }

    this.configSizeAccordingToLastPageAndRenderTheFirstSeveralPages = (pdf) => {
      const self = this
      pdf.getPage(pdf.numPages).then(function(lastPage) {
        var currentScale = (window.innerWidth * 1.0) / lastPage.getViewport(1).width

        self.setState({
          currentScale: currentScale,
          sampleWidth: lastPage.getViewport(currentScale).width,
          sampleHeight: lastPage.getViewport(currentScale).height
        })
        self.pushNewPageRenderingTask(1)
        self.pushNewPageRenderingTask(2)
        self.renderTaskList()
      })
    }

    this.styleDrawer = () => {
      if (this.annotationWrapper === undefined) return
      if (this.annotationWrapper.parentElement.classList.contains('annotation-drawer')) return
      this.annotationWrapper.parentElement.classList.add('annotation-drawer')
    }

    this.selectAnnotation = (uuid) => {
      if (this.state.selectedAnnotation !== undefined)
        this.annotationAreas[this.state.selectedAnnotation.uuid].classList.remove('highlighted-annotation-area')
      this.setState({selectedAnnotation: this.state.annotations[uuid]})
      this.annotationAreas[uuid].classList.add('highlighted-annotation-area')

      if (!this.state.annotationOpen) {
        this.styleDrawer()
        this.setState({ annotationOpen: true });
      }
    }

    this.deselectAnnotation = () => {
      if (this.state.selectedAnnotation !== undefined)
        this.annotationAreas[this.state.selectedAnnotation.uuid].classList.remove('highlighted-annotation-area')
      this.setState({ annotationOpen: false });
      this.setState({ selectedAnnotation: undefined })
    }
  }

  componentDidMount() {
    axios.get(constructGetDocumentQueryUrl(this.props.match.params.slug)).then(response => {
      this.setState({
        document: response.data
      })
      PDFJS.workerSrc = '/static/pdfjs/pdf.worker.js'

      const self = this
      PDFJS.getDocument(response.data.url).then(function(pdf) {  // hard code a pdf ulr and test
        self.pdfDoc = pdf
        self.setState({
          numPages: pdf.numPages,
        })
        self.setState({loading: false})
        self.renderAnnotationAreas(pdf.numPages)
        self.configSizeAccordingToLastPageAndRenderTheFirstSeveralPages(pdf)
      })

      window.addEventListener('scroll', this.handleScroll, { passive: true })
    })
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  render() {
    var selectedAnnotation = this.state.selectedAnnotation
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" onClick={() => this.props.history.goBack()}/>}
          rightContent={[
            <Icon key="1" type="ellipsis" />,
          ]}
          style={{
            boxShadow: '0px 1px 3px rgba(28, 28, 28, .1)',
            zIndex: 10000000,
            position: 'relative',
            // borderBottom: '1px solid #c8c8c8',
            // height: 38
          }}
        >
          <span className='document-title'>{this.state.document.title}</span>
        </NavBar>

        <ActivityIndicator toast animating={this.state.loading} />

        <Tappable
          // onTouchStart={e => this.touchTimer = setInterval((() => this.touchLength += 10), 10)}
          moveThreshold={10}
          onTap={(e) => {
            // console.log(e.targetTouches)
            // console.log(e.target)
            // console.log(e.touches)
            // console.log(this.touchLength)
            // if (this.touchLength < TAP_TIME_THRESHOLD) {
            const target = e.target
            if (target.classList.contains('page-canvas'))
              this.deselectAnnotation()
            this.setState({showFloatButton: !this.state.showFloatButton})
            // }
            // this.touchLength = 0
            // clearInterval(this.touchTimer)
          }}
        >
          <div
            ref={(ele) => this.viewerWrappper = ele}
            className='viewer-wrapper'
          >
            {
              range(this.state.numPages).map((i) => {
                const pageIndex = i + 1
                return (
                  <div
                    className='page-div' key={pageIndex}
                    id={'page-div-' + pageIndex}
                    style={{position: 'relative', width: this.state.sampleWidth, height: this.state.sampleHeight}}
                  >
                    <canvas style={{position: 'absolute'}} className='page-canvas' id={'page-canvas-' + (i + 1)}></canvas>
                    {
                      this.state.annotationsByPage[pageIndex] !== undefined ?
                        this.state.annotationsByPage[pageIndex].map(annotation =>
                          <div
                            className='annotation-area'
                            key={annotation.pk}
                            style={{
                              background: annotation.frame_color,
                              position: 'absolute',
                              width: this.state.sampleWidth * annotation.width_percent,
                              height: this.state.sampleHeight * annotation.height_percent,
                              left: this.state.sampleWidth * annotation.left_percent,
                              top: this.state.sampleHeight * annotation.top_percent,
                            }}
                            ref={ele => this.annotationAreas[annotation.uuid] = ele}
                            annotation-id={annotation.pk}
                            annotation-uuid={annotation.uuid}
                            onTouchEnd={() => this.selectAnnotation(annotation.uuid)}
                          >
                          </div>
                        ) : null
                    }
                  </div>
                )
              })
            }
          </div>
        </Tappable>

        <Drawer
          anchor="bottom"
          open={this.state.annotationOpen}
          onClose={() => this.deselectAnnotation()}
          // ModalProps={{BackdropProps: {invisible: true}}}
          variant='persistent'
        >
          <div ref={ele => this.annotationWrapper = ele}>
            {
              selectedAnnotation !== undefined ? (
                <AnnotationThread selectedAnnotation={selectedAnnotation} />
              ) : null
            }
          </div>
        </Drawer>
        <FloatButton show={this.state.showFloatButton}/>
      </div>
    );
  }
}

export default DocumentViewer;
