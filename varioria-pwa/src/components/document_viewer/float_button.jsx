import Button from '@material-ui/core/Button';
import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import AddComment from '@material-ui/icons/AddComment';
import Grow from '@material-ui/core/Grow';


const styles = theme => ({
  root: {
    position: 'relative',
    minHeight: 200,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
});


class FlaoatingButton extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      value: 0,
      content: undefined,
    };

    this.handleChange = (event, value) => {
      this.setState({ value });
    };

    this.handleChangeIndex = index => {
      this.setState({ value: index });
    };
  }


  render() {
    const { classes, theme } = this.props;
    const transitionDuration = {
      enter: theme.transitions.duration.enteringScreen,
      exit: theme.transitions.duration.leavingScreen,
    };

    return (
      // <div>
        <Grow in={this.props.show}>
          <Button
            variant="fab"
            className={classes.fab + ' scan-receipt-btn'}
            style={{position: 'fixed', bottom: 60, zIndex: 1000, backgroundColor: 'rgb(27, 163, 156)',}}
            onClick={this.onClick}
          >
            <AddComment style={{ color: 'white' }} />
          </Button>
        </Grow>
      // </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(FlaoatingButton);
