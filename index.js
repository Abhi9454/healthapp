var express    = require("express");
var mysql      = require('mysql');
var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : 'Bootspider@900',
   database : 'healthapp'
});
var app = express();
 
connection.connect(function(err){
if(!err) {
     console.log("Database is connected ... \n\n");  
} else {
     console.log("Error connecting database ... \n\n");  
}
});
app.listen(3000);
