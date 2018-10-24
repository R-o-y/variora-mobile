import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { Button, Icon, InputItem, List, NavBar, TextareaItem, WhiteSpace } from 'antd-mobile';
import { getCookie } from '../utilities/helper';

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
    data.append('readlist_name', readlist_name);
    data.append('description', readlist_description);
    data.append('csrfmiddlewaretoken', getCookie('csrftoken'));

    this.props.editReadlist(data, this.props.readlists.readlist.slug);
    this.props.history.goBack();
  }

  handleDelete() {
    console.log("delete readlist")
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
