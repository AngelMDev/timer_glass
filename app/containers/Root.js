// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import Sidebar from '../components/Sidebar';
import Home from '../components/Home';
import Stats from '../components/Stats';
import Reports from '../components/Reports';
import TimerComponent from '../components/TimerComponent';
import $ from "jquery";
import '../components/Home.css';
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";

type Props = {
  store: {},
  history: {}
};
const remote = require('electron').remote;
var DBManager = require('../DB_Manager.js')
const {globalShortcut} = remote;
var EasyTimer = require('easytimer.js');

export default class Root extends Component<Props> {

  constructor(props){
    super(props);
    this.props=props;
    this.state={elapsed: "00:00",hiddenTimerC:false,momentSelected:null};  
    this.selected=null;
    this.timer=new EasyTimer();
    this.tray=remote.getGlobal('tray');
  }
  componentDidMount(){
    this.setEventListeners(this); 
    this.registerShortcuts(this);
  }

  initializeDB(){
    this.db=DBManager.load();
    this.dbManager=new DBManager(this.db);
  }

  startTimer(){
    this.timerComponent.pauseStart();
  }

  stopTimer(){
    this.insertRatedTask(this);
    this.timerComponent.stop();
  }

  resetTimer(){
    this.timerComponent.stop();
  }

  submitTimer(){
    this.insertRatedTask(this);
    this.timerComponent.submit();
  }

  insertRatedTask(self=this){
    self.initializeDB();
    var res=self.dbManager.insertTask(self.selected.name,self.selected.aet);
    self.dbManager.insertRated(res.task_id,self.timerComponent.state.elapsed);
    if(self.home){
      self.home.taskList = self.getTaskList();
      self.home.setState({selected:{name:this.selected.name,aet:this.selected.aet,task_id:res.task_id}});
    }
    self.db.close();
  }

  getTaskList(){
    return this.dbManager.taskList;
  }

  registerShortcuts(self){ 
    globalShortcut.register('Control+Command+D',function(){
      self.resetTimer();
    })
    globalShortcut.register('Control+Command+Z',function(){
      self.submitTimer(self);
    })
    globalShortcut.register('Control+Command+S',function(){
      self.startTimer();
    })
  }

  setEventListeners(self){
    this.timer.addEventListener('secondsUpdated',function(){
      self.tray.setTitle(self.timer.getTimeValues().toString(['minutes','seconds']));
    })
    this.timer.addEventListener('started', function (e) {
      self.tray.setTitle(self.timer.getTimeValues().toString(['minutes','seconds']));
    });
    this.timer.addEventListener('reset', function (e) {
      self.tray.setTitle(self.timer.getTimeValues().toString(['minutes','seconds']));
    });
  }

  saveMoment(moment){
    this.setState({momentSelected:moment});
  }

  render() {
    return (
      <HashRouter>
        <div>
          <Sidebar />
          <div className="main-container">
            <div className="timer-container">
              <TimerComponent 
                ref={timerComponent => this.timerComponent = timerComponent}
                hidden={false}
                timer={this.timer}
                start={this.startTimer.bind(this)}
                stop={this.stopTimer.bind(this)}
                reset={this.resetTimer.bind(this)}
                submit={this.submitTimer.bind(this)}
              />
            </div>
            <Route exact path="/" render={()=> <Home ref={home => this.home = home} timer={this.timer} root={this} selected={this.selected} />} />
            <Route path="/Stats" render={()=> <Stats />} />
            <Route path="/List" render={()=> <Reports onMomentSelect={this.saveMoment.bind(this)} momentSelected={this.state.momentSelected}/>} />
            <Route path="/Music" component={null} />
            <Route path="/Settings" component={null} />
          </div>
        </div>
      </HashRouter>
    );
  }
}

