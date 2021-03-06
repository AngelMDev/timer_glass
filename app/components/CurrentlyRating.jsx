import React, { Component } from 'react';
import './CurrentlyRating.css'

class CurrentlyRating extends Component{

  constructor(props){
    super(props);
    this.state={name:this.props.name,aet:this.props.aet,reactTable:null};
    this.reactTable=props.reactTable;
  }

  componentDidUpdate(){
    this.props.root.selected = this.state;    
  }

  changeCurrentTask(_name,_aet){
    this.setState({name: _name,aet:_aet});
  }

  handleNameChange(e){
    this.setState({name:e.target.value});
    this.state.reactTable.filterColumn('name',e.target.value);
  }

  handleAetChange(e){
    this.setState({aet:e.target.value})
  }

  render(){
    return (
      <div className="current-task-container">
        <div className="current-title glass">Currently Rating &nbsp; </div>
        <input className="current-task-name glass" type="text" value={this.state.name} onChange={this.handleNameChange.bind(this)}></input>
        <input className="current-task-aet glass" type="text" value={this.state.aet} onChange={this.handleAetChange.bind(this)}></input>
      </div>
    )
  }
}

export default CurrentlyRating;