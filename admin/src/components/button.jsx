import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class MyButton extends React.Component {

  constructor() {
    super();
    this.state = {
      primary: false,
      secondary: false,
      disabled: false
    }
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount(){
    if (this.props.type === 'primary'){
      this.setState({
        primary: true
      })
    }
    else if (this.props.type === 'secondary'){
      this.setState({
        secondary: true
      })
    }
    else if (this.props.type === 'disabled'){
      this.setState({
        disabled: true
      })
    }
  }

  handleClick() {
    console.log("Button clicked");
  };


  render() {
    return (
      <MuiThemeProvider>
        <RaisedButton
          label={this.props.label}
          onClick={this.props.onClick}
          primary={this.state.primary}
          secondary={this.state.secondary}
          disabled={this.state.disabled}
          style = {this.props.style}
        />
      </MuiThemeProvider>
      );
  }
}
