import React, { Component } from 'react';
import './Home.css'
import ReactTable from "react-table";
import "react-table/react-table.css";
import matchSorter from 'match-sorter';
import CurrentlyRating from './CurrentlyRating'
import TimerComponent from './TimerComponent'
var _ = require('lodash');
var remote = window.require('electron').remote;
const {globalShortcut} = remote;
var EasyTimer = require('easytimer.js');
var DBManager = require('../DB_Manager.js')

class Home extends Component{

  constructor(props){
    super(props);
    this.state={selected:null}
    this.initializeDB();
    //var res=this.dbManager.insertTask("Exp YT",8);
    //debugger
    //this.dbManager.insertRated(2,650);
    this.db.close();
  }

  initializeDB(){
    this.db=DBManager.load();
    this.dbManager=new DBManager(this.db);
    this.taskList = this.getTaskList();
  }

  startTimer(){
    this.timerComponent.pauseStart();
  }

  stopTimer(){
    this.timerComponent.stop();
    this.insertRatedTask();
  }

  resetTimer(){
    this.timerComponent.stop();
  }

  submitTimer(){
    this.timerComponent.submit();
    this.insertRatedTask();
  }

  insertRatedTask(){
    this.initializeDB();
    var res=this.dbManager.insertTask(this.currentlyRating.state.task,this.currentlyRating.state.aet);
    this.setState({selected:res})
    this.dbManager.insertRated(res.task_id,this.timerComponent.state.elapsed);
    this.taskList = this.getTaskList();
    this.db.close();
  }

  getTaskList(){
    return this.dbManager.taskList;
  }

  getSelectedTask(){
    return this.state.selected
  }

  getTimerState(){
    if (this.timerComponent===undefined){
      return {started: false}
    }
    return this.timerComponent.state;
  }

  render(){
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
            ref={timerComponent => this.timerComponent = timerComponent}
            timer={this.props.timer}
            start={this.startTimer.bind(this)}
            stop={this.stopTimer.bind(this)}
            reset={this.resetTimer.bind(this)}
            submit={this.submitTimer.bind(this)}
          />
        </div>
        <CurrentlyRating 
          // task={this.getSelectedTask().name}
          // aet={this.getSelectedTask().aet}
          ref={currentlyRating => this.currentlyRating = currentlyRating}
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
                  return {                     
                      onClick: (e) => {                        
                        if(!_.isEqual(this.state.selected,rowInfo.original)){                                     
                          this.setState({ selected: rowInfo.original })
                          this.currentlyRating.changeCurrentTask(rowInfo.original.name,rowInfo.original.aet);
                        }else{
                          this.setState({ selected: null })
                          this.currentlyRating.changeCurrentTask('None selected','-');
                        }
                      },
                      style: {
                          backgroundColor: (this.state.selected && _.isEqual(rowInfo.original.task_id,this.state.selected.task_id)) ? 'rgba(255,255,255,.35)' : 'inherit'
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


export default Home;
