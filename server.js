const express = require("express");
var cron = require('node-cron');
const app = express();
const { exec } = require("child_process");
const fs = require('fs');
const path = './results.json';
const portUsed = 4000;
//json format
let obj = {
	data:[]
};

// Home Route
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/view/index.html");
});

// Graph route
app.get("/results", (req, res) => {
	res.sendFile(__dirname + "/results.json");
});

//Manual Test route
app.post("/test", (req, res) => {
	exec("speed-test --json", (err, stdout, stderr) => {
	  if (err || stderr) return res.send("Error while testing internet speed.");
	  const result = JSON.parse(stdout);
	  if (fs.existsSync(path)) {
			//file exists
			fs.readFile(path,function(err,content){
				if(err) throw err;

				var parseJson = JSON.parse(content);
				var date = new Date();
				var jsObj = result;

				jsObj.dateStamp = date;
				console.log(jsObj) 
				parseJson.data.push(jsObj)
				fs.writeFile(path,JSON.stringify(parseJson),function(err){
					if(err) throw err;
				})
			})
		}else{
			fs.writeFile(path,JSON.stringify(obj),function(err){
				if(err) throw err;
			});
		}
	res.send("<script> window.location = 'localhost:4000'; </script>")
	});
});

// CRON scheduler every 4 mins of internet speed testing
cron.schedule('0 */4 * * * *', () => {
	try{
		exec("speed-test --json", (err, stdout, stderr) => {
			if (err) {
				console.log(`error: ${err.message}`);
				return;
			}
			const result = JSON.parse(stdout);
			if (fs.existsSync(path)) {
			  //file exists
			  fs.readFile(path,function(errorfile,content){
				  if(errorfile) throw errorfile;
	  
				  var parseJson = JSON.parse(content);
				  var date = new Date();
				  var jsObj = result;
	  
				  jsObj.dateStamp = date;
				  console.log(jsObj) 
				  parseJson.data.push(jsObj)
				  fs.writeFile(path,JSON.stringify(parseJson),function(err){
					  if(err) throw err;
				  })
			  })
			}else{
				fs.writeFile(path,JSON.stringify(obj),function(err){
					if(err) throw err;
				});
			}
		  	console.log('finished testing.')
		});
	} catch(err) {
		console.error(err)
	}

});

// Server
app.listen(portUsed, () => {
	console.log(`AEIA is running on port : ${portUsed}`);
});
