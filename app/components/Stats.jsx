import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import './Stats.css'
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
      accessor:'completed_at',
      filterable: false,
      minWidth:160
    }]
    return(
      <div className="stats-container">
        <ReactTable 
          data={ratedList}
          columns={taskTableColumns}
          className = 'rated-table'
        />
      </div>
    );
  }
}

export default Stats;