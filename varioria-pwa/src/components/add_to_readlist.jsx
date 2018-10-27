import _ from 'lodash';
import React from 'react'
import { NavBar, Icon, ActivityIndicator, List, WhiteSpace, Button } from 'antd-mobile';
import { connect } from 'react-redux';
import Navbar from './nav_bar';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as actions from '../actions';
import { StickyContainer } from 'react-sticky';
import Checkbox from '@material-ui/core/Checkbox';
import { getCookie } from '../utilities/helper';

class AddToReadlist extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      currDocument: {},
      readlists: []
    }
  }

  componentDidMount() {
    let groupUuid = this.props.match.params.groupUuid;
    const fetchData = async () => {
      try {
        if (groupUuid) {
        } else {
          await this.props.getMyDocuments();
          await this.props.getMyReadlists();
        }
      } catch (error) {
        console.error(error);
        return;
      }
      const currDocument = this.props.documents[window.location.href.split('/').pop()]
      const currDocumentUuid = currDocument.uuid.replace(/-/g, '');
      let readlists = this.props.user.createdReadlists.map(slug => {
        let element = this.props.readlists[slug];
          return {
            uuid: element.uuid,
            name: element.name,
            count: element.documents_uuids.length,
            checked: element.documents_uuids.includes(currDocumentUuid)
          }
        })
      this.setState({currDocument: currDocument, loading: false, readlists: readlists})
    }
    fetchData();
  }

  handleChange = (index) => () => {
    console.log(this.state);
    const {readlists} = this.state;
    readlists[index].checked = !readlists[index].checked;
    readlists[index].checked ? readlists[index].count++ : readlists[index].count--;
    this.setState({
      readlists
    });    
  }

  handleSubmit = () => {
    const {currDocument, readlists} = this.state;
    const addReadlists = readlists.filter((element) => {return element.checked}).map((element) => {return element.uuid});
    const removeReadlists = readlists.filter((element) => {return !element.checked}).map((element) => {return element.uuid});
    let data = new FormData();
    data.append('csrfmiddlewaretoken', getCookie('csrftoken'));
    for (let i = 0; i < addReadlists.length; i++) {
      data.append('add_readlists[]', addReadlists[i]);
    }
    for (let i = 0; i < removeReadlists.length; i++) {
      data.append('remove_readlists[]', removeReadlists[i]);
    }
    this.props.documentChangeReadlists(currDocument.pk, data);
    this.props.history.goBack();
  }

  renderOwnedReadlists() {
    if (_.isEmpty(this.state.readlists)) {
      return (
        <div></div>
      )
    }
    const data = this.state.readlists.map((readlist, index) => {
      return (
        <div key={readlist.uuid}>
          <List.Item
            thumb={<Checkbox
              checked={readlist.checked}
              onChange={this.handleChange(index)}
            />}
            multipleLine
          >
            {readlist.name}
            <List.Item.Brief>{readlist.count + " Document(s)"}</List.Item.Brief>
          </List.Item>
        </div>
      )
    })
    return (
      <div>
        <List>
          {data}
          <List.Item>
            <Button
              type="primary"
              style={{backgroundColor: "#1BA39C"}}
              onClick={() => this.handleSubmit()}
            >OK</Button>
          </List.Item>
        </List>
      </div>
    )
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <Navbar title="Add To Readlist" history={this.props.history} match={this.props.match}/>
          <CircularProgress style={{color:"#1BA39C",  marginTop: "38vh"}} size='10vw' thickness={5} />
        </div>
      );
    }

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" onClick={() => this.props.history.goBack()}/>}
          style={{
            boxShadow: '0px 1px 3px rgba(28, 28, 28, .1)',
            zIndex: 10000000,
            position: 'relative',
            // borderBottom: '1px solid #c8c8c8',
            // height: 38
          }}
        >
          <span className='document-title'>
            Add To Readlist
          </span>
        </NavBar>
        <StickyContainer>
        <WhiteSpace />
        <div style={{ justifyContent: 'center', height: '100%'}}>
          {this.renderOwnedReadlists(this.props.user.createdReadlists)}
        </div>
        </StickyContainer>
        <WhiteSpace />

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    readlists: state.readlists,
    documents: state.documents,
    user: state.user
  };
}

export default connect(mapStateToProps, actions)(AddToReadlist);
