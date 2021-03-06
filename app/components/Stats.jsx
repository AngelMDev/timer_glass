import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import './Stats.css';
import WeeklyCount from './WeeklyCount.jsx'
var DBManager = require('../DB_Manager.js')
var remote = window.require('electron').remote;

class Stats extends Component{

  render(){
    var db=DBManager.load();
    this.dbManager=new DBManager(db);
    var ratedList=this.dbManager.ratedList;
    db.close()
    const taskTableColumns =[{
      Header:'Name',
      accessor:'name',
      //filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["name","aet"] }),
      filterAll: true,
      minWidth: 150
    },{
      Header:'AET',
      accessor:'aet',
      filterable: false,
      maxWidth:90
    },{
      Header:'Time',
      accessor:'time',
      filterable: false,
      maxWidth:90
    },{
      Header:'Date',
      id:'completed_at',
      accessor: d=>(new Date(d.completed_at).toLocaleTimeString("en-US",{weekday: "short", year: "numeric", day: "numeric", minute: "2-digit", month: "short", hour: "2-digit"})),
      filterable: false,
      minWidth:160
    }]
    return(   
      <div className="stats-container">
        <WeeklyCount />
        <ReactTable 
          data={ratedList}
          columns={taskTableColumns}
          className = 'rated-table'
          showPageSizeOptions = {false}
          pageSize = {100}
        />
      </div>
    );
  }
}

export default Stats;