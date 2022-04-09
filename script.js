var
	canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d'),
	btn = document.querySelectorAll('button'),
	vel = document.querySelectorAll('.speed'),
	velocity = document.getElementById('velocity'),
	choice = document.getElementById('choice'),
	choose = document.getElementById('choose'),
	chooseBTN = choose.querySelectorAll('button'),
	bgColor = document.getElementById('bgcolor'),
	lColor = document.getElementById('color'),
	range = document.getElementById('Range'),
	brushWidth = document.getElementById('range'),
	file = document.getElementById('file'),
	h = window.innerHeight,
	w = window.innerWidth,
	pi = Math.PI,
	x = 0,y = 0,
	grad = ctx.createLinearGradient(w/2 - 250, h/2, w/2 + 250, h/2),
	isMouseDown = false,
	coords = [],
	color = "#000",
	cwidth = 10,
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
for (var i = 0; i < chooseBTN.length; i++) {
	chooseBTN[i].addEventListener('click', function (e) {
		choose.classList.remove('active');
		choice.style.backgroundColor = color;
	}, false);
}

choice.addEventListener('click', function (e) {
	choose.classList.toggle('active');
}, false);


vel[0].addEventListener('click', function (e) {
	speed += 10;
	if (speed >= 100) {
		speed = 99;
	}
	velocity.innerHTML = 100 - speed;
}, false);

vel[1].addEventListener('click', function (e) {
	speed -= 10;
	if (speed <= 10) {
		speed = 5;
	}
	velocity.innerHTML = 100 - speed;
}, false);

bgColor.addEventListener('change', function (e) {
	let color = e.target.value;
	btn[0].style.backgroundColor = color;
	canvas.style.backgroundColor = color;
}, false);

lColor.addEventListener('change', function (e) {
	color = e.target.value;
	ctx.fillStyle = color;
	ctx.strokeStyle = color;
}, false);

brushWidth.addEventListener('change', function (e) {
	cwidth = e.target.value;
	range.innerHTML = e.target.value;
}, false);

file.addEventListener('change', function (e) {
	var file = this.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
    	canvas.style.backgroundImage = "url('" + reader.result + "')";
    }
    if (file) {
        reader.readAsDataURL(file);
    	} 
    else {
    	}
    
}, false);

canvas.addEventListener('mousedown', function (e) {
	isMouseDown = true;	
}, false);

canvas.addEventListener('mouseup', function (e) {
	isMouseDown = false;	
	ctx.beginPath();
	coords.push('mouseup');
}, false);

canvas.addEventListener('mousemove', function (e) {
	ctx.lineWidth = cwidth * 2;
	if (isMouseDown) {
		coords.push([e.clientX, e.clientY]);

		ctx.lineTo(e.clientX, e.clientY);
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(e.clientX, e.clientY, cwidth, 0, 2*pi);
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
			ctx.arc(e.clientX, e.clientY, cwidth, 0, 2*pi);
			ctx.fill();

			ctx.beginPath();
			ctx.moveTo(e.clientX, e.clientY);

			}, speed)

}

function clear() {
	let canvasStyle = getComputedStyle(canvas);
	let bgcolor = canvasStyle.backgroundColor;
	ctx.fillStyle = bgcolor;
	ctx.fillRect(0, 0, w, h);

	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.strokeStyle = color;
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