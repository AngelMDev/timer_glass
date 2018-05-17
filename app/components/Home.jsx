import React, { Component } from 'react';
import './Home.css'
import ReactTable from "react-table";
import "react-table/react-table.css";
import matchSorter from 'match-sorter';
import CurrentlyRating from './CurrentlyRating'
var remote = window.require('electron').remote;
const {globalShortcut} = remote;
var EasyTimer = require('easytimer.js');
var DBManager = require('../DB_Manager.js')

class Home extends Component{

  constructor(props){
    super(props);
    this.state={selected:null}
    this.initializeDB();
    //this.dbManager.insertRated(2,650);
    this.db.close();
  }

  initializeDB(){
    this.db=DBManager.load();
    this.dbManager=new DBManager(this.db);
    this.taskList = this.getTaskList();
  }

  startTimer(){
    this.timer.start();
  }

  stopTimer(){
    this.timer.stop();
    this.initializeDB();
    this.dbManager.insertRated(this.getSelectedTask().task_id,this.timer.state.elapsed);
    this.db.close();
  }

  pauseTimer(){
    this.timer.pause();
  }

  resetTimer(){
    this.timer.reset();
    this.initializeDB();
    this.dbManager.insertRated(this.getSelectedTask().task_id,this.timer.state.elapsed);
    this.db.close();
  }

  getTaskList(){
    return this.dbManager.taskList;
  }

  isSelected(id){
    if(this.state.selected!==null){
      return this.state.selected===id;
    }
    return false;
  }

  getSelectedTask(){
    if(this.state.selected===null) return {name:' None selected ',aet:' - '};
    return this.state.selected
  }

  render(){
    // this.dbManager.insertTask("Exp YT",8);
     
    
    const taskTableColumns =[{
      Header:'Name',
      accessor:'name',
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["name","aet"] }),
      filterAll: true,
      minWidth: 150
    },{
      Header:'AET',
      accessor:'aet',
      filterable: false,
      maxWidth:100
    },{
      Header:'Last Used',
      accessor:'last_used',
      filterable: false,
      minWidth: 200
    }]
    return(
      <div className="home-container">
        <div className="timer-container">
          <TimerComponent 
            ref={timer => this.timer = timer}
          />
          <div className="button-container">
            <StartButton onClick={this.startTimer.bind(this)} />
            <PauseButton onClick={this.pauseTimer.bind(this)} />
            <ResetButton onClick={this.resetTimer.bind(this)} />
            <StopButton onClick={this.stopTimer.bind(this)} />        
          </div>
        </div>
        <CurrentlyRating 
          task={this.getSelectedTask().name}
          aet={this.getSelectedTask().aet}
        />
        <div className="table-container">
          <ReactTable 
                data={this.taskList}
                columns={taskTableColumns}
                className='task-table'
                showPageJump={false}
                showPageSizeOptions={false}
                filterable={true}
                getTrProps={(state, rowInfo) => {                           
                  if (rowInfo !== undefined){
                  const selected=this.isSelected(rowInfo.original.task_id); 
                  return {
                      onClick: (e) => { 
                        if(this.state.selected != rowInfo.original){                                     
                          this.setState({ selected: rowInfo.original })
                        }else{
                          this.setState({ selected: null })
                        }
                      },
                      style: {
                          backgroundColor: rowInfo.original === this.state.selected ? 'rgba(255,255,255,.35)' : 'inherit'
                      }
                    } 
                  }else {
                    return {}
                  }
              }}
          />
        </div>
      </div>
    );
  }
}

class TimerComponent extends Component{
  constructor(props){
    super(props);
    this.props=props;
    this.state={elapsed: "00:00", started: false};
    this.timer=new EasyTimer();
  }

  componentDidMount(){
    this.setEventListeners(this);
    this.registerShortcuts(this); 
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

  reset(){
    this.setState({started: true})
    this.timer.reset();
  }
  

  render(){
    return(<div className="chrono-container glass"><h1>{this.state.elapsed}</h1></div>);
  }
}

class StartButton extends React.Component{
  render(){
    return(
      <button className="timer-button start" onClick={this.props.onClick}>Start</button>
    );
  }
}

class StopButton extends React.Component{
  render(){
    return(
      <button className="timer-button stop" onClick={this.props.onClick}>Stop</button>
    );
  }
}

class PauseButton extends React.Component{
  render(){
    return(
      <button className="timer-button pause" onClick={this.props.onClick}>Pause</button>
    );
  }
}

class ResetButton extends React.Component{
  render(){
    return(
      <button className="timer-button reset" onClick={this.props.onClick}>Submit</button>
    );
  }
}



export default Home;
