
//var Datastore = require('nedb') 
//const window: any;
var fs = require('fs');
var path = require('path')
var SQL = require('sql.js');


class DBManager {
  constructor(db){
    this.db=db;
    this.dateOptions={
      weekday: "short", year: "numeric", day: "numeric", minute: "2-digit", month: "short", hour: "2-digit"
    }
  }

  static load(){
    if (fs.existsSync(path.join(__dirname, 'appDB.sqlite'))) {
      var filebuffer = fs.readFileSync(path.join(__dirname, 'appDB.sqlite'));
      console.log("Loading from disk...")
      return new SQL.Database(filebuffer);
    }else{
      console.log("Existing DB not found. Creating new...")
      var db=new SQL.Database();
      db.exec('CREATE TABLE Tasks (task_id INTEGER PRIMARY KEY, name NVARCHAR(100), aet FLOAT, last_used Date)');
      db.exec('CREATE TABLE Rated (rated_id INTEGER PRIMARY KEY, task_id INT REFERENCES Tasks(task_id),time FLOAT, completed_at Date)');
      return db;
    }
  }

  save(){
    console.log("Saving Database...")
    var data = this.db.export();
    var buffer = new Buffer(data);
    fs.writeFileSync(path.join(__dirname,'appDB.sqlite'), buffer);
  }

  insertTask(_name,_aet){
    var task={
      ':task_id': null,
      ':name': _name,
      ':aet': _aet,
      ':last_used': null,
    };
    this.db.run(`INSERT INTO Tasks(name,aet) SELECT '${_name}', ${_aet} WHERE NOT EXISTS(SELECT 1 FROM Tasks WHERE name ='${_name}' AND aet = ${_aet})`,task); 
    console.log("Inserted into Tasks");
    this.save();
    return DBManager.formatResult(this.db.exec(`SELECT * FROM Tasks WHERE name = '${_name}' AND aet = ${_aet}`))[0];
  }

  insertRated(_taskId, _time,_completedAt=new Date().toLocaleTimeString("en-US",this.dateOptions)){
    var rated={
      rated_id: null,
      task_id: _taskId,
      time: _time,
      completed_at: `${_completedAt} `
    }
    this.db.run(`INSERT INTO Rated VALUES (NULL,${rated.task_id},'${rated.time}','${rated.completed_at}')`);
    console.log("Inserted into Rated.");
    this.updateTask(_taskId);
  }

  updateTask(taskId){
    this.db.run(`UPDATE Tasks SET last_used = "${new Date().toLocaleTimeString("en-US",this.dateOptions)} " WHERE task_id = ${taskId}`);
    this.save();
  }

  deleteTask(taskId){
    this.db.exec(`DELETE FROM Tasks WHERE task_id=${taskId}`)
    this.save();
  }

  get taskList(){
    var res = this.db.exec('SELECT * FROM Tasks');
    return DBManager.formatResult(res);
  }

  get ratedList(){
    var res = this.db.exec('SELECT Rated.rated_id, Tasks.name, Tasks.aet, Rated.completed_at, Rated.time FROM Rated INNER JOIN Tasks ON Rated.task_id = Tasks.task_id')
    return DBManager.formatResult(res);
  }

  getTimesTaskUsed(task_id){
    var obj=this.db.exec('SELECT COUNT(rated_id) FROM Tasks INNER JOIN Rated ON Rated.task_id = Tasks.task_id WHERE task_id=3')[0];
    return obj[Object.keys(obj)[0]];
  }

  taskExists(name,aet){
    var res = this.db.exec(`SELECT * FROM Tasks WHERE name LIKE '%${name}%' OR aet = ${aet}`)
    return DBManager.formatResult(res)
  }

  getTask(taskId){
    var res = this.db.exec(`SELECT * FROM Tasks WHERE task_id=${taskId}`);
    return DBManager.formatResult(res)
  }

  getRated(ratedId){
    var res = this.db.exec('SELECT * FROM Tasks INNER JOIN Rated ON Rated.task_id = Tasks.task_id WHERE rated_id=?',[ratedId])[0]
    return DBManager.formatResult(res)
  }

  static formatResult(arr){
    if (arr.length===0) return [];
    var obj=arr[0];
    var newArr=[];
    obj.values.forEach(function(value){
      var newObj={};
      for(var i=0;i<value.length;i++){
        newObj[obj.columns[i]]=value[i];
      }
      newArr.push(newObj)
    })
    return newArr;
  }

}

module.exports = DBManager;

/* var test = {
  task: "SxS",
  aet: 8,
  time: 7.8,
  date: "today"
}

db.insert(test);
db.find({task: 'SxS'},function(err,docs){
  docs.forEach(function(d) {
    console.log('Found: ', d);
  }); 
}); */




