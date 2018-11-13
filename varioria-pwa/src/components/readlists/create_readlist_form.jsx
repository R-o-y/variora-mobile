import React, { Component } from 'react';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import { Button, Icon, InputItem, List, NavBar, TextareaItem, WhiteSpace } from 'antd-mobile';
import { getCookie } from '../../utilities/helper';

class CreateReadlistForm extends Component {

  state = {
    readlist_name: "",
    readlist_description: ""
  };

  handleSubmit() {
    let { readlist_name, readlist_description } = this.state;

    let data = new FormData();
    data.append('readlist_name', readlist_name);
    data.append('description', readlist_description);
    data.append('csrfmiddlewaretoken', getCookie('csrftoken'));

    const groupUuid = this.props.match.params.groupUuid
    if (groupUuid) {
      const coterie = this.props.coteries[groupUuid]
      this.props.coterieCreateReadlist(data, coterie.pk);
    } else {
      this.props.createReadlist(data);
    }
    this.props.history.goBack();
  }

  render() {
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" color="#1BA39C" />}
          onLeftClick={() => this.props.history.goBack()}
        >Create Readlist</NavBar>
        <List>
          <InputItem
            clear
            placeholder="Name of the readlist"
            onChange={(value) => this.setState({readlist_name: value})}
          >Name</InputItem>
        </List>
        <List renderHeader={() => 'Description'}>
          <TextareaItem
            rows={5}
            count={100}
            onChange={(value) => this.setState({readlist_description: value})}
          />
          <List.Item>
            <Button
              disabled={this.state.readlist_name.length === 0}
              type="primary"
              style={{backgroundColor: "#1BA39C"}}
              onClick={() => this.handleSubmit()}
            >Create</Button>
          </List.Item>
        </List>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    coteries: state.coteries
  };
}

export default connect(mapStateToProps, actions)(CreateReadlistForm);
