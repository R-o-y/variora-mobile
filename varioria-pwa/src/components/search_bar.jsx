import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SearchBar } from 'antd-mobile';
import * as actions from '../actions';

class Searchbar extends Component {
  onChange = (value) => {
    console.log(value, "onChange")
    this.props.updateSearchTerm(value);
    if (value !== '') {
      this.props.getSearchResults(value);
    }
  };

  onClear = () => {
    console.log("onClear")
    this.props.updateSearchTerm('');
  };

  onSubmit = (value) => {
    console.log(value, 'onSubmit')    
  }

  render() {
    return (
      <SearchBar 
        value={this.props.search.term}
        placeholder="Search"
        maxLength={16}
        onSubmit={this.onSubmit}
        onClear={this.onClear}
        onChange={this.onChange}
        cancelText="Cancel"
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    search: state.search
  };
}

export default connect(mapStateToProps, actions)(Searchbar);
