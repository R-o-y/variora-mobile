import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { Button, Icon, InputItem, List, NavBar, TextareaItem, WhiteSpace, Toast } from 'antd-mobile';
import { getCookie } from '../utilities/helper';

class CreateCoterieForm extends Component {

  state = {
    coterie_name: "",
    coterie_description: ""
  };

  handleSubmit() {
    let { coterie_name, coterie_description } = this.state;

    let data = new FormData();
    data.append('coterie_name', coterie_name);
    data.append('coterie_description', coterie_description);
    data.append('csrfmiddlewaretoken', getCookie('csrftoken'));

    this.props.createCoterie(data).then((response) => {
      let coterie = response.payload.data;
      this.props.history.push(`/groups/${coterie.uuid}/settings`);
      Toast.success('You are now in the group ' + coterie.name, 2);
    })
  }

  render() {
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" color="#1BA39C" />}
          onLeftClick={() => this.props.history.goBack()}
        >Create Group</NavBar>
        <List renderHeader={() => 'You will be the administrator upon creation'}>
          <InputItem
            clear
            placeholder="Name of the group"
            onChange={(value) => this.setState({coterie_name: value})}
          >Name</InputItem>
        </List>
        <List renderHeader={() => 'Description'}>
          <TextareaItem
            rows={5}
            count={100}
            onChange={(value) => this.setState({coterie_description: value})}
          />
          <List.Item>
            <Button
              disabled={this.state.coterie_name.length === 0}
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
  };
}

export default connect(mapStateToProps, actions)(CreateCoterieForm);
