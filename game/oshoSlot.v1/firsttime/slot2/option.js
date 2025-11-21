let a = document.getElementsByClassName("opi");
a[0].addEventListener("change", (event) => {
	document.getElementById("op1").innerText=a[0].value;
});