var
	canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d'),
	btn = document.querySelectorAll('button'),
	vel = document.querySelectorAll('.speed'),
	input = document.getElementById('color'),
	h = window.innerHeight,
	w = window.innerWidth,
	pi = Math.PI,
	x = 0,y = 0,
	grad = ctx.createLinearGradient(w/2 - 250, h/2, w/2 + 250, h/2),
	isMouseDown = false,
	coords = [],
	color,
	speed = 30;

canvas.width = w;
canvas.height = h;

function eraser_color() {
	let canvasStyle = getComputedStyle(canvas);
	btn[0].style.backgroundColor = canvasStyle.backgroundColor;	
}
eraser_color();

for (var i = 0; i < btn.length - 2; i++) {
	btn[i].addEventListener('click', function (e) {
		let style = getComputedStyle(this);
		color = style.backgroundColor;
		ctx.fillStyle = color;
		ctx.strokeStyle = color;
	}, false);
}

vel[0].addEventListener('click', function (e) {
	speed += 10;
	if (speed >= 100) {
		speed = 100;
	}
}, false);

vel[1].addEventListener('click', function (e) {
	speed -= 10;
	if (speed <= 10) {
		speed = 5;
	}
}, false);

input.addEventListener('change', function (e) {
	let bgColor = e.target.value;
	btn[0].style.backgroundColor = bgColor;
	canvas.style.backgroundColor = bgColor;
}, false);


/*
Rectangle with animation
ctx.fillStyle = "#0f0";
ctx.fillRect(50, 50, 100, 100);
#translate cub to right
setInterval(function () {

	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, w, h);

	ctx.fillStyle = "#0f0";
	ctx.fillRect(x++, 50, 100, 100);
}, 10);*/


/* Half-Arc:
ctx.fillStyle = "#f00";
ctx.arc(w / 2 , h / 2, 100, 0, pi);
ctx.fill();
*/

/*
// Triangle with scale
ctx.strokeStyle = "#00f";
ctx.lineWidth = "5";
ctx.scale(2, 2);
ctx.beginPath();
ctx.moveTo(80, 50);
ctx.lineTo(50, 100);
ctx.lineTo(110, 100);
ctx.closePath();
ctx.stroke();
*/

/*
// Text in center with gradient
grad.addColorStop('0', 'red');
grad.addColorStop('.5', 'green');
grad.addColorStop('1', 'blue');
ctx.fillStyle = grad;
ctx.font = "bold italic 6em Poppins";
ctx.textAlign = "center";
ctx.fillText("By Tim", w / 2, h / 2);

*/
canvas.addEventListener('mousedown', function (e) {
	isMouseDown = true;	
}, false);

canvas.addEventListener('mouseup', function (e) {
	isMouseDown = false;	
	ctx.beginPath();
	coords.push('mouseup');
}, false);

ctx.lineWidth = 10 * 2;
canvas.addEventListener('mousemove', function (e) {
	if (isMouseDown) {
		coords.push([e.clientX, e.clientY]);

		ctx.lineTo(e.clientX, e.clientY);
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(e.clientX, e.clientY, 10, 0, 2*pi);
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(e.clientX, e.clientY);
	}
});

function save() {
	localStorage.setItem('coords', JSON.stringify(coords));
}

function replay() {
	var
		timer = setInterval(function () {
			if (!coords.length) {
				clearInterval(timer);
				ctx.beginPath();
				return;
			}

			var 
				crd = coords.shift(),
				e = {
					clientX: crd["0"],
					clientY: crd["1"],
				};

			ctx.lineTo(e.clientX, e.clientY);
			ctx.stroke();

			ctx.beginPath();
			ctx.arc(e.clientX, e.clientY, 10, 0, 2*pi);
			ctx.fill();

			ctx.beginPath();
			ctx.moveTo(e.clientX, e.clientY);

			}, speed)

}

function clear() {
	let bgcolor = input.value;
	console.log(input.value);
	ctx.fillStyle = bgcolor;
	ctx.fillRect(0, 0, w, h);

	ctx.beginPath();
	ctx.fillStyle = color;
	if (!localStorage.getItem(coords)) {
		coords = []		
		return;
			}
}

document.addEventListener('keydown', function (e) {
	
	if (e.keyCode == 83) { //save
		save();
		console.log('Saved!');
	}

	if (e.keyCode == 82) { // replay
		console.log('Replaying...');
		coords = JSON.parse(localStorage.getItem('coords'));

		// clear();
		replay();
	}

	if (e.keyCode == 67) { // clear
		clear();
		console.log('Cleared!');
	}

}, false);