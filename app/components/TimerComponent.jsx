import React, { Component } from 'react';
var remote = window.require('electron').remote;
const {globalShortcut} = remote;
var EasyTimer = require('easytimer.js');


class TimerComponent extends Component{
  constructor(props){
    super(props);
    this.props=props;
    this.timer=props.timer;
    this.state={elapsed: this.timer.getTimeValues().toString(['minutes','seconds']), started: false};    
  }

  componentDidMount(){
    this.registerShortcuts(this); 
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

  registerShortcuts(self){
    globalShortcut.register('CommandOrControl+Alt+S',function(){
      self.pauseStart();
    });
    
    globalShortcut.register('CommandOrControl+Alt+D',function(){
      self.reset();
    })

    globalShortcut.register('CommandOrControl+Alt+Z',function(){
      self.stop();
    })
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
    var startValue = this.state.started ? 'Pause' : 'Start'
    return(
    <div>
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

