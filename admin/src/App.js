import React, { Component } from 'react';
import MyTabs from './components/tabs.jsx'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
      <header className="App-header">
        <h1 className="App-title">UCSC SMART LOCK SYSTEM</h1>
      </header>
        <MyTabs/>
      <p className="App-intro">
      </p>
      </div>
    );
  }
}

export default App;
