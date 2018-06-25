// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import Sidebar from '../components/Sidebar';
import Home from '../components/Home';
import Stats from '../components/Stats'
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

var EasyTimer = require('easytimer.js');

export default class Root extends Component<Props> {

  constructor(props){
    super(props);
    this.props=props;
    this.state={elapsed: "00:00"};  
    this.timer=new EasyTimer();
    this.tray=remote.getGlobal('tray');
  }
  componentDidMount(){
    this.setEventListeners(this); 
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

  render() {
    return (
      <HashRouter>
        <div>
          <Sidebar />
          <div className="main-container">
            <Route exact path="/" render={()=> <Home ref={home => this.home = home} timer={this.timer}/>} />
            <Route path="/Stats" render={()=> <Stats />} />
            <Route path="/List" component={null} />
            <Route path="/Music" component={null} />
            <Route path="/Settings" component={null} />
          </div>
        </div>
      </HashRouter>
    );
  }
}
