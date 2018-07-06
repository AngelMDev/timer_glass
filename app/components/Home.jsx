import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import matchSorter from 'match-sorter';
import CurrentlyRating from './CurrentlyRating'
import './Home.css'
import { ENGINE_METHOD_CIPHERS } from 'constants';
var _ = require('lodash');
var remote = window.require('electron').remote;
var EasyTimer = require('easytimer.js');
var DBManager = require('../DB_Manager.js')
const {dialog} = window.require('electron').remote

class Home extends Component{

  constructor(props){
    super(props);
    this.state={selected:props.selected,editing:null}
    this.initializeDB();
    this.taskList = this.getTaskList();
    this.db.close();
  }

  componentDidMount(){
    this.currentlyRating.setState({reactTable:this.reactTable});
    if(this.state.selected){
      this.currentlyRating.changeCurrentTask(this.state.selected.name,this.state.selected.aet);
    }else{
      this.currentlyRating.changeCurrentTask('None selected','-');
    }
    this.props.root.setState({hiddenTimerC:false});
  }

  componentWillUnmount(){
    this.props.root.setState({hiddenTimerC:true});
  }


  componentWillUpdate(){
    this.props.root.selected = this.state.selected
  }

  initializeDB(){
    this.db=DBManager.load();
    this.dbManager=new DBManager(this.db);
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

  filterTable=(filter,row,column)=>{
    var task=this.currentlyRating.state.task;
    return matchSorter(rows, filter.value, { keys: ["name","aet"] });
  }

  handleEdit(row){
    this.setState({editing:row})
  }

  handleBlur(record,evt){
    if(!_.isEqual(this.state.editing,this.state.selected)){
      this.setState({editing:null})
    }
  }

  getReactTable(){
    return this.reactTable;
  }

  handleDelete(record){
    var id=record.task_id;
    this.initializeDB();
    var count=this.dbManager.getRatedListByTaskId(id).length;
    if(count>0){
      dialog.showMessageBox({
        type:"warning",
        title:"Are you sure you want to delete this task?",
        message: "There are "+count+" RATED tasks associated with this task that would be DELETED if you continue."+
        " Consider editing this task instead or associating the rated tasks to another task by editing them."+
        " Do you want to continue?",
        buttons: ["Yes", "Cancel"],
        cancelId:1
      },function(response){
        if(response==1) return;
        console.log("DELETED", record)
      });
    }else{
      dialog.showMessageBox({
        type:"info",
        title:"Are you sure you want to delete this task?",
        message: "You can safely delete this task without affecting RATED tasks. Continue?",
        buttons: ["Yes", "Cancel"],
        cancelId:1
      },function(response){
        if(response==1) return;
        console.log("DELETED", record)
      });
    }
    this.db.close(); 
  }

  render(){
    const taskTableColumns =[{
      Header:'Name',
      accessor:'name',
      //filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ["name","aet"] }),
      filterable: false,
      minWidth: 150/*,
      //Check width of input
      Cell: row => {
        var is_editing=(_.isEqual(this.state.editing,row.original)) ? "" : "disabled";
        return(
          //Check width of this thing
          <input type="text" id="editable" className={"glass edit-name "+is_editing} defaultValue={row.value} disabled={is_editing} onBlur={(evt) => this.handleBlur(row.original,evt)}></input> 
        )
      }*/
    },{
      Header:'AET',
      accessor:'aet',
      filterable: false,
      maxWidth:100/*,
      Cell: row => {
        var is_editing=(_.isEqual(this.state.editing,row.original)) ? "" : "disabled";
        return(
          //Check width of this thing
          <input type="text" id="editable" className={"glass edit-aet "+is_editing} defaultValue={row.value} disabled={is_editing} onBlur={(evt) => this.handleBlur(row.original,evt)}></input> 
        )
      }*/
    },{
      Header:'Last Used',
      accessor:'last_used',
      filterable: false,
      minWidth: 200
     },{
      Header: '',
      filterable: false,
      Cell: row => { 
        return(
          <div className="action-btn-container">
            <button className="edit-btn" onClick={() => this.handleEdit(row.original)}><i className="icon far fa-edit"></i></button>
            <button className="delete-btn" onClick={() => this.handleDelete(row.original)}><i className="icon fas fa-trash-alt"></i></button>
          </div>
        )
      }
    }]
    return(
      <div className="home-container">
        <CurrentlyRating 
            // task={this.getSelectedTask().name}
            // aet={this.getSelectedTask().aet}
            ref={currentlyRating => this.currentlyRating = currentlyRating}
          />
        <div className="table-container">
          <ReactTable 
                ref={reactTable => this.reactTable = reactTable}
                data={this.taskList}
                columns={taskTableColumns}
                className='task-table'
                showPageJump={false}
                filterable={true}
                //defaultFilterMethod={this.filterTable}
                showPageSizeOptions={false}
                getTrProps={(state, rowInfo) => {                           
                  if (rowInfo !== undefined){
                  return {                  
                      onClick: (e) => {                       
                        if(!_.isEqual(this.state.selected,rowInfo.original) || _.isEqual(this.state.editing,rowInfo.original)){                                     
                          this.setState({ selected: rowInfo.original },function(){
                            if(!_.isEqual(this.state.editing,this.state.selected)){
                              this.setState({editing:null})
                            }
                          })
                        
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
