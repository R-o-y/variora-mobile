import _ from 'lodash';
import React from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class ConfirmationDialog extends React.Component {
  constructor(props) {
    super();
    this.state = {
      value: props.value,
    };
  }

  componentDidMount() {
    // TODO: Change to group readlist to after it is implemented
    this.props.getMyReadlists();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  handleEntering = () => {
    this.radioGroupRef.focus();
  };

  handleCancel = () => {
    this.props.onClose(this.props.value);
  };

  handleClear = () => {
    this.props.onClose(undefined);
  };

  handleOk = () => {
    this.props.onClose(this.state.value);
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value, onClose, open } = this.props;

    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        onEntering={this.handleEntering}
        aria-labelledby="confirmation-dialog-title"
        onClose={onClose}
        open={open}
      >
        <DialogTitle id="confirmation-dialog-title">Select Readlist</DialogTitle>
        <DialogContent>
          <RadioGroup
            ref={ref => {
              this.radioGroupRef = ref;
            }}
            value={this.state.value}
            onChange={this.handleChange}
          >
            {_.isEmpty(this.props.readlists) &&
              <span>You don't have any readlist</span>
            }
            {_.values(this.props.readlists).map(readlist => (
              <FormControlLabel value={readlist.slug} key={readlist.slug} control={<Radio color='primary' />} label={readlist.name} />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClear} color="primary">
            Clear
          </Button>
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    readlists: state.readlists
  };
}

export default connect(mapStateToProps, actions)(ConfirmationDialog);
