import './document_viewer.css'

import _ from 'lodash';
import * as actions from '../../actions';

import { ActivityIndicator, Icon, Modal, NavBar, TextareaItem } from 'antd-mobile';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {
  constructGetAnnotationsQueryUrl,
  constructGetDocumentQueryUrl,
  range,
  getNextAnnotation,
  getPrevAnnotation,
} from './document_viewer_helper'
import {
  faPaperPlane,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons'

import AddComment from '@material-ui/icons/AddComment';
import AnnotationThread from './annotation_thread'
import Avatar from '@material-ui/core/Avatar';
import DoneAll from '@material-ui/icons/DoneAll';
import Drawer from '@material-ui/core/Drawer';
import FloatButton from './float_button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Grid from '@material-ui/core/Grid';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import FormatListBulletedRounded from '@material-ui/icons/FormatListBulletedRounded';
import React from 'react'
import { Rnd } from 'react-rnd'
import Tappable from 'react-tappable';
import TextField from '@material-ui/core/TextField';
import axios from 'axios'
import { connect } from 'react-redux';
import { getCookie, getValFromUrlParam, uuidWithHyphen } from '../../utilities/helper';
import { library } from '@fortawesome/fontawesome-svg-core'
import IconButton from '@material-ui/core/IconButton';

library.add(faPaperPlane, faTimesCircle)

// import Drawer from 'rc-drawer';

// const TAP_TIME_THRESHOLD = 180  // in milisecond

/*eslint no-undef: "off"*/

const RENDERING = 'RENDERING'
const ANNOTATION_WIDTH_THRESHOLD = 8
const ANNOTATION_HEIGHT_THRESHOLD = 8
const alert = Modal.alert;


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
    this.annotationFirstTouch = false
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
      annotationLinearLinkedListOpen: false,
      editCommentOpen: false,
      newAnnotationInputOpen: false,
      selectedAnnotation: undefined,
      mode: 'view',  // view or comment
      showFloatButton: true,
      creatingAnnotationAtPageIndex: undefined,
      newAnnotationContent: '',
      newAnnotationReplyContent: '',
      editTextContent: '',
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

    //this.handleScroll = _.throttle(this.handleScroll, 500, { leading: true, trailing: false })

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
      axios.get(constructGetAnnotationsQueryUrl(this.props.match.params.slug, this.props.isGroupDocument)).then(response => {
        var data = response.data

        var annotationsByPage = {}
        var annotations = {}
        for (var i = 1; i <= numPages; i++)
          annotationsByPage[i] = []
        for (var annotation of data) {
          annotationsByPage[parseInt(annotation.page_index)].push(annotation)
          annotations[annotation.uuid] = annotation
        }

        this.setState({ annotations: annotations, annotationsByPage: annotationsByPage })
        console.log(annotations)
        console.log(annotationsByPage)
        this.scrollToTargetAnnotationIfInUrl()
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
        self.pushNewPageRenderingTask(3)
        self.pushNewPageRenderingTask(4)
        self.renderTaskList()
      })
    }

    this.styleDrawer = () => {
      if (this.annotationWrapper === undefined) return
      if (this.annotationWrapper.parentElement.parentElement.classList.contains('annotation-drawer')) return
      this.annotationWrapper.parentElement.parentElement.classList.add('annotation-drawer')
    }

    this.selectAnnotation = (uuid) => {
      if (this.state.selectedAnnotation !== undefined)
        this.annotationAreas[this.state.selectedAnnotation.uuid].classList.remove('highlighted-annotation-area')

      this.setState({selectedAnnotation: this.state.annotations[uuid]})
      this.annotationAreas[uuid].classList.add('highlighted-annotation-area')
      const rgba = this.annotationAreas[uuid].style.background
      this.annotationAreas[uuid].style.borderColor = rgba.split(',').slice(0,3).join(',') + ', 0.38)'

      if (!this.state.annotationOpen) {
        this.styleDrawer()
        this.setState({ annotationOpen: true, annotationLinearLinkedListOpen: false, editCommentOpen: false });
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
      if (this.state.newAnnotationWidth < ANNOTATION_WIDTH_THRESHOLD || this.state.newAnnotationHeight < ANNOTATION_HEIGHT_THRESHOLD)
        return

      var data = new FormData()
      data.append('csrfmiddlewaretoken', getCookie('csrftoken'))
      data.append('operation', 'annotate')
      data.append('page_id', 'page_id_' + this.state.creatingAnnotationAtPageIndex)
      data.append('annotation_content', this.state.newAnnotationContent)
      data.append('top_percent', this.state.newAnnotationY / this.state.sampleHeight)
      data.append('left_percent', this.state.newAnnotationX / this.state.sampleWidth)
      data.append('height_percent', this.state.newAnnotationHeight / this.state.sampleHeight)
      data.append('width_percent', this.state.newAnnotationWidth / this.state.sampleWidth)
      data.append('frame_color', window.getComputedStyle(document.getElementById('annotation-being-created') ,null).getPropertyValue('background-color'))
      data.append('document_id', this.state.document.pk)
      data.append('is_public', true)
      axios.post(window.location.pathname + '/', data).then(response => {
        var newAnnotation = response.data['new_annotation_json']
        var annotationsByPage = this.state.annotationsByPage
        var annotations = this.state.annotations
        annotationsByPage[parseInt(newAnnotation.page_index)].push(newAnnotation)
        annotations[newAnnotation.uuid] = newAnnotation
        this.setState({
          annotations: annotations,
          annotationsByPage: annotationsByPage,
          newAnnotationContent: '',
          mode: 'view', creatingAnnotationAtPageIndex: undefined, newAnnotationInputOpen: false
        })
        document.getElementsByTagName("BODY")[0].removeEventListener('touchmove', this.lockScroll)
      }).catch(err => {
        alert('', 'You need to login to post', [
          { text: 'Cancel', onPress: () => {
            this.setState({newAnnotationContent: '', mode: 'view', creatingAnnotationAtPageIndex: undefined, newAnnotationInputOpen: false})
          } },
          { text: 'Go login', onPress: () => this.props.history.push('/sign-in') },
        ])
      })
    }

    this.cancelCurrentAnnotation = () => {
      this.setState({creatingAnnotationAtPageIndex: undefined, newAnnotationInputOpen: false})
    }

    this.postAnnotationReply = () => {
      var data = new FormData()
      console.log(this.state.replyToAnnotationReplyId)
      data.append('csrfmiddlewaretoken', getCookie('csrftoken'))
      data.append('operation', 'reply_annotation')
      data.append('annotation_reply_content', this.state.newAnnotationReplyContent)
      data.append('reply_to_annotation_id', this.state.selectedAnnotation.pk)
      this.state.replyToAnnotationReplyId && data.append('reply_to_annotation_reply_id', this.state.replyToAnnotationReplyId)
      data.append('document_id', this.state.document.pk)
      data.append('is_public', true)
      axios.post(window.location.pathname + '/', data).then(response => {
        var annotations = this.state.annotations
        annotations[this.state.selectedAnnotation.uuid].replies.push(response.data['new_annotationreply_json'])
        this.setState({
          annotations: annotations,
          newAnnotationReplyContent: '',
          annotationOpen: true, annotationLinearLinkedListOpen: false,
        })
      }).catch(err => {
        alert('', 'You need to login to post', [
          { text: 'Cancel', onPress: () => {
            this.setState({newAnnotationReplyContent: '', annotationOpen: true, annotationLinearLinkedListOpen: false})
          } },
          { text: 'Go login', onPress: () => this.props.history.push('/sign-in') },
        ])
      })
    }

    this.cancelCurrentAnnotationReply = () => {
      this.setState({annotationOpen: true, annotationLinearLinkedListOpen: false,})
    }

    this.postEdit = () => {
      var appName = window.location.pathname.split('/')[1]
      var api = this.state.selectedComment.isAnnotation ? '/api/annotations/' : '/api/annotationreplies/'
      var path = '/' + appName + api + this.state.selectedComment.pk + '/edit'
      console.log(path)
      var data = new FormData()
      data.append('csrfmiddlewaretoken', getCookie('csrftoken'))
      data.append('new_content', this.state.editTextContent)
      axios.post(path, data).then(response => {
        var annotations = this.state.annotations
        if (this.state.selectedComment.isAnnotation) {
          annotations[this.state.selectedAnnotation.uuid].content = this.state.editTextContent
        } else {
          for (var i=0; i < annotations[this.state.selectedAnnotation.uuid].replies.length; i++) {
            if (annotations[this.state.selectedAnnotation.uuid].replies[i].uuid == this.state.selectedComment.uuid) {
              annotations[this.state.selectedAnnotation.uuid].replies[i].content = this.state.editTextContent
              break
            }
          }
        }
        this.setState({
          annotationOpen: true,
          editCommentOpen: false,
          annotations: annotations,
        })
      })
    }

    this.cancelEdit = () => {
      this.setState({annotationOpen: true, editCommentOpen: false,})
    }

    this.scrollToTargetAnnotationIfInUrl = () => {
      var annotation_uuid = getValFromUrlParam('annotation')
      if (annotation_uuid != null) {
        //annotation_uuid = uuidWithHyphen(annotation_uuid)
        if (this.annotationAreas[annotation_uuid] === undefined) return
        this.selectAnnotation(annotation_uuid)
        this.annotationAreas[annotation_uuid].scrollIntoView({block: "start", behavior: "smooth"})
      }
    }
  }

  componentDidMount() {
    axios.get(constructGetDocumentQueryUrl(this.props.match.params.slug, this.props.isGroupDocument)).then(response => {
      this.setState({
        document: response.data
      })
      console.log(response.data)
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
    //this.handleScroll.cancel()
    window.removeEventListener('scroll', this.handleScroll)
    this.changeToViewMode()  // enable scrolling
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
      var target;
      if (e.touches.item(0) === null)
        target = e.target
      else
        target = e.touches.item(0).target
      const annotationBeingCreated = document.getElementById('annotation-being-created')
      if (annotationBeingCreated !== null)
        if (annotationBeingCreated === target || annotationBeingCreated.contains(target))
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
                  if (this.state.creatingAnnotationAtPageIndex !== undefined) return  // && this.state.creatingAnnotationAtPageIndex === pageIndex

                  this.annotationFirstTouch = true
                  const [bottom_right_relative_x, bottom_right_relative_y] = getPositionRelativeToPageTopLeft(e, pageIndex)
                  this.setState({
                    creatingAnnotationAtPageIndex: pageIndex,
                    originalAnnotationX: bottom_right_relative_x,
                    originalAnnotationY: bottom_right_relative_y,
                    newAnnotationX: bottom_right_relative_x,
                    newAnnotationY: bottom_right_relative_y,
                    newAnnotationWidth: 0,
                    newAnnotationHeight: 0,
                  })
                }}
                onTouchMove={(e) => {
                  if (this.state.mode === 'view') return
                  if (gestureOnRND(e)) return
                  if (!this.annotationFirstTouch) return

                  const [bottom_right_relative_x, bottom_right_relative_y] = getPositionRelativeToPageTopLeft(e, pageIndex)
                  var newAnnotationX = bottom_right_relative_x > this.state.originalAnnotationX ? this.state.originalAnnotationX : bottom_right_relative_x
                  newAnnotationX = Math.max(0.01, newAnnotationX)
                  var newAnnotationY = bottom_right_relative_y > this.state.originalAnnotationY ? this.state.originalAnnotationY : bottom_right_relative_y
                  newAnnotationY = Math.max(0.01, newAnnotationY)

                  var newAnnotationWidth = Math.abs(bottom_right_relative_x - this.state.originalAnnotationX)
                  if (bottom_right_relative_x < this.state.originalAnnotationX)
                    newAnnotationWidth = Math.min(newAnnotationWidth, this.state.originalAnnotationX)
                  else
                    newAnnotationWidth = Math.min(newAnnotationWidth, this.state.sampleWidth - newAnnotationX)

                  var newAnnotationHeight = Math.abs(bottom_right_relative_y - this.state.originalAnnotationY)
                  if (bottom_right_relative_y < this.state.originalAnnotationY)
                    newAnnotationHeight = Math.min(newAnnotationHeight, this.state.originalAnnotationY)
                  else
                    newAnnotationHeight = Math.min(newAnnotationHeight, this.state.sampleHeight - newAnnotationY)

                  this.setState({ newAnnotationWidth: newAnnotationWidth, newAnnotationHeight: newAnnotationHeight })
                  this.rnd.updatePosition({ x: newAnnotationX, y: newAnnotationY })
                }}
                onTouchEnd={(e) => {
                  if (this.state.mode === 'view') return
                  if (gestureOnRND(e)) return
                  this.setState({
                    newAnnotationX: this.rnd.draggable.state.x,
                    newAnnotationY: this.rnd.draggable.state.y,
                    newAnnotationWidth: this.rnd.props.size.width,
                    newAnnotationHeight: this.rnd.props.size.height,
                  })
                  if (this.annotationFirstTouch) {
                    this.annotationFirstTouch = false
                    this.setState({newAnnotationInputOpen: true})
                    return
                  }
                }}
              >
                <canvas style={{position: 'absolute'}} className='page-canvas' id={'page-canvas-' + (i + 1)}></canvas>
                {
                  this.state.creatingAnnotationAtPageIndex === pageIndex ?
                  <Rnd
                    ref={c => { this.rnd = c; }}
                    bounds='parent'
                    size={{ width: this.state.newAnnotationWidth,  height: this.state.newAnnotationHeight }}
                    id='annotation-being-created'
                    className='annotation-area'
                    onDragStop={(e, d) => { this.setState({ newAnnotationX: d.x, newAnnotationY: d.y }) }}
                    onResizeStop={(e, direction, ref, delta, position) => {
                      direction = direction.toLowerCase()
                      this.setState({
                        newAnnotationWidth: parseFloat(ref.style.width),
                        newAnnotationHeight: parseFloat(ref.style.height),
                        newAnnotationX: position.x - (direction.includes("left") ? delta.width : 0),
                        newAnnotationY: position.y - (direction.includes("top") ? delta.height : 0),
                      });
                    }}
                  >
                  </Rnd> : null
                }
                {
                  this.state.annotationsByPage[pageIndex] !== undefined ?
                    this.state.annotationsByPage[pageIndex].map(annotation =>
                      <Tappable
                        key={annotation.pk}
                        moveThreshold={10}
                        onTap={() => {
                          if (this.state.mode === 'comment') return
                          this.selectAnnotation(annotation.uuid)
                        }}
                      >
                        <div
                          className='annotation-area'
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
          icon={<Icon type="left" onClick={() => {
            // handle case where user clicks on a document link that opens
            // a new browser tab. in this case, history.goBack() will
            // do nothing since there is no previous page.
            if (this.props.history && this.props.history.length < 2) {
              // TODO: if this is a group's document, go to the group's explore instead

              // else go to public explore
              this.props.history.push('/explore')
            } else {
              this.props.history.goBack()
            }
          }}/>}
          rightContent={[
            <Icon key="1" type="ellipsis" />,
          ]}
          style={{
            boxShadow: '0px 1px 3px rgba(28, 28, 28, .1)',
            zIndex: 10000000, position: 'relative',
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
          <div>
            <Grid container justify='space-between' className='annotation-thread-navbar'>
              <IconButton component="span"
                disabled={getPrevAnnotation(this.state.selectedAnnotation, this.state.annotationsByPage) === undefined}
                onClick={e => {
                  const toAnnotation = getPrevAnnotation(this.state.selectedAnnotation, this.state.annotationsByPage)
                  this.selectAnnotation(toAnnotation.uuid)
                  var topOfElement = document.querySelector('#page-canvas-'+toAnnotation.page_index).parentNode.offsetTop +
                                     this.annotationAreas[toAnnotation.uuid].offsetTop - 10
                  window.scroll({ top: topOfElement, behavior: "smooth" });
                }}
              >
                <KeyboardArrowLeft />
              </IconButton>
              <Grid>
                <Grid container justify='flex-end'>
                  <IconButton component="span" onClick={e => this.props.history.push(window.location.pathname+'/annotations')}>
                    <FormatListBulletedRounded />
                  </IconButton>
                  <IconButton component="span"
                    disabled={getNextAnnotation(this.state.selectedAnnotation, this.state.annotationsByPage, this.state.numPages) === undefined}
                    onClick={e => {
                      const toAnnotation = getNextAnnotation(this.state.selectedAnnotation, this.state.annotationsByPage, this.state.numPages)
                      this.selectAnnotation(toAnnotation.uuid)
                      var topOfElement = document.querySelector('#page-canvas-'+toAnnotation.page_index).parentNode.offsetTop +
                                        this.annotationAreas[toAnnotation.uuid].offsetTop - 10
                      window.scroll({ top: topOfElement, behavior: "smooth" });
                    }}
                  >
                    <KeyboardArrowRight />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>

            <div ref={ele => this.annotationWrapper = ele}>
              {
                selectedAnnotation !== undefined ? (
                  <AnnotationThread
                    document={this.state.document}
                    selectedAnnotation={selectedAnnotation}
                    annotationArea={this.annotationAreas[selectedAnnotation.uuid]}
                    annotations={this.state.annotations}
                    annotationsByPage={this.state.annotationsByPage}
                    setParentState={this.setState.bind(this)}
                    pdfDocument={this.state.document}
                  />
                ) : null
              }
            </div>
          </div>
        </Drawer>

        <Drawer
          anchor="bottom" variant='persistent'
          open={this.state.newAnnotationInputOpen}
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
              alt="User Portrait"
              style={{ float: 'left', marginTop: '2%', marginLeft: '2%'}}
              src={this.props.user.portrait_url}
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
                // onFocus={() => {
                //   window.scrollTo(0, document.getElementById('annotation-being-created').getBoundingClientRect().top + window.scrollY)
                // }}
                placeholder="Type in your comment..." margin="normal" style={{width: '66vw', top: -2}}
                multiline fullWidth value={this.state.newAnnotationContent}
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

        <Drawer
          anchor="bottom"
          open={this.state.annotationLinearLinkedListOpen}
          onClose={() => this.reopenAnnotationThread()}
          variant='persistent'
        >
          {/* <Grid container justify="space-between" alignItems="center"> */}
          <div style={{textAlign: 'center'}}>
            <Avatar
              alt="User Portrait"
              style={{ float: 'left', marginTop: '2%', marginLeft: '2%'}}
              src={this.props.user.portrait_url}
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
                ref={ele => this.annotationReplyText = ele}
                // className={classes.textField}
                // defaultValue="Bare"
                placeholder="Type in your reply..." margin="normal" style={{width: '66vw', top: -2}}
                multiline fullWidth value={this.state.newAnnotationReplyContent}
                onChange={event => {
                  this.setState({newAnnotationReplyContent: event.target.value})
                }}
              />
            </MuiThemeProvider>
            {
              this.state.newAnnotationReplyContent.length === 0
              ? <FontAwesomeIcon icon={['fas', 'times-circle']} className='cancel-comment-btn' onClick={this.cancelCurrentAnnotationReply} />
              : <FontAwesomeIcon icon={['fas', 'paper-plane']} className='commit-comment-btn' onClick={this.postAnnotationReply} />
            }
          </div>
          {/* </Grid> */}
        </Drawer>

        <Drawer
          anchor="bottom"
          open={this.state.editCommentOpen}
          onClose={() => this.reopenAnnotationThread()}
          variant='persistent'
        >
          {/* <Grid container justify="space-between" alignItems="center"> */}
          <div style={{textAlign: 'center'}}>
            <Avatar
              alt="User Portrait"
              style={{ float: 'left', marginTop: '2%', marginLeft: '2%'}}
              src={this.props.user.portrait_url}
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
                ref={ele => this.editText = ele}
                // className={classes.textField}
                // defaultValue="Bare"
                placeholder="Type in your edit..." margin="normal" style={{width: '66vw', top: -2}}
                multiline fullWidth value={this.state.editTextContent}
                onChange={event => {
                  this.setState({editTextContent: event.target.value})
                }}
              />
            </MuiThemeProvider>
            {
              this.state.editTextContent.length === 0
              ? <FontAwesomeIcon icon={['fas', 'times-circle']} className='cancel-comment-btn' onClick={this.cancelEdit} />
              : <FontAwesomeIcon icon={['fas', 'paper-plane']} className='commit-comment-btn' onClick={this.postEdit} />
            }
          </div>
          {/* </Grid> */}
        </Drawer>

        { this.state.mode === 'view'
          ? <FloatButton color='rgb(27, 163, 156)' icon={<AddComment style={{ color: 'white' }} />} show={this.state.showFloatButton} clickCallback={this.changeToCommentMode} />
          : <FloatButton color='#108ee9' icon={<DoneAll style={{ color: 'white' }} />} show={true} clickCallback={this.changeToViewMode} />}
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    user: state.user,
    coteries: state.coteries
  };
}

export default connect(mapStateToProps, actions)(DocumentViewer);
