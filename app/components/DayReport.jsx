import React, { Component } from 'react';
import './DayReport.css'
class DayReport extends Component{
    render(){
        return(
            <div className={this.props.calendarOpen ? "day-wrapper glass shrink" : "day-wrapper glass"}>
                <div className={this.props.calendarOpen ? "day-content invisible" : "day-content"}>
                    {this.props.value}
                </div>
            </div>
        );
    }
}

export default DayReport;