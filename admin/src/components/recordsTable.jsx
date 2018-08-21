import React, {Component} from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import axios from 'axios'
import moment from 'moment';

const ReactHighcharts = require('react-highcharts');
const generateRecords = require('../generateRecords');


export default class MyRecordsTable extends Component {

  constructor() {
    super();
    this.state = {
      height: '300px',
      rooms: ['be107', 'be204', 'be212', 'be141'],
      selectedRoom: 0,
      categories: ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'],
      chartData: [],
      maxOccupancy: 100,
      averageOccupancy: 0,
      dayTimeUtilization: 0,
      busyHours: "",
      quarterlyUtilization: "22%"
    };


    this.handleDateSelected = this.handleDateSelected.bind(this);
    this.handleRoomSelected = this.handleRoomSelected.bind(this);
    this.hourlyData = this.hourlyData.bind(this);
    this.getDayTimeUtilization = this.getDayTimeUtilization.bind(this);
    this.getBusyHours = this.getBusyHours.bind(this);
    this.getQuarterlyUtilization = this.getQuarterlyUtilization.bind(this);
    this.gaussianRand = this.gaussianRand.bind(this);
    this.gaussianRandom = this.gaussianRandom.bind(this);
  }

  componentWillMount() {
    // axios.get(`https://cmpe123b.appspot.com/${this.props.data}/`)
    //     .then(response => this.setState({data: response.data}, () =>
    //     console.log("Records --->", this.state.data)))
    this.hourlyData();
  }

  hourlyData(){
    var numRecords = this.state.maxOccupancy*12
    var newData= new Array(24).fill(0);
    var records = generateRecords(numRecords);
    for (var i = 0; i < numRecords; i++){
      var hour = records[i].timestamp.substring(11,13)
      if (hour[0] === '0'){
        hour = hour[1]
      }
      var entry = records[i].entry
      if (entry) {
        newData[hour] = newData[hour]+1
      } else {
        if (newData[hour] > 0){
          newData[hour] = newData[hour]-1
        }
      }
    }

    this.setState({chartData: newData}, ()=> {
      this.getDayTimeUtilization()
      this.getBusyHours()
    })
    console.log("room count!: ", newData);
  }

  handleDateSelected(event, date){
    this.hourlyData();
  }

  handleRoomSelected(event, value){
    console.log("value: ", value);
    this.setState({selectedRoom: value})
    this.hourlyData();
  }

  getDayTimeUtilization(){
    var total = 0;
    for (var i = 8; i < 18; i++){
      total = total+this.state.chartData[i];
    }
    var averageUtilization = `${total/(this.state.maxOccupancy*10)*100}`;
    averageUtilization = averageUtilization.slice(0,5)+'%'
    this.setState({dayTimeUtilization: averageUtilization})
  }

  getBusyHours(){
    var busyHours = "";
    var total = 0;
    for (var i = 0; i < 24; i++){
      total = total + this.state.chartData[i]
      if(this.state.chartData[i] > this.state.maxOccupancy*0.8){
        busyHours = busyHours + this.state.categories[i] + ", ";
      };
    }
    if (busyHours !== ""){
      busyHours = busyHours.slice(0, -2);
    } else {
      busyHours = "Room never utilized over 80%";
    }
    var average = (total/24).toFixed(2)
    this.setState({busyHours: busyHours, averageOccupancy: average})
  }

  getQuarterlyUtilization(){
    console.log("getting uti");
    return "31%"
  }

  gaussianRand() {
    var rand = 0;

    for (var i = 0; i < 6; i += 1) {
      rand += Math.random();
    }

    return rand / 6;
  }

  gaussianRandom(start, end) {
    return Math.floor(start + this.gaussianRand() * (end - start + 1));
  }

  render() {
    return (
      <div>
        <div style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
          <DropDownMenu value={this.state.selectedRoom} onChange={this.handleRoomSelected}>
            <MenuItem value={0} primaryText="be107" />
            <MenuItem value={1} primaryText="be204" />
            <MenuItem value={2} primaryText="be212" />
            <MenuItem value={3} primaryText="be141" />
          </DropDownMenu>
          <DatePicker
            hintText="Today"
            container= "inline"
            mode="landscape"
            style={{marginLeft: 25}}
            onChange={this.handleDateSelected}
            formatDate={(date) => moment(date).format('MMM Do, YYYY')}
            maxDate = {new Date()}/>
        </div>
        <ReactHighcharts config={{
            chart: {
              type: 'column',
              zoomType: 'x',
              scrollablePlotArea: {
                minWidth: 700,
                scrollPositionX: 1
              }
            },
            xAxis: {
              categories: this.state.categories,
            },
            series: [{
              data: this.state.chartData,
              name: "Occupancy"
            }],
            legend:{
              enabled: false
            },
            plotOptions: {
              column: {
                zones: [{
                  value: this.state.maxOccupancy*0.8,
                  color: '#7cb5ec'
                },{
                  value: this.state.maxOccupancy,
                  color: '#90ed7d'
                },{
                  color:'#f7a35c'
                }]
              }
            },
            yAxis: {
              softMax: this.state.maxOccupancy,
              title: {
                text: "Occupancy"
              },
              plotLines: [{
                value: this.state.averageOccupancy,
                color: 'green',
                dashStyle: 'shortdash',
                width: 2,
                label: {
                  text: 'Average Occupancy'
                }
              },
              {
                value: this.state.maxOccupancy,
                color: 'red',
                dashStyle: 'shortdash',
                width: 2,
                label: {
                  text: 'Max Occupancy'
                }
              }]
            },
            title: {
              text: this.state.rooms[this.state.selectedRoom]
            },
            credits: {
              enabled: false
            },
          }}/>
          <Table
            height={this.state.height}
            fixedHeader={true}
            fixedFooter={true}
            selectable={false}
            >
            <TableHeader
              displaySelectAll={this.state.showCheckboxes}
              adjustForCheckbox={this.state.showCheckboxes}
              enableSelectAll={this.state.enableSelectAll}
              >
              <TableRow onCellClick={this.handleColumnHeaderClick}>
                <TableHeaderColumn tooltip="Total room utilization for the whole 24hr day">Utilization</TableHeaderColumn>
                <TableHeaderColumn tooltip="Average room utilization from 8am to 5pm">Utilization 8am-5pm</TableHeaderColumn>
                <TableHeaderColumn tooltip="An room qualifies as being 'busy' when the room is above 80% capacity and are indicated by green and red columns">Busy</TableHeaderColumn>
                <TableHeaderColumn tooltip="The average utilization of the room since the beginning of the quarter">Current Quarter Utilization</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              colSpan="3"
              >
              <TableRow key={0}>
                <TableRowColumn>{this.state.averageOccupancy+'%'}</TableRowColumn>
                <TableRowColumn>{this.state.dayTimeUtilization}</TableRowColumn>
                <TableRowColumn>{this.state.busyHours}</TableRowColumn>
                <TableRowColumn>{this.state.quarterlyUtilization}</TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      );
    }
  }
