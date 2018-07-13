import React, { Component } from 'react';
var DBManager = require('../DB_Manager.js')

class WeeklyCount extends Component {
    constructor(props){
        super(props);
        this.getWeeklyCount();
    }

    initializeDB(){
        this.db=DBManager.load();
        this.dbManager=new DBManager(this.db);
      }

      getWeeklyCount(){
        var dayDiff = 6-new Date().getDay();
        var EOWDate=new Date(new Date().getTime()+1000*3600*24*dayDiff)
        EOWDate.setHours(0);
        EOWDate.setMinutes(0);
        EOWDate.setSeconds(0);
        EOWDate.setMilliseconds(0);
        var startOfWeek=EOWDate.getTime()-1000*3600*24*6;
        this.initializeDB();
        this.aetSum=this.dbManager.getRatedNewerThan(startOfWeek);
        this.db.close();
      }

    render(){
        return(
                <div className="weekly">
                    Week AET={this.aetSum[0].Total_AET}
                </div>
            
        )
    }
}

export default WeeklyCount;