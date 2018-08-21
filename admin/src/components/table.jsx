import React, {Component} from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import MyButton from './button.jsx';
import moment from 'moment'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';
import DatePicker from 'material-ui/DatePicker';
import axios from 'axios';
import _ from 'lodash';
import FuzzySearch from 'fuzzy-search'
import ReactJson from 'react-json-view'




import RaisedButton from 'material-ui/RaisedButton';

export default class MyTable extends Component {

  constructor() {
    super();
    this.state = {
      height: '1000px',
      dialogOpen: false,
      manageOpen: false,
      editOpen: false,
      showCheckboxes: false,
      data: [],
      dialogInput: "",
      newID: "",
      newGroups: [],
      newUsers: [],
      newGroup: "",
      newUser: 0,
      selectedRow: {},
      columnHeaders: ['id', 'status', 'battery'],
      selectedColumn: 0,
      tempData: [],
      newLock: {
        ID: "",
        permittedGroups: [],
        permittedUsers: [],
        exp_date: ""
      },
      viewActions: []
    };

    this.handleManageLock = this.handleManageLock.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleCreateNewLock = this.handleCreateNewLock.bind(this);
    this.handleTextInput = this.handleTextInput.bind(this);
    this.handleManageClose = this.handleManageClose.bind(this);
    this.handleColumnHeaderClick = this.handleColumnHeaderClick.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleUpdateSearchInput = this.handleUpdateSearchInput.bind(this);
    this.resetData = this.resetData.bind(this);
    this.seperateList = this.seperateList.bind(this);
    this.handleAddID = this.handleAddID.bind(this);
    this.handleAddGroups = this.handleAddGroups.bind(this);
    this.handleAddUsers = this.handleAddUsers.bind(this);
    this.handleAddExpDate = this.handleAddExpDate.bind(this);
    this.handleDeleteLock = this.handleDeleteLock.bind(this);
    this.handleEditOpen = this.handleEditOpen.bind(this)
    this.handleEditClose = this.handleEditClose.bind(this);
    this.handleEditUsers = this.handleEditUsers.bind(this);
    this.handleEditGroups = this.handleEditGroups.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);

  }

  componentWillMount() {
    axios.get(`https://adroit-metric-194509.appspot.com/${this.props.data}/`)
        .then(response => this.setState({data: response.data, tempData: response.data}, () =>
        console.log("Locks --->", this.state.data)))
  }

  handleManageLock(index) {
    console.log("Managing Lock! value--->", index);
    this.setState({manageOpen: true, selectedRow: index});
  };

  handleManageClose() {
    this.setState({manageOpen: false});
  }

  handleDialogOpen(){
    this.setState({dialogOpen: true})
  }

  handleDialogClose(){
    this.setState({
      dialogOpen: false,
      manageOpen: false,
      newID: "",
      newGroups: [],
      newUsers: [],
      newLock: {
        ID: "",
        permittedGroups: [],
        permittedUsers: []
      }
    })
  }

  handleEditOpen(){
    this.setState({dialogOpen: false, manageOpen: false, editOpen: true})
  }

  handleEditClose(){
    this.setState({dialogOpen: false, manageOpen: false, editOpen: false})
  }

  handleEditUsers(event, value){
    console.log("New USERS", value);
    this.setState({newUser: value})
  }

  handleEditGroups(event, value){
    console.log("New Groups", value);
    this.setState({newGroup: value})
  }

  handleEditSubmit(){
    console.log("New Groups", this.state.newGroup);
    console.log("New Users", this.state.newUser);
    var updatedLock = this.state.selectedRow
    console.log("---> ", updatedLock);
    if (this.state.newUser !== 0){
      updatedLock.permittedUsers.push(this.state.newUser);
    }
    if (this.state.newGroup !== ""){
      updatedLock.permittedGroups.push(this.state.newGroup);
    }
    axios.post(`https://adroit-metric-194509.appspot.com/locks/update`, updatedLock)
    .then(response => {
      console.log(response);
      this.setState({editOpen:false, manageOpen:true})
    });
  }

  handleCreateNewLock(){
    console.log("Creating new lock!");
    const newLock = this.state.newLock
    newLock.battery = 100
    newLock.status = "connected"
    console.log("newLock: ", newLock);
    this.setState({dialogOpen: false})
    axios.post(`https://adroit-metric-194509.appspot.com/locks`, newLock)
        .then(response => {
          console.log(response);
          axios.get(`https://adroit-metric-194509.appspot.com/${this.props.data}/`)
              .then(response => this.setState({data: response.data, tempData: response.data, dialogOpen: false}, () =>
              console.log("Locks --->", this.state.data)
            ));
        });
    }

  handleTextInput(event, value){
    this.setState({dialogInput: value}, () => {
      console.log("Input Value --->", this.state.dialogInput);
    })
  }

  handleColumnHeaderClick(event, row, column){
    console.log("Previous column ", this.state.selectedColumn);
    console.log("New Column ", column);
    if (column === this.state.selectedColumn){
      this.setState({tempData: _.reverse(this.state.tempData), selectedColumn: column});
    } else {
      this.setState({tempData: _.sortBy(this.state.tempData, this.state.columnHeaders[column - 1]), selectedColumn: column});
    }
  }

  handleSearch(chosenRequest, index){
    console.log("Searching! ", index);
    const results = []
    results[0] = _.find(this.state.data, {ID: chosenRequest});
    this.setState({tempData: results})
  }

  handleUpdateSearchInput(input){
    console.log("Updated! ", input);
    const searcher = new FuzzySearch(this.state.data, ['ID'], {
      caseSensitive: false,
    });
    const result = searcher.search(input);
    this.setState({tempData: result})
    console.log('result: ', result);
  }

  handleAddID(){
    if(this.state.dialogInput !== ""){
      const newLock = this.state.newLock;
      newLock.ID = this.state.dialogInput
      this.setState({newLock: newLock, dialogInput: ""}, () => {
        console.log("New ID: ", this.state.newID);
      });
    } else {
      return
    }
  }

  handleAddGroups(){
    if(this.state.dialogInput !== ""){
      const newLock = this.state.newLock;
      const newGroups = newLock.permittedGroups;
      newGroups.push(this.state.dialogInput)
      newLock.permittedGroups = newGroups;
      this.setState({newLock: newLock, dialogInput: ""}, () => {
        console.log("New Groups: ", this.state.newLock);
      });
    } else {
      return
    }
  }

  handleAddUsers(){
    if(this.state.dialogInput !== ""){
      const newLock = this.state.newLock;
      const newUsers = newLock.permittedUsers;
      newUsers.push(this.state.dialogInput)
      newLock.permittedUsers = newUsers;
      this.setState({newLock: newLock, dialogInput: ""}, () => {
        console.log("New Groups: ", this.state.newLock);
      });
    } else {
      return
    }
  }

  handleAddExpDate(event, date){
    console.log("expDate: ", date, event);
    var newLock = this.state.newLock;
    newLock.exp_date = date;
    this.setState({newLock: newLock})
  }

  handleDeleteLock(){
    axios.delete(`https://adroit-metric-194509.appspot.com/locks/${this.state.selectedRow.ID}`)
        .then((response) => {
          console.log(response);
          this.setState({manageOpen: false})
          this.componentWillMount()
        })
  }

  resetData(){
    this.setState({tempData: this.state.data});
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
    const editActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleEditClose}
        />,
      <FlatButton
        label="submit"
        secondary={true}
        onClick={this.handleEditSubmit}
        />
    ];
    const viewActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleDialogClose}
        />,
      <FlatButton
        label="DELETE"
        secondary={true}
        onClick={this.handleDeleteLock}
        />,
      <FlatButton
        label="Edit"
        primary={true}
        onClick={this.handleEditOpen}
        />
    ];
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleDialogClose}
        />,
      <FlatButton
        label="Submit"
        primary={true}
        onClick={this.handleCreateNewLock}
      />
    ];
    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <AutoComplete
            hintText="Search..."
            dataSource={_.map(this.state.data, 'ID')}
            onNewRequest={this.handleSearch}
            onUpdateInput={this.handleUpdateSearchInput}
            />
          <MyButton
            primary={true}
            label={"Add Lock"}
            style={addButtonsStyle}
            onClick={this.handleDialogOpen}
          />
        <Dialog
          title="Create New Lock"
          actions={actions}
          modal={false}
          open={this.state.dialogOpen}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
          >
          <div style={{display: 'flex', flexDirection: "row"}}>
            <div style={{width: "60%"}}>
              <div>
                <TextField
                  floatingLabelText="Lock ID"
                  onChange={this.handleTextInput}
                  />
                <RaisedButton
                  label={"Add ID"}
                  onClick={this.handleAddID}
                  secondary={true}
                  style = {{marginLeft: 20, marginRight: 20}}
                  />
              </div>
              <div>
                <TextField
                  floatingLabelText="Permitted Groups"
                  onChange={this.handleTextInput}
                  />
                <RaisedButton
                  label={"Add Group"}
                  onClick={this.handleAddGroups}
                  secondary={true}
                  style = {{marginLeft: 20, marginRight: 20}}
                  />
              </div>
              <div>
                <TextField
                  floatingLabelText="Permitted Users IDs"
                  onChange={this.handleTextInput}
                  />
                <RaisedButton
                  label={"Add User"}
                  onClick={this.handleAddUsers}
                  secondary={true}
                  style = {{marginLeft: 20, marginRight: 20}}
                  />
              </div>
              <div>
                <DatePicker
                  hintText="Set Expiration Date"
                  container= "inline"
                  mode="landscape"
                  onChange={this.handleAddExpDate}
                  formatDate={() => moment().format()}
                  minDate = {new Date()}/>
              </div>
            </div>
            <div style={{width: "40%"}}>
              <ReactJson src={this.state.newLock} />
            </div>
          </div>
        </Dialog>
        </div>
        <Table
          height={this.state.height}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={false}
          multiSelectable={this.state.multiSelectable}
          showCheckboxes={this.state.showCheckboxes}
        >
          <TableHeader
            displaySelectAll={this.state.showCheckboxes}
            adjustForCheckbox={this.state.showCheckboxes}
            enableSelectAll={this.state.enableSelectAll}
          >
            <TableRow onCellClick={this.handleColumnHeaderClick}>
              <TableHeaderColumn>ID</TableHeaderColumn>
              <TableHeaderColumn>Status</TableHeaderColumn>
              <TableHeaderColumn>Battery Level</TableHeaderColumn>
              <TableHeaderColumn>View</TableHeaderColumn>
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
                <TableRowColumn>{row.ID}</TableRowColumn>
                <TableRowColumn>{row.status}</TableRowColumn>
                <TableRowColumn>{row.battery}</TableRowColumn>
                <TableRowColumn>
                  <RaisedButton
                  label={"VIEW"}
                  onClick={() => this.handleManageLock(row)}
                  secondary={true}
                  style = {buttonStyle}
                  />
                </TableRowColumn>
              </TableRow>
              ))}
                <Dialog
                  title={`View the information for lock ${this.state.selectedRow.ID}`}
                  actions={viewActions}
                  modal={false}
                  open={this.state.manageOpen}
                  onRequestClose={this.handleManageClose}
                  autoScrollBodyContent={true}
                >
                <div>
                  ID: {this.state.selectedRow.ID}
                  <br></br>
                  Battery Level: {this.state.selectedRow.battery}
                  <br></br>
                  Permitted Users: {this.seperateList(this.state.selectedRow.permittedUsers)}
                  <br></br>
                  Permitted Groups: {this.seperateList(this.state.selectedRow.permittedGroups)}
                </div>
              </Dialog>
              <Dialog
                autoScrollBodyContent={true}
                title={`Edit the information for lock ${this.state.selectedRow.ID}`}
                actions={editActions}
                modal={false}
                open={this.state.editOpen}
                onRequestClose={this.handleEditClose}
              >
              <div>
                <TextField
                  floatingLabelText="Add Permitted User"
                  floatingLabelFixed={true}
                  hintText="user id #"
                  onChange={this.handleEditUsers}
                  />
                <br></br>
                <TextField
                  floatingLabelText="Add Permitted Group"
                  floatingLabelFixed={true}
                  hintText='group name'
                  onChange={this.handleEditGroups}
                  />
              </div>
            </Dialog>
          </TableBody>
        </Table>
      </div>
    );
  }
}
