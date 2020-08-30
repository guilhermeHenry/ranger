const getter = require('./helpers/getters.js');
const setter = require('./helpers/setters.js');
const toCamelCase = require('lodash/camelCase');
const foreach = require('lodash/foreach');
const getallmyelements = require('getallmyelements/');

import './style.scss';

const RS = function () {
	this.elements = {
		slider: null,
		scaleItems: []
	};

	this.datas = {
		scaleItemsTotal: null,
		active: false
	};

	this.configs  = {
		target: 'rs1',
		prefix: 'rs',
		min:  0,
		max:  4,
		step: 1
	};

	['data', 'element', 'config'].forEach(item => {
		const get = toCamelCase(`get_${item}`);
		const set = toCamelCase(`set_${item}`);
		const all = toCamelCase(`get_${item}s`);
		const target = item + 's';

		this[get] = getter(this, target);
		this[set] = setter(this, target);
		this[all] = () => (this[target]);
	});

	this.init();
}

RS.prototype.init = function() {
	let slider = document.getElementById(this.getConfig('target'));

	if (!slider){
		throw new SyntaxError('Elemento slider com id' + this.getConfig('target') + ' não foi encontrado');
	}

	// ### GET ALL ELEMENTS
	foreach(slider.children, this.setAllElements.bind(this));
	this.setElement('slider', slider);

	// ### CREATE SCALE
	if (slider.hasAttribute('scale') && this.getData('values')){}

	this.getValues();
	this.createScale();

	// ### SET ALL DATAS
	let sliderWidth = this.getElement('bar').offsetWidth;
	let sliderLeft  = this.getElement('bar').getBoundingClientRect().left;
	let sliderRight = 0;
		sliderRight += sliderWidth;
		sliderRight += sliderLeft;

	this.setData('sliderLeft', sliderLeft);
	this.setData('sliderRight', sliderRight);
	this.setData('sliderWidth', sliderWidth);
	this.setData('pointerWidth', this.getElement('pointer').clientWidth);
	this.setData('scaleItemsTotal', this.getElement('scaleItems').length);

	this.events();
}

RS.prototype.createScale = function() {
	const prefix = this.getConfig('prefix');
	if (this.getElement('slider').hasAttribute('scale') && this.getData('values')){
		let scale = createElement('div').class(prefix + '-scale').get();

		let items = [];

		this.getData('values').forEach(item => {
			let ins = createElement('ins').class(prefix + '-scale-item-ins').textContent(item).get();
			let value = createElement('span').class(prefix + '-scale-item').get();

			value.appendChild(ins);
			scale.appendChild(value);

			this.setElement('scaleItems', value);
		});
		this.getElement('slider').appendChild(scale);
	}
}

RS.prototype.setAllElements = function(element) {
	['input', 'bar', 'selected', 'pointer', 'a'].forEach(name => {
		if (element.classList.contains(this.getConfig('prefix') + '-' + name)){
			this.setElement(name, element);
			let children = element.children;
			if (children.length > 0){
				foreach(children, this.setAllElements.bind(this));
			}
		}
	});
}

RS.prototype.events = function() {
	let left = null;
	let bar = this.getElement('bar');
	let pointer = this.getElement('pointer');
	let startX = null;

	let blockWidth = (this.getData('sliderWidth') / this.getData('blocksTotal')).toFixed(2);
	this.setData('blockWidth', blockWidth);

	// Ajustar ponteiro
	pointer.addEventListener('mousedown', event => {
		left  = pointer.offsetLeft;
		left += event.offsetX;
		left -= 7;
		this.setLeft(left);
		this.setData('active', true);
		startX = event.pageX - pointer.offsetLeft;
		left = pointer.offsetLeft;
	});

	document.addEventListener('mousemove',  (event) => {
		if(!this.getData('active')) return;
		let x = 0;
		    x += event.pageX - startX;
			x -= left;

		this.setLeft(left + x);
	});

	document.addEventListener('mouseup',  (event) => {
		if (this.getData('active')){ 
			this.setData('active', false);
			this.adjust();
		}
	});

}

RS.prototype.adjust = function() {
	let selected = this.getElement('pointer').getBoundingClientRect().left - this.getData('sliderLeft');
	let position = Math.round(selected / this.getData('blockWidth'));
	let left = this.getData('blockWidth') * position;

	
	this.setLeft(left);
};

RS.prototype.setLeft = function(size) {

	if (size >= 0 && size < this.getData('sliderWidth') - 20){
		this.getElement('pointer').style.left = size + 'px';
		this.getElement('pointer').setAttribute('tooltip', size);
	}

	if (size > this.getData('sliderWidth') - 20){
		this.getElement('pointer').style.left = this.getData('sliderWidth') - 20 + 'px';
		this.getElement('pointer').setAttribute('tooltip', this.getData('sliderWidth'));
	}

	if (size < 0){
		this.getElement('pointer').style.left = 0 + 'px';
		this.getElement('pointer').setAttribute('tooltip', 0);
	}
}

RS.prototype.getValues = function() {
	const slider = this.getElement('slider');
	const min    = slider.hasAttribute('min') ? parseInt(slider.getAttribute('min')) : null;
	const max    = slider.hasAttribute('max') ? parseInt(slider.getAttribute('max')) : null;
	const step   =  slider.hasAttribute('step') ? parseInt(slider.getAttribute('step')) : null;
	let values = null;

	// MIN & MAX
	if (min !== null && max !== null){
		if (!step){throw new SyntaxError('No step defined...')}

		values = [];
		for(var i = 0; i <= (max - min) / step; i++){
			values.push(min + i * step);
		}
	}

	// ## VALUES
	if (slider.hasAttribute('values')){
		values = slider.getAttribute('values').split(',').map(item => parseInt(item));
	}

	if (!values){
		throw new SyntaxError('Add values...')
	}

	this.setData('blocksTotal', values.length - 1);
	this.setData('values', values);
}

var createElement = function (tagName) {
	return {
		element: document.createElement(tagName),
		class(...name){
			if (name.length === 0){throw new SyntaxError('Passe a classe')}
			this.element.classList.add(...name);
			return this;
		},
		textContent(text){
			this.element.innerHTML = text;
			return this;
		},
		attr(...attrs){
			if (attrs.length === 0){throw new SyntaxError('Passe a atributo')}
			else if (attrs.length === 2 && typeof attrs[0] === 'string' && attrs[0].indexOf(':') === -1){
				this.element.setAttribute(attrs[0], attrs[1]);
			}
			else{
				attrs.forEach(attr => {
					if (attr.indexOf(':')){
						let split = attr.split(':');
						this.element.setAttribute(split[0], split[1]);
					}
				});
			}

			return this;
		},
		get(){
			return this.element;
		}
	}
}

new RS();


















