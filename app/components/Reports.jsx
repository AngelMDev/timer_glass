import React, { Component } from 'react';
import Calendar from 'rc-calendar';
import DatePicker from 'rc-calendar/lib/Picker';
import DayReport from './DayReport';
import 'rc-calendar/assets/index.css';
import './Reports.css'
import $ from "jquery";
var DBManager = require('../DB_Manager.js');

class Reports extends Component{
    constructor(props) {
        super(props);
        this.state = {open: false};
        this.getPeriodReport(this.props.momentSelected);
    }

    initializeDB(){
        this.db=DBManager.load();
        this.dbManager=new DBManager(this.db);
    }

    getPeriodReport(moment){
        if (!moment) return;
        var date=moment._d
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        date=date.getTime();
        this.periodReport=[];
        this.initializeDB();
        this.week1Sum=0;
        this.week2Sum=0;
        for(var i=0;i<14;i++){
            var day=date+1000*3600*24*i;
            var res=this.dbManager.getRatedOnDay(day)[0].Total_AET;
            if(res){
                var formatted=DBManager.convertMinsToHrsMins(res);
                this.periodReport.push(formatted);
                if(i<7){
                    this.week1Sum+=res;
                }else{
                    this.week2Sum+=res;
                }
            }else{
                this.periodReport.push("-");
            }
            
        }
        this.db.close();
    }

    render(){
        const calendar = (<Calendar
            style={{ zIndex: 1000 }}
            dateInputPlaceholder="please input"
            value={this.props.momentSelected}
            defaultValue={this.props.momentSelected}
            onSelect={(moment)=>{
                this.getPeriodReport(moment);
                this.props.onMomentSelect(moment);
            }}
            //defaultValue={this.props.defaultCalendarValue}
            //showDateInput={state.showDateInput}
          />);
        return (
            <div className="reports-container">
                <DatePicker
                    animation="slide-up"
                    calendar={calendar}
                    onOpenChange={(_open)=>{
                        this.setState({open:_open});
                    }}
                >
                    {
                    ({ value }) => {
                        return (
                        <span tabIndex="0">
                        <input
                            placeholder="Select period start date"
                            readOnly
                            tabIndex="-1"
                            className={this.state.open ? "flatten-bottom-border calendar-input glass": "calendar-input glass"}
                            value={value && value.format('YYYY-MM-DD')}
                        />
                        </span>
                        );
                    }
                    }
                </DatePicker>
                <div className="day-report-container">
                    <div className="report-row">
                        <DayReport calendarOpen={this.state.open} value={this.periodReport ? this.periodReport[0] : "-"}/>
                        <DayReport calendarOpen={this.state.open} value={this.periodReport ? this.periodReport[1] : "-"}/>
                        <DayReport calendarOpen={this.state.open} value={this.periodReport ? this.periodReport[2] : "-"}/>
                        <DayReport calendarOpen={this.state.open} value={this.periodReport ? this.periodReport[3] : "-"}/>
                        <DayReport calendarOpen={this.state.open} value={this.periodReport ? this.periodReport[4] : "-"}/>
                        <DayReport calendarOpen={this.state.open} value={this.periodReport ? this.periodReport[5] : "-"}/>
                        <DayReport calendarOpen={this.state.open} value={this.periodReport ? this.periodReport[6] : "-"}/>
                        Total={DBManager.convertMinsToHrsMins(this.week1Sum)}
                    </div>
                    <div className="report-row">
                        <DayReport calendarOpen={this.state.open} value={this.periodReport ? this.periodReport[7] : "-"}/>
                        <DayReport calendarOpen={this.state.open} value={this.periodReport ? this.periodReport[8] : "-"}/>
                        <DayReport calendarOpen={this.state.open} value={this.periodReport ? this.periodReport[9] : "-"}/>
                        <DayReport calendarOpen={this.state.open} value={this.periodReport ? this.periodReport[10] : "-"}/>
                        <DayReport calendarOpen={this.state.open} value={this.periodReport ? this.periodReport[11] : "-"}/>
                        <DayReport calendarOpen={this.state.open} value={this.periodReport ? this.periodReport[12] : "-"}/>
                        <DayReport calendarOpen={this.state.open} value={this.periodReport ? this.periodReport[13] : "-"}/>
                        Total={DBManager.convertMinsToHrsMins(this.week2Sum)}
                    </div>
                </div>
            </div>
        );
    }
}


export default Reports;