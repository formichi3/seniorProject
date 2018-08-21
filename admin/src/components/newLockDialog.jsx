import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';


export default class NewLockDialog extends React.Component {

  constructor() {
    super();
    this.state = {
      dialogOpen: false
    }
    this.handleClose = this.handleClose.bind(this);
    this.handleCreateNewLock = this.handleCreateNewLock.bind(this);
  }

  componentWillMount(){
    this.setState({dialogOpen: this.props.dialogOpen})
  }

  handleClose() {
    this.setState({dialogOpen: false})
  };

  handleCreateNewLock() {
    console.log("Creating New Lock!");
  }


  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onClick={this.handleDialogClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onClick={this.handleCreateNewLock}
      />,
    ];
    return (
      <div>
        <Dialog
          title={"Add New User"}
          actions={actions}
          modal={false}
          open={this.state.dialogOpen}
          onRequestClose={this.handleClose}
          >
          <div>
            Add New Lock
          </div>
        </Dialog>
      </div>
      );
  }
}
