import React, { Component } from 'react';
import './CurrentlyRating.css'

class CurrentlyRating extends Component{
  render(){
    return (
      <div className="current-task-container">
        <div className="current-title glass">Currently Rating &nbsp; </div>
        <div className="current-task-name glass">{this.props.task}</div>
        <div className="current-task-aet glass">{this.props.aet}</div>
      </div>
    )
  }
}

export default CurrentlyRating;