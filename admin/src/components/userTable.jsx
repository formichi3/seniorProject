import React, {Component} from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import MyButton from './button.jsx';
import NewLockDialog from './newLockDialog.jsx'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios'
import _ from 'lodash';
import AutoComplete from 'material-ui/AutoComplete';
import FuzzySearch from 'fuzzy-search'
import RaisedButton from 'material-ui/RaisedButton';

export default class MyUserTable extends Component {

  constructor() {
    super();
    this.state = {
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: false,
      selectable: false,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: true,
      showCheckboxes: false,
      height: '1000px',
      dialogOpen: false,
      manageOpen: false,
      editOpen: false,
      data: [],
      tempData:[],
      IDInput: "",
      selectedRow: {},
      newKeypad: "",
      newNFC: "",
      newGroup:""
    };

    this.handleManageUser = this.handleManageUser.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleEditLock = this.handleEditLock.bind(this);
    this.handleIDInput = this.handleIDInput.bind(this);
    this.handleUpdateSearchInput = this.handleUpdateSearchInput.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.seperateList = this.seperateList.bind(this);
    this.handleDeleteUser = this.handleDeleteUser.bind(this);
    this.handleEditNFC = this.handleEditNFC.bind(this);
    this.handleEditGroups = this.handleEditGroups.bind(this);
    this.handleEditKeypad = this.handleEditKeypad.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
  }

  componentWillMount() {
    axios.get(`https://cmpe123b.appspot.com/${this.props.data}/`)
        .then(response => this.setState({data: response.data, tempData: response.data}, () =>
        console.log("Locks --->", this.state.data)))
  }

  handleManageUser(index) {
    this.setState({manageOpen: true, selectedRow: index});
  };

  handleManageClose() {
    this.setState({manageOpen: false});
  }

  handleDialogOpen(){
    this.setState({dialogOpen: true})
  }

  handleDialogClose(){
    this.setState({dialogOpen: false, manageOpen: false})
  }

  handleEditLock(){
    this.setState({manageOpen:false, editOpen: true});
  }

  handleEditNFC(event, value){
    console.log("NFC: ", value);
    this.setState({newNFC: value})
  }

  handleEditGroups(event, value){
    console.log("Groups: ", value);
    this.setState({newGroup: value})
  }

  handleEditKeypad(event, value){
    console.log("keypad: ", value);
    this.setState({newKeypad: value})
  }

  handleEditSubmit() {
    var newUser = this.state.selectedRow;
    if (this.state.newNFC != ""){
      newUser.NFCID = this.state.newNFC
    }
    if (this.state.newKeypad != ""){
      newUser.keypadID = this.state.newKeypad
    }
    if (this.state.newGroup != ""){
      var newGroups = newUser.groups
      newGroups.push(this.state.newGroup)
      newUser.groups = newGroups
    }
    axios.post(`https://cmpe123b.appspot.com/users`, newUser)
        .then(response => {
          console.log(response);
          axios.get(`https://cmpe123b.appspot.com/${this.props.data}/`)
              .then(response => this.setState({data: response.data, tempData: response.data, dialogOpen: false}, () =>
              console.log("Users --->", this.state.data)
            ));
        });
  }

  handleIDInput(event, value){
    this.setState({IDInput: value}, () => {
      console.log("Input Value --->", this.state.IDInput);
    })
  }

  handleDeleteUser() {
    axios.delete(`https://cmpe123b.appspot.com/users/${this.state.selectedRow.ID}`)
        .then(response => axios.get(`https://cmpe123b.appspot.com/users/`)
            .then(response => this.setState({data: response.data, manageOpen: false, tempData: response.data}, () =>
            console.log("users --->", this.state.data)
          )));
  }

  handleUpdateSearchInput(input){
    console.log("Updated! ", input);
    const searcher = new FuzzySearch(this.state.data, ['name'], {
      caseSensitive: false,
    });
    const result = searcher.search(input);
    this.setState({tempData: result})
    console.log('result: ', result);
  }

  handleSearch(chosenRequest, index){
    console.log("Searching! ", index);
    const results = []
    results[0] = _.find(this.state.data, {name: chosenRequest});
    this.setState({tempData: results})
  }

  seperateList(list){
    var result = ""
    if(list){
      for (var i = 0; i < list.length; i++){
        result = result + list[i] + ", "
      }
      return result.slice(0,-2)
    }
  }

  render() {
    const buttonStyle = {
      marginTop: 4
    }
    const addButtonsStyle = {
      marginTop: 10,
      backgroundColor: "blue",
      marginLeft: 20
    }
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.handleDialogClose}
        />,
      <FlatButton
        label="DELETE"
        secondary={true}
        onClick={this.handleDeleteUser}
      />,
      <FlatButton
        label="Edit"
        primary={true}
        onClick={this.handleEditLock}
      />,
    ];

    const editActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleEditClose}
        />,
      <FlatButton
        label="Submit"
        secondary={true}
        onClick={this.handleEditSubmit}
      />
    ];
    return (
      <div style={{justifyContent: 'center'}}>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <AutoComplete
            hintText="Search..."
            dataSource={_.map(this.state.data, 'name')}
            onNewRequest={this.handleSearch}
            onUpdateInput={this.handleUpdateSearchInput}
            />
        </div>
        <Table
          height={this.state.height}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
        >
          <TableHeader
            displaySelectAll={this.state.showCheckboxes}
            adjustForCheckbox={this.state.showCheckboxes}
            enableSelectAll={this.state.enableSelectAll}
          >
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>ID</TableHeaderColumn>
              <TableHeaderColumn>CruzId</TableHeaderColumn>
              <TableHeaderColumn>Manage</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
            colSpan="4"
          >
            {this.state.tempData.map( (row, index) => (
              <TableRow key={index}>
                <TableRowColumn>{row.name}</TableRowColumn>
                <TableRowColumn>{row.ID}</TableRowColumn>
                <TableRowColumn>{row.cruzID}</TableRowColumn>
                <TableRowColumn>
                  <RaisedButton
                  label={"VIEW"}
                  secondary={true}
                  onClick={() => this.handleManageUser(row)}
                  style = {buttonStyle}
                  />
                </TableRowColumn>
              </TableRow>
              ))}
              <Dialog
                title={this.state.selectedRow.name}
                actions={actions}
                modal={false}
                open={this.state.manageOpen}
                onRequestClose={this.handleManageClose}
                >
                <div>
                  ID: {this.state.selectedRow.ID}
                  <br></br>
                  CruzID: {this.state.selectedRow.cruzID}
                  <br></br>
                  NFC ID: {this.state.selectedRow.NFCID}
                  <br></br>
                  RFID: {this.state.selectedRow.RFID}
                  <br></br>
                  Keypad ID: {this.state.selectedRow.keypadID}
                  <br></br>
                  Affiliated Groups: {this.seperateList(this.state.selectedRow.groups)}
                </div>
              </Dialog>
              <Dialog
                autoScrollBodyContent={true}
                title={this.state.selectedRow.name}
                actions={editActions}
                modal={false}
                open={this.state.editOpen}
                onRequestClose={this.handleManageClose}
                >
                <TextField
                  floatingLabelText="Add Group"
                  floatingLabelFixed={true}
                  hintText="new group"
                  onChange={this.handleEditGroups}
                  />
                <br></br>
                <TextField
                  floatingLabelText="Change NFC ID"
                  floatingLabelFixed={true}
                  hintText='NFC ID'
                  onChange={this.handleEditNFC}
                  />
                <br></br>
                <TextField
                  floatingLabelText="Add Keypad ID"
                  floatingLabelFixed={true}
                  hintText="Keypad ID"
                  onChange={this.handleEditKeypad}
                  />
              </Dialog>
          </TableBody>
        </Table>
      </div>
    );
  }
}
