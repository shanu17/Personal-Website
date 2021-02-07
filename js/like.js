const like_btn = document.getElementById("like");
const reset_form = document.getElementById("resetForm")

like_btn.addEventListener("click", (e) => {
	let image = document.querySelector("#carouselItems .active").getAttribute('data-slide-to');
	let req = new XMLHttpRequest();
	req.open("POST", "http://localhost:3000/like", "true");
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	let params = "imageId=" + image;
	req.send(params);
});

reset_form.addEventListener("submit", (e) => {
	e.preventDefault();
	let username = document.getElementById("username").value;
	if(username.localeCompare("dr_Rosta_Farzan") == 0) {
		let params = "";
		let req = new XMLHttpRequest();
		req.open("POST", "http://localhost:3000/reset", "true");
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		if(document.getElementById("hour").checked) {
			params = "time=hour";
		} else if (document.getElementById("day").checked) {
			params = "time=day";
		} else if (document.getElementById("week").checked) {
			params = "time=week";
		}
		console.log(params);
		req.send(params);
		req.onreadystatechange = function () {
			if(this.readyState == 4 && this.status == 200) {
				res = JSON.parse(this.response);
				console.log(response);
			}
		}
	}
});