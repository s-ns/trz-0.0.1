
var http = require('http');
var formidable = require('formidable');
var mysql = require('mysql');
var fs = require('fs');
var cmd =require('node-cmd');
cmd.get(
        'pwd',
        function(err, data, stderr){
            console.log('the current working dir is : ',data)
        }
    );


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sudo",
  database: "ipfs"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var fname = files.filetoupload.name;
      var rfile =  fname.replace(/\s+/g, '');
      var newpath = '/root/' + rfile ;
var exec = require('child_process').exec;
var child;

child = exec("ipfs add "+newpath,
   function (error, stdout, stderr) {

	var sp = stdout;
	tdata = sp.replace('added','');
//	console.log(tdata);
        
        var arr = tdata.split(/\s+/);
        var fhash = arr[1];
        var fname = arr[2];

       console.log(fhash);
       console.log(fname);
let sql = "INSERT INTO ipfs_index SET name = ?, hash = ?";
con.query(sql, [ fname, fhash ],  function(err, rows) {

console.log("just ffuck this00");
});
     

      if (error !== null) {
          console.log('exec error: ' + error);
      }
   });
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');
        res.end();
      });
 });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  }
}).listen(1113); 
