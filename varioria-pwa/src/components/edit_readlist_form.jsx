import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { Button, Icon, InputItem, List, NavBar, TextareaItem, WhiteSpace, Modal } from 'antd-mobile';
import { getCookie } from '../utilities/helper';
import Avatar from '@material-ui/core/Avatar';

class EditReadlistForm extends Component {

  state = {
    readlist_name: "",
    readlist_description: ""
  };

  componentDidMount() {
    const { slug } = this.props.match.params
    this.props.getReadlist(slug).then(() => {
      this.setState({readlist_name: this.props.readlists.readlist.name, readlist_description: this.props.readlists.readlist.description})
    });
  }

  handleSubmit() {
    let { readlist_name, readlist_description } = this.state;

    let data = new FormData();
    data.append('new_name', readlist_name);
    data.append('new_desc', readlist_description);
    data.append('csrfmiddlewaretoken', getCookie('csrftoken'));

    this.props.editReadlist(this.props.readlists.readlist.rename_url, data);
    // TODO: bugged if change both at once. Why is there a different url to change the desc?
    this.props.editReadlist(this.props.readlists.readlist.change_desc_url, data);
    this.props.history.goBack();
  }

  handleDelete() {
    const readlist = this.props.readlists.readlist;
    Modal.alert('Delete ' + this.state.readlist_name + '?', 'All followers and you will no longer have access', [
      { text: 'Cancel' },
      { text: 'Delete', style:{color:'#FF0000'},
        onPress: () => {
          let data = new FormData();
          data.append('csrfmiddlewaretoken', getCookie('csrftoken'));
          this.props.deleteReadlist(readlist.delete_url, data, readlist.slug);
          this.props.history.push('/readlists')
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
