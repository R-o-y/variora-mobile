import './document_viewer.css'

import { ActivityIndicator, Icon, NavBar, TextareaItem } from 'antd-mobile';
import {
  constructGetAnnotationsQueryUrl,
  constructGetDocumentQueryUrl,
  range,
} from './document_viewer_helper'

import AddComment from '@material-ui/icons/AddComment';
import AnnotationThread from './annotation_thread'
import DoneAll from '@material-ui/icons/DoneAll';
import Drawer from '@material-ui/core/Drawer';
import FloatButton from './float_button'
import React from 'react'
import { Rnd } from 'react-rnd'
import Tappable from 'react-tappable';
import axios from 'axios'
import TextField from '@material-ui/core/TextField';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPaperPlane, faTimesCircle
} from '@fortawesome/free-solid-svg-icons'

library.add(faPaperPlane, faTimesCircle)

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
      newAnnotationInputOpen: false,
      selectedAnnotation: undefined,
      mode: 'view',  // view or comment
      showFloatButton: true,
      creatingAnnotationAtPageIndex: undefined,
      newAnnotationContent: '',
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

    this.lockScroll = (e) => {
      if (e.targetTouches.length === 1)
        e.preventDefault()
    }

    this.changeToCommentMode = () => {
      this.setState({mode: 'comment'})
      document.getElementsByTagName("BODY")[0].addEventListener('touchmove', this.lockScroll, { passive: false })
    }

    this.changeToViewMode = () => {
      this.setState({mode: 'view', creatingAnnotationAtPageIndex: undefined, newAnnotationInputOpen: false})
      document.getElementsByTagName("BODY")[0].removeEventListener('touchmove', this.lockScroll)
    }

    this.postAnnotation = () => {
      // axios here
      this.setState({mode: 'view', creatingAnnotationAtPageIndex: undefined, newAnnotationInputOpen: false})
    }

    this.cancelCurrentAnnotation = () => {
      this.setState({creatingAnnotationAtPageIndex: undefined, newAnnotationInputOpen: false})
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

    function getPositionRelativeToPageTopLeft(e, pageIndex) {
      var touch_absolute_x = e.touches.item(0).pageX  // relative to the left top corner of the body
      var touch_absolute_y = e.touches.item(0).pageY
      const page = document.getElementById('page-div-' + pageIndex)
      const page_top_left_x = page.offsetLeft
      const page_top_left_y = page.offsetTop
      return [touch_absolute_x - page_top_left_x, touch_absolute_y - page_top_left_y]
    }

    function gestureOnRND(e) {
      const annotationBeingCreated = document.getElementById('annotation-being-created')
      if (annotationBeingCreated !== null)
        if (annotationBeingCreated === e.touches.item(0).target || annotationBeingCreated.contains(e.touches.item(0).target))
          return true
      return false
    }

    var viewWrapper = (
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
                onTouchStart={(e) => {
                  if (this.state.mode === 'view') return
                  if (gestureOnRND(e)) return

                  const [bottom_right_relative_x, bottom_right_relative_y] = getPositionRelativeToPageTopLeft(e, pageIndex)
                  this.setState({
                    creatingAnnotationAtPageIndex: pageIndex,
                    newAnnotationX: bottom_right_relative_x,
                    newAnnotationY: bottom_right_relative_y,
                    newAnnotationWidth: 0,
                    newAnnotationHeight: 0,
                  })
                }}
                onTouchMove={(e) => {
                  if (this.state.mode === 'view') return
                  if (gestureOnRND(e)) return

                  const [bottom_right_relative_x, bottom_right_relative_y] = getPositionRelativeToPageTopLeft(e, pageIndex)
                  this.setState({
                    creatingAnnotationAtPageIndex: pageIndex,
                    newAnnotationWidth: bottom_right_relative_x - this.state.newAnnotationX,
                    newAnnotationHeight: bottom_right_relative_y - this.state.newAnnotationY,
                  })

                }}
                onTouchEnd={(e) => {
                  if (this.state.mode === 'view') return
                  console.log(this.state.newAnnotationX)
                  console.log(this.state.newAnnotationY)
                  console.log(this.state.newAnnotationWidth)
                  console.log(this.state.newAnnotationHeight)
                  this.setState({newAnnotationInputOpen: true})
                }}
              >
                <canvas style={{position: 'absolute'}} className='page-canvas' id={'page-canvas-' + (i + 1)}></canvas>
                {
                  this.state.creatingAnnotationAtPageIndex === pageIndex ?
                  <Rnd
                    id='annotation-being-created'
                    className='annotation-area'
                    size={{ width: this.state.newAnnotationWidth,  height: this.state.newAnnotationHeight }}
                    position={{ x: this.state.newAnnotationX, y: this.state.newAnnotationY }}
                    onDragStop={(e, d) => { this.setState({ newAnnotationX: d.x, newAnnotationY: d.y }) }}
                    onResize={(e, direction, ref, delta, position) => {
                      this.setState({
                        newAnnotationWidth: ref.style.width,
                        newAnnotationHeight: ref.style.height,
                        ...position,
                      });
                    }}
                    style={{backgroundColor: 'rgba(0, 170, 0, 0.18)'}}
                  >
                  </Rnd> : null
                }
                {
                  this.state.annotationsByPage[pageIndex] !== undefined ?
                    this.state.annotationsByPage[pageIndex].map(annotation =>
                      <Tappable
                        moveThreshold={10}
                        onTap={() => {
                          if (this.state.mode === 'comment') return
                          this.selectAnnotation(annotation.uuid)
                        }}
                      >
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
                        >
                        </div>
                      </Tappable>
                    ) : null
                }
              </div>
            )
          })
        }
      </div>
    )

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
            if (this.state.mode === 'comment') return
            const target = e.target
            if (target.classList.contains('page-canvas'))
              this.deselectAnnotation()
            this.setState({showFloatButton: !this.state.showFloatButton})
            // }
            // this.touchLength = 0
            // clearInterval(this.touchTimer)
          }}
        >
          {viewWrapper}
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

        <Drawer
          anchor="bottom"
          open={this.state.newAnnotationInputOpen}
          variant='persistent'
        >
          <div style={{textAlign: 'center'}}>
            {/* <TextareaItem
              title={<img
                alt="Remy Sharp"
                style={{ height: 28, width: 28 }}
                src="https://pmcvariety.files.wordpress.com/2015/07/naruto_movie-lionsgate.jpg?w=1000"
              />}
              placeholder="auto focus in Alipay client"
              data-seed="logId"
              ref={el => this.autoFocusInst = el}
              autoHeight
            /> */}
            <Avatar
              alt="Remy Sharp"
              style={{ float: 'left', marginTop: '2%', marginLeft: '2%'}}
              src="https://pmcvariety.files.wordpress.com/2015/07/naruto_movie-lionsgate.jpg?w=1000"
            />
            <MuiThemeProvider theme={createMuiTheme({
                palette: {
                  primary: {
                    main: '#3498db',
                  }
                },
              })}
            >
              <TextField
                id="standard-bare"
                // className={classes.textField}
                // defaultValue="Bare"
                placeholder="Placeholder"
                margin="normal"
                style={{width: '66vw', top: -2}}
                multiline
                fullWidth
                value={this.state.newAnnotationContent}
                onChange={event => {
                  this.setState({newAnnotationContent: event.target.value})
                }}
              />
            </MuiThemeProvider>
            {
              this.state.newAnnotationContent.length === 0
              ? <FontAwesomeIcon icon={['fas', 'times-circle']} id='cancel-annotation-btn' onClick={this.cancelCurrentAnnotation} />
              : <FontAwesomeIcon icon={['fas', 'paper-plane']} id='post-annotation-btn' onClick={this.postAnnotation} />
            }
          </div>
        </Drawer>

        { this.state.mode === 'view'
          ? <FloatButton color='rgb(27, 163, 156)' icon={<AddComment style={{ color: 'white' }} />} show={this.state.showFloatButton} clickCallback={this.changeToCommentMode} />
          : <FloatButton color='#108ee9' icon={<DoneAll style={{ color: 'white' }} />} show={true} clickCallback={this.changeToViewMode} />}
      </div>
    );
  }
}

export default DocumentViewer;
