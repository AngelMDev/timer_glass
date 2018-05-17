import React, { Component } from 'react';
import './Sidebar.css';
import home_icon from "../assets/icons/home.svg"
import list_icon from "../assets/icons/list.svg"
import chart_icon from "../assets/icons/chart.svg"
import music_icon from "../assets/icons/musical-note.svg"
import settings_icon from "../assets/icons/cogwheel-outline.svg"
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";



class Sidebar extends Component {

  render(){
    return (  
      <div className="sidebar-bg">
        <div className="sidebar" id="navbar">
          <NavLink to="/"><button><img height="55%" width="55%" alt="logo" src={home_icon} className="icon" /><h2>Home</h2></button></NavLink>
          <NavLink to="/Stats"><button><img height="55%" width="55%" alt="logo" src={chart_icon} className="icon" /><h2>Stats</h2></button></NavLink>
          <NavLink to="/List"><button><img height="55%" width="55%" alt="logo" src={list_icon} className="icon" /><h2>List</h2></button></NavLink>
          <NavLink to="/Music"><button><img height="55%" width="55%" alt="logo" src={music_icon} className="icon" /><h2>Music</h2></button></NavLink>
          <NavLink to="/Settings"><button><img height="55%" width="55%" alt="logo" src={settings_icon} className="icon" /><h2>Settings</h2></button></NavLink>
        </div>
      </div>
        
      
    );
  }
}

export default Sidebar;

{/*  */}