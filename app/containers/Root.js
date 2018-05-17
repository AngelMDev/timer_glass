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

export default class Root extends Component<Props> {
  render() {
    return (
      <HashRouter>
        <div>
          <Sidebar />
          <div className="main-container">
            <Route exact path="/" render={()=> <Home />}/>
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
