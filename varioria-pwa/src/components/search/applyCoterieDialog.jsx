import _ from 'lodash';
import React from 'react';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import { Toast } from 'antd-mobile';
import { getCookie } from '../../utilities/helper';


class ApplyCoterieDialog extends React.Component {
  constructor(props) {
    super();
    this.state = {
      applyCoterieModal: false,
      checked: false,
    };
  }

  handleChange = (event, value) => {
    this.setState({ checked: value });
  }

  handleFormSubmit(coterie) {
    let data = new FormData()
    data.append('csrfmiddlewaretoken', getCookie('csrftoken'))
    if (this.state.checked) {
      data.append('invitation_code', this.state.invitationCode)

      this.props.joinCoterieWithCode(data, coterie.pk)
        .then(response => {
          Toast.success('Success', 1)
          this.props.history.push(`/groups/${response.payload.data.uuid}/explore`);
        })
        .catch(error => {
          console.log(error);
          Toast.fail('This invitation code does not exist or already expires', 2.8)
        })
    }
    if (!this.state.checked) {
      data.append('coterie_id', coterie.pk)
      data.append('application_message', this.state.message)
      this.props.applyCoterie(data)
        .then(response => {
          Toast.success('Your application has been sent', 2)
          // this.props.history.push(`/groups/${response.payload.data.uuid}/explore`);
        })
        .catch(error => {
          console.log(error);
          Toast.fail('Unsuccessful application. Your need to login first.', 2.8)
        })
    }
  }

  render() {
    const { coterie, onClose, open } = this.props;
    const dialogMessage = "Have an invitation code?"

    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">

          Apply to join {coterie && coterie.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {coterie && coterie.description} <br/>
          </DialogContentText>
          { this.state.checked &&
            <TextField
              required
              autoFocus
              multiline
              margin="dense"
              id="textField"
              label="Invitation Code"
              fullWidth
              value={this.state.invitationCode}
              onChange={(e) => {
                this.setState({invitationCode: e.target.value})
              }}
            />
          }
          { !this.state.checked &&
            <TextField
              required
              autoFocus
              multiline
              margin="dense"
              id="textField"
              label="Application Message"
              fullWidth
              value={this.state.message}
              onChange={(e) => {
                this.setState({message: e.target.value})
              }}
            />
          }
          <Checkbox
            color="primary"
            checked={this.state.checked}
            onChange={this.handleChange}
          />
          {dialogMessage}
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => onClose('applyCoterieModal')}>
            Cancel
          </Button>
          <Button
            disabled={(this.state.checked && _.isEmpty(this.state.invitationCode)) ||
              (!this.state.checked && _.isEmpty(this.state.message))}
            color="primary"
            onClick={() => {
              onClose('applyCoterieModal');
              this.handleFormSubmit(coterie);
            }}>
            {this.state.checked ? 'Join with code': 'Apply'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps, actions)(ApplyCoterieDialog);
