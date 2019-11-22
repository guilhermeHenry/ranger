const range = document.querySelector('.range');
const slider = range.querySelector('.box');
const button = range.querySelector('button');
const ground = range.querySelector('hr');
const steps  = range.querySelector('ul');

let styleComputed = window.getComputedStyle(button);

const min  = 0;
const step = 4;
const max  = slider.offsetWidth;

let left   = null;
let startX = null;
let isDown = false;

console.log(
	Math.abs(0.008)
);

for (var i = 1; i <= step; i++){
	let text = document.createTextNode(i);
	let element = document.createElement('div');
		element.appendChild(text); 

		element.style.width = 100 / step + '%';
	steps.appendChild(element);
}

button.onmousedown = function (e) {
	left  = button.offsetLeft;
	left += e.offsetX;
	left -= 15;

	setLeft(left);

	isDown = true;
	startX = e.pageX - button.offsetLeft;
	left = button.offsetLeft;
}

// button.onmouseup = function () {isDown = false; adjust();}
window.onmouseup = function () {if (isDown === true) isDown = false; adjust();}

window.onmousemove = function (e) {
	if(!isDown) return;
	let x = 0;
	    x += e.pageX - startX;
		x -= left;

	setLeft(left + x);
}


ground.onmousedown = function(e) {
	isDown = true;
	left  = e.offsetX;
	left -= 15; //center
	setLeft(left);
	isDown = true;
	startX = e.pageX - button.offsetLeft;
	left = button.offsetLeft;
};


function setLeft(size) {button.style.left = `${check(size)}px`;}
function check(value)  {return value < min ? min : value > max - 30 ? max - 30 : value}
function adjust() {
	let total = 0;
	let calc  = Math.ceil(max / (step * 2));
	let rest  = button.offsetLeft % calc;

	if (button.offsetLeft < calc){
		total = calc;
	}  else{
		total = (button.offsetLeft - rest) + calc;
	}

	total -= 15;

	setLeft(total);
}
 
























































































































