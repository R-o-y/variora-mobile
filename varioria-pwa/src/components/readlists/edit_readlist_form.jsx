import React, { Component } from 'react';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import { Button, Icon, InputItem, List, NavBar, TextareaItem, WhiteSpace, Modal } from 'antd-mobile';
import { getCookie } from '../../utilities/helper';

class EditReadlistForm extends Component {

  state = {
    readlist_name: "",
    readlist_description: ""
  };

  componentDidMount() {
    const { slug } = this.props.match.params
    const coterieId = this.props.match.params.coterieId
    if (coterieId) {
      this.props.getCoterieReadlist(slug, coterieId).then(() => {
        this.setState({readlist_name: this.props.readlists.readlist.name, readlist_description: this.props.readlists.readlist.description})
      });  
    } else {
      this.props.getReadlist(slug).then(() => {
        this.setState({readlist_name: this.props.readlists.readlist.name, readlist_description: this.props.readlists.readlist.description})
      });  
    }
  }

  handleSubmit() {
    let { readlist_name, readlist_description } = this.state;
    const coterieId = this.props.match.params.coterieId

    let data = new FormData();
    data.append('new_name', readlist_name);
    data.append('new_desc', readlist_description);
    data.append('csrfmiddlewaretoken', getCookie('csrftoken'));

    if (coterieId) {
      const renameUrl = "/coterie/api/" + coterieId + "/coteriereadlists/" + this.props.readlists.readlist.slug + "/rename"
      const changeDescUrl = "/coterie/api/" + coterieId + "/coteriereadlists/" + this.props.readlists.readlist.slug + "/change_desc"
      this.props.editReadlist(renameUrl, data)
      .then(() => {this.props.editReadlist(changeDescUrl, data)})
      .then(() => {this.props.history.goBack()})
    } else {
      this.props.editReadlist(this.props.readlists.readlist.rename_url, data)
      .then(() => {this.props.editReadlist(this.props.readlists.readlist.change_desc_url, data)})
      .then(() => {this.props.history.goBack()})
    }
  }

  handleDelete() {
    const readlist = this.props.readlists.readlist;
    Modal.alert('Delete ' + this.state.readlist_name + '?', 'All followers and you will no longer have access', [
      { text: 'Cancel' },
      { text: 'Delete', style:{color:'#FF0000'},
        onPress: () => {
          const coterieId = this.props.match.params.coterieId
          let data = new FormData();
          data.append('csrfmiddlewaretoken', getCookie('csrftoken'));
          if (coterieId) {
            const deleteUrl = "/coterie/api/" + coterieId + "/coteriereadlists/" + this.props.readlists.readlist.slug + "/delete"
            this.props.deleteReadlist(deleteUrl, data, readlist.slug);
            // ideally we want to route directly back to group readlist page,
            // but we don't have groupUuid here... for now we just go back twice.
            this.props.history.goBack()
            this.props.history.goBack()
          } else {
            this.props.deleteReadlist(readlist.delete_url, data, readlist.slug);
            this.props.history.push('/readlists')
          }
      }},
    ])
  }

  render() {
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" color="#1BA39C" />}
          onLeftClick={() => this.props.history.goBack()}
        >Edit Readlist</NavBar>
      <WhiteSpace />
      <WhiteSpace />
        <List>
          <InputItem
            clear
            placeholder="Name of the readlist"
            value={this.state.readlist_name}
            onChange={(value) => this.setState({readlist_name: value})}
          >Name</InputItem>
        </List>
        <List renderHeader={() => 'Description'}>
          <TextareaItem
            rows={5}
            count={100}
            value={this.state.readlist_description}
            onChange={(value) => this.setState({readlist_description: value})}
          />
          <List.Item>
            <Button
              disabled={this.state.readlist_name.length === 0}
              type="primary"
              style={{backgroundColor: "#1BA39C"}}
              onClick={() => this.handleSubmit()}
            >Edit</Button>
          </List.Item>
          <List.Item>
            <Button
              type="danger"
              type="primary"
              style={{backgroundColor: "#e74c3c"}}
              onClick={() => this.handleDelete()}
            >Delete</Button>
          </List.Item>
        </List>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    readlists: state.readlists
  };
}

export default connect(mapStateToProps, actions)(EditReadlistForm);
