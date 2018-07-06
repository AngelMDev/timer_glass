import React, { Component } from 'react';
var remote = window.require('electron').remote;
var EasyTimer = require('easytimer.js');


class TimerComponent extends Component{
  constructor(props){
    super(props);
    this.props=props;
    this.timer=props.timer;
    this.state={elapsed: this.timer.getTimeValues().toString(['minutes','seconds']), started: false};    
  }

  componentDidMount(){
    this.setEventListeners(this);
  }

  setEventListeners(self){
    this.timer.addEventListener('secondsUpdated',function(){
      self.setState({elapsed: self.timer.getTimeValues().toString(['minutes','seconds'])});
    })
    this.timer.addEventListener('started', function (e) {
      self.setState({elapsed: self.timer.getTimeValues().toString(['minutes','seconds'])});
    });
    this.timer.addEventListener('reset', function (e) {
      self.setState({elapsed: self.timer.getTimeValues().toString(['minutes','seconds'])});
    });
  }

  pauseStart(){
    if(this.state.started){
      this.pause();
    }else{
      this.start();
    }
  }

  start(){
    this.setState({started: true})
    this.timer.start();
  }

  pause(){
    this.setState({started: false})
    this.timer.pause();
  }

  stop(){
    this.setState({started: false})
    this.timer.reset();
    this.timer.pause();
  }

  submit(){
    this.setState({started: true})
    this.timer.reset();
  }
  
  render(){
    if(this.props.hidden){
      return null;
    }
      var startValue = this.state.started ? 'Pause' : 'Start'
      return(
      <div className="center">
        <div className="chrono-container glass">
          <h1>{this.state.elapsed}</h1>

        </div>
        <div className="button-container">
          <button className="timer-button start" onClick={this.props.start}>{startValue}</button>        
          <button className="timer-button reset" onClick={this.props.reset}>Reset</button>   
          <button className="timer-button pause" onClick={this.props.submit}>Submit</button>      
          <button className="timer-button stop" onClick={this.props.stop}>Stop</button>    
        </div>
      </div>
    );
  }
}

export default TimerComponent;

