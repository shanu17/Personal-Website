const express = require("express");
const port = 3000;
const path = require('path');
const fs = require('fs');
var cors = require('cors');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

var like_date = new Date();
var hour = like_date.getHours();
var day = like_date.getDay();
var date = like_date.getDate();
var week = 0;
if(date <= 7)
	week = 1;
else if (date <= 14)
	week = 2;
else if (date <= 21)
	week = 3;
else if (date <= 28)
	week = 4;
else
	week = 5;

app.post("/", (req, res) => {
	var comment = req.body.comment;
	var name = req.body.name;
	let d = new Date();
	let formatted_date = d.toString().split("G");
	let latest_time = null;
	fs.readFile("comments.txt", "utf8", (err, data) => {
		let c = data.split("\n");
		for(var i = c.length - 1; i >= 0; i--) {
			if(c[i].includes(name)) {
				latest_time = c[i].substring(c[i].length - 25, c[i].length);
				console.log(latest_time);
				break;
			}
		}
		if(latest_time) {
			let response = {user: name, time: latest_time};
			res.json(response);
		} else {
			res.json({user: "new"});
		}
		fs.appendFile("comments.txt", name + " " + comment + " " + formatted_date[0] + "\n", (err) => {
			if(err) {
				console.log(err);
			}
		});
	});
});

app.post("/like", (req,res) => {
	var imageId = req.body.imageId;
	var likes_per_hour = 0;
	var likes_per_day = 0;
	var likes_per_week = 0;
	var d = new Date();
	var h = d.getHours();
	var d1 = d.getDay();
	var num_week = 0;
	var num_date = d.getDate();
	if(num_date <= 7)
		num_week = 1;
	else if (num_date <= 14)
		num_week = 2;
	else if (num_date <= 21)
		num_week = 3;
	else if (num_date <= 28)
		num_week = 4;
	else
		num_week = 5;
	if(h != hour) {
		fs.readFile("likes_hour.json", "utf8", (err, data) => {
			let temp = JSON.parse(data);
			temp[imageId] = 1;
		});
		hour = h;
		likes_per_hour = 1;
		fs.writeFile("likes_hour.json", JSON.stringify(temp, null, 4), (err) => {
				if(err)
					console.log(err);
			});
	} else {
		fs.readFile("likes_hour.json", "utf8", (err, data) => {
			let temp = JSON.parse(data);
			temp[imageId] += 1;
			likes_per_hour = temp[imageId];
			fs.writeFile("likes_hour.json", JSON.stringify(temp, null, 4), (err) => {
				if(err)
					console.log(err);
			});
		});
	}
	if(d1 != day) {
		fs.readFile("likes_day.json", "utf8", (err, data) => {
			let temp = JSON.parse(data);
			temp[imageId] = 1;
			fs.writeFile("likes_day.json", JSON.stringify(temp, null, 4), (err) => {
				if(err)
					console.log(err);
			});
		});
		day = d1;
		likes_per_day = 1;
		fs.readFile("likes_hour.json", "utf8", (err, data) => {
			let temp = JSON.parse(data);
			temp[imageId] = 1;
			fs.writeFile("likes_hour.json", JSON.stringify(temp, null, 4), (err) => {
				if(err)
					console.log(err);
			});
			likes_per_hour = 1;
		});
	} else {
		fs.readFile("likes_day.json", "utf8", (err, data) => {
			let temp = JSON.parse(data);
			temp[imageId] += 1;
			likes_per_day = temp[imageId];
			fs.writeFile("likes_day.json", JSON.stringify(temp, null, 4), (err) => {
				if(err)
					console.log(err);
			});
		});
	}
	if(num_week != week) {
		fs.readFile("likes_week.json", "utf8", (err, data) => {
			let temp = JSON.parse(data);
			temp[imageId] = 1;
			fs.writeFile("likes_week.json", JSON.stringify(temp, null, 4), (err) => {
				if(err)
					console.log(err);
			});
		});
		week = num_week;
		likes_per_week = 1;
		fs.readFile("likes_day.json", "utf8", (err, data) => {
			let temp = JSON.parse(data);
			temp[imageId] = 1;
			fs.writeFile("likes_day.json", JSON.stringify(temp, null, 4), (err) => {
				if(err)
					console.log(err);
			});
			likes_per_day = 1;
		});
		fs.readFile("likes_hour.json", "utf8", (err, data) => {
			let temp = JSON.parse(data);
			temp[imageId] = 1;
			fs.writeFile("likes_hour.json", JSON.stringify(temp, null, 4), (err) => {
				if(err)
					console.log(err);
			});
			likes_per_hour = 1;
		});
	} else {
		fs.readFile("likes_week.json", "utf8", (err, data) => {
			let temp = JSON.parse(data);
			temp[imageId] += 1;
			likes_per_week = temp[imageId];
			fs.writeFile("likes_week.json", JSON.stringify(temp, null, 4), (err) => {
				if(err)
					console.log(err);
			});
		});
	}
	let response = {l_p_h: likes_per_hour, l_p_d: likes_per_day, l_p_w: likes_per_week};
	res.json(response);
});

app.post("/reset", (req,res) => {
	var time = req.body.time;

	if(time.localeCompare("hour") == 0) {
		fs.readFile("likes_hour.json", "utf8", (err, data) => {
			let temp = JSON.parse(data);
			Object.keys(temp).forEach(function(key) {
				temp[key] = 0;
			});
			fs.writeFile("likes_hour.json", JSON.stringify(temp, null, 4), (err) => {
				if(err)
					console.log(err);
			});
		});
	} else if (time.localeCompare("day") == 0) {
		fs.readFile("likes_day.json", "utf8", (err, data) => {
			let temp = JSON.parse(data);
			Object.keys(temp).forEach(function(key) {
				temp[key] = 0;
			});
			fs.writeFile("likes_day.json", JSON.stringify(temp, null, 4), (err) => {
				if(err)
					console.log(err);
			});
		});
		fs.readFile("likes_hour.json", "utf8", (err, data) => {
			let temp = JSON.parse(data);
			Object.keys(temp).forEach(function(key) {
				temp[key] = 0;
			});
			fs.writeFile("likes_hour.json", JSON.stringify(temp, null, 4), (err) => {
				if(err)
					console.log(err);
			});
		});
	} else if (time.localeCompare("week") == 0) {
		fs.readFile("likes_week.json", "utf8", (err, data) => {
			let temp = JSON.parse(data);
			Object.keys(temp).forEach(function(key) {
				temp[key] = 0;
			});
			fs.writeFile("likes_week.json", JSON.stringify(temp, null, 4), (err) => {
				if(err)
					console.log(err);
			});
		});
		fs.readFile("likes_day.json", "utf8", (err, data) => {
			let temp = JSON.parse(data);
			Object.keys(temp).forEach(function(key) {
				temp[key] = 0;
			});
			fs.writeFile("likes_day.json", JSON.stringify(temp, null, 4), (err) => {
				if(err)
					console.log(err);
			});
		});
		fs.readFile("likes_hour.json", "utf8", (err, data) => {
			let temp = JSON.parse(data);
			Object.keys(temp).forEach(function(key) {
				temp[key] = 0;
			});
			fs.writeFile("likes_hour.json", JSON.stringify(temp, null, 4), (err) => {
				if(err)
					console.log(err);
			});
		});
	}
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});