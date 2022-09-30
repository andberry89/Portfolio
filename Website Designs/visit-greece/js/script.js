let controlBox = {

	/*GRABBING NECESSARY NODES FROM THE DOCUMENT*/
	masthead : document.getElementById('masthead'),
	container : document.getElementsByClassName('container')[0],
	body : document.getElementsByTagName('body')[0],
	blockQuote : document.getElementsByTagName('blockquote')[0],
	footer : document.getElementsByTagName('footer')[0],

	/*CREATING ELEMENTS*/
	box : document.createElement('div'),
	themeButton : document.createElement('button'),
	smA : document.createElement('a'),
	mdA : document.createElement('a'),
	lgA : document.createElement('a'),

	/*CREATING TEXT NODES*/
	theme : document.createTextNode('Dark Theme'),
	sizeSmA : document.createTextNode('A'),
	sizeMdA : document.createTextNode('A'),
	sizeLgA : document.createTextNode('A'),

	/*THIS FUNCTION CREATES THE THEME BUTTON, THEN SETS THE APPROPRIATE ATTRIBUTES THEN ADDS THE TEXT NODE AND AN EVENT LISTENER
	IT THEN CREATES EACH FONT-SIZE BUTTON, ADDING APPROPRITAE ATTRIBUTES, NODES, AND EVENT LISTNERS
	FINALLY IT SETS UP THEN ADDS THE THEME BUTTON AS WELL AS FONT SIZE ICONS TO THE CONTROL BOX*/
	init : function() {

		//'CHANGE THEME' BUTTON
		this.themeButton.setAttribute('id', 'themeBtn');
		this.themeButton.setAttribute('type', 'button');
		this.themeButton.appendChild(this.theme);
		this.themeButton.addEventListener('click', this.changeTheme, false);

		//'CHANGE FONT SIZE' BUTTONS
		this.smA.setAttribute('href', '#');
		this.smA.setAttribute('title', 'Regular Text Size');
		this.smA.appendChild(this.sizeSmA);
		this.smA.setAttribute('id', 'smA');
		this.smA.className = 'sizeChoice';
		this.smA.addEventListener('click', this.stopClick, false);
		this.smA.addEventListener('click', this.changeSmall, false);

		this.mdA.setAttribute('href', '#');
		this.smA.setAttribute('title', 'Larger Text Size');
		this.mdA.appendChild(this.sizeMdA);
		this.mdA.setAttribute('id', 'mdA');
		this.mdA.className = 'sizeChoice';
		this.mdA.addEventListener('click', this.stopClick, false);
		this.mdA.addEventListener('click', this.changeMedium, false);

		this.lgA.setAttribute('href', '#');
		this.smA.setAttribute('title', 'Largest Text Size');
		this.lgA.appendChild(this.sizeLgA);
		this.lgA.setAttribute('id', 'lgA');
		this.lgA.className = 'sizeChoice';
		this.lgA.addEventListener('click', this.stopClick, false);
		this.lgA.addEventListener('click', this.changeLarge, false);

		//ADDING BUTTON AND ANCHORS TO CONTROL BOX
		this.box.setAttribute('id', 'controlBox');
		this.box.setAttribute('aria-hidden', 'true');
		this.box.appendChild(this.themeButton);
		this.box.appendChild(this.smA);
		this.box.appendChild(this.mdA);
		this.box.appendChild(this.lgA);		

		this.masthead.appendChild(this.box);
	},

	/*PREVENTS ANCHORS FROM DOING ANYTHING WHEN CLICKED*/
	stopClick : function(evt){
		this.evt.preventDefault();
	},

	/*CHECKS THE TEXT NODE WITHIN THE BUTTON AND CHANGES THE THEME BASED ON WHAT'S INSIDE*/
	changeTheme : function(){

		if(this.firstChild.data == 'Dark Theme'){

			controlBox.body.className='dark'; 
			controlBox.themeButton.firstChild.data = 'Light Theme';
			controlBox.blockQuote.className = 'darkThemeFont';
			controlBox.footer.className = 'darkThemeFont wrapper grid';

		} else {

			controlBox.body.className='';
			controlBox.themeButton.firstChild.data = 'Dark Theme';
			controlBox.blockQuote.className = '';
			controlBox.footer.className = 'wrapper grid';
		}
	},

	changeSmall : function(){
		controlBox.container.className='container';
	},

	changeMedium : function (){
		controlBox.container.className='container md';
	},

	changeLarge : function(){
		controlBox.container.className='container lg';
	}
}

controlBox.init();