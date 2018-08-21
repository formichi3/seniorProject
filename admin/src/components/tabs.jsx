import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MyTable from './table.jsx'
import MyRecordsTable from './recordsTable.jsx'
import MyUserTable from './userTable.jsx'
import axios from 'axios'

export default class myTabs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 'c',
      locks: [],
      users:[],
      styles: {
        a: 'rgb(0, 188, 212)',
        b: 'orange',
        c: 'purple'
      },
      backgroundColor: 'rgb(0, 188, 212)'

    };

    this.getLocks = this.getLocks.bind(this);
  }

  handleChange = (value) => {
    const color = this.state.styles[value]
    console.log("new color: ", color);
    this.setState({
      value: value
    });
  };

  getLocks() {
    axios.get('https://cmpe123b.appspot.com/locks/')
        .then(response => this.setState({data: response.data}, () =>
        console.log("Locks --->", this.state.data)))
  }

  componentWillMount() {
    axios.get('https://cmpe123b.appspot.com/locks/')
        .then(response => this.setState({locks: response.data}, () =>
        console.log("Locks --->", this.state.locks)))
  }

  render() {
    return (
      <MuiThemeProvider>
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          >
          <Tab label="Analytics" value="c" style={{backgroundColor: this.state.backgroundColor}}>
            <MyRecordsTable title={"Records"} data={'records'}/>
          </Tab>
          <Tab label="Locks" value="a" style={{backgroundColor: this.state.backgroundColor}}>
                <MyTable title={"Locks"} data={'locks'}/>
            </Tab>
            <Tab label="Users" value="b" style={{backgroundColor: this.state.backgroundColor}}>
                <MyUserTable title="Users" data={'users'}/>
              </Tab>
            </Tabs>
          </MuiThemeProvider>
    );
  }
}
