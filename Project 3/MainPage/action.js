function changeSection(options){

	for(let i = 0; i < options.childNodes.length; i++){
		if(options.childNodes[i].tagName == "DIV" && options.childNodes[i].style.display == 'block'){
			options.childNodes[i].style.display = 'none';
		}
	}
}

function showNewGameOptions(options){

	changeSection(options);

	let newGameChoice = document.getElementById('newGameChoice');
	
	newGameChoice.style.display = "block";
}

function showInstructions(options){

	changeSection(options);

	let instructions = document.getElementById('instructions');

	instructions.style.display = "block";
}

function showSection(buttonChoice){

	let options = document.getElementById('options');

	if(options.style.display == "block"){
		options.style.flex = "0";
		options.style.display = "none";
		return;
	}

	options.style.flex = "1";
	options.style.display = "block";


	switch(buttonChoice){
		case 1:
			showNewGameOptions(options);
			break;
		case 2:
			break;
		case 3:

			break;
		case 4:
			showInstructions(options);
			break;
		default:
			break;
	}
}
