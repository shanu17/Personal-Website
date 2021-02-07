const comment_form = document.getElementById("comments");
var counter = 0;

comment_form.addEventListener("submit", (e) => {
	e.preventDefault();
	let comment = document.getElementById("message").value;
	let name = document.getElementById("fname").value;
	let req = new XMLHttpRequest();
	req.open("POST", "http://localhost:3000/", "true");
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	let params = "name=" + name + "&comment=" + comment;
	req.send(params);
	let allComments = document.getElementById("allComments");
	allComments.innerHTML += "<p>" + comment + "</p>";
	req.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			res = JSON.parse(this.response);
			if(res.user.localeCompare("new") == 0)
				confirm("Welcome to the site!")
			else
				confirm("Welcome back " + res.user + "! Your last comment was on " + res.time);
		}
	}
});