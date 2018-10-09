import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Uploads extends Component {

  componentDidMount() {
    // this.props.getAllPosts();
  }

  render() {
    return (
      <h1>Uploads</h1>
    );
  }

  // render() {
  //   let rows;
  //
  //   if (_.isEmpty(this.props.posts)) {
  //     rows = (<div>There is no available post</div>)
  //   } else {
  //     let byCountry = _.groupBy(this.props.posts, 'country_from');
  //     rows = _.keys(byCountry).map((country, index) => {
  //       return this.renderCountry(country, byCountry[country], index)
  //     })
  //   }
  //
  //   return (
  //     <div className={styles.container}>
  //       <Grid container>
  //         <Grid.Row>
  //           <Grid.Column>
  //             <Header className={styles.title} as='h1'>
  //               <span>Browse Requests By Country</span>
  //               <Header.Subheader className={styles.titleSubheader}>These are shopping tasks posted</Header.Subheader>
  //             </Header>
  //           </Grid.Column>
  //         </Grid.Row>
  //       </Grid>
  //       {rows}
  //     </div>
  //   )
  // }
}

function mapStateToProps(state) {
  return {

  };
}

export default connect(mapStateToProps, actions)(Uploads);
