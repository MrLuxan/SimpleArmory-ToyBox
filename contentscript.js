let CollectedToys = [];
let ToyData;

window.onload = function() {
	let menus = document.getElementsByClassName('nav navbar-nav');

	let liLinks = [menus[0].childNodes[1] , menus[0].childNodes[7] , menus[0].childNodes[9]];

	menus[0].childNodes[3].getElementsByTagName("A")[0].removeAttribute("href");
	menus[0].childNodes[3].style.cursor = "pointer";
	let lis = menus[0].childNodes[3].getElementsByTagName("LI");
	for(let i = 0; i < lis.length; i++)
		liLinks.push(lis[i]);
	
	menus[0].childNodes[5].getElementsByTagName("A")[0].removeAttribute("href");
	menus[0].childNodes[5].style.cursor = "pointer";
	lis = menus[0].childNodes[5].getElementsByTagName("LI");
	for(let i = 0; i < lis.length; i++)
		liLinks.push(lis[i]);

	for(let i = 0; i < liLinks.length; i++)
		liLinks[i].addEventListener("click", ClearToySelect );

	let toysMenuItem = ElementFromString('<li id="ToyMenuItem"><a style="cursor:pointer;">Toys</a></li>')
	toysMenuItem.addEventListener("click", ToyMenuItemClick );

	menus[0].childNodes[5].getElementsByTagName("UL")[0].appendChild(toysMenuItem); 

	let aboutMenu = menus[1].querySelector('.dropdown-menu');
	aboutMenu.appendChild(ElementFromString('<li role="separator" class="divider"></li>'));
	aboutMenu.appendChild(ElementFromString('<li style="display: block; padding: 3px 10px; clear: both; font-weight: bold; line-height: 1.42857143; color: #333; white-space: nowrap;">Toy box extension</li>')); 
	aboutMenu.appendChild(ElementFromString('<li><a target="_blank" href="http://Robert-Walker.com">Dev\'s site</a></li>')); 

	LoadCollectedToyData();
};

function ClearToySelect()
{	
	let toyMenu = document.getElementById("ToyMenuItem");
	toyMenu.className = toyMenu.className.replace("active","").trim();
	toyMenu.parentNode.parentNode.className = toyMenu.parentNode.parentNode.className.replace("active","").trim();
}

function ToyMenuItemClick()
{
	var elems = document.querySelectorAll(".active");
	elems.forEach(function(el) { el.classList.remove("active");	});

	let toyMenu = document.getElementById("ToyMenuItem");
	toyMenu.className = 'active';
	toyMenu.parentNode.parentNode.className += ' active';

	history.pushState({}, '', window.location.href + "?toys");

	GetToyData();
}

function GetToyData()
{
	let request = new XMLHttpRequest();
	request.open('GET', chrome.extension.getURL('ToyData.json'), true);

	request.onload = function() 
	{
		if (request.status >= 200 && request.status < 400)
	  	{
	    	ToyData = JSON.parse(request.responseText);
			ViewToys();
		} 
		else
		{
    		LoadToyDataError();
		}
	};

	request.onerror = function() {
		LoadToyDataError();
	};

	request.send();
}

function ViewToys()
{
	let mainContainer = document.getElementsByClassName('container ng-scope')[0];

	mainContainer.innerHTML = '<div class="page-header"> <h2> Toys  <div class="progress progressRight"> <div class="progress max="100" type="success"> <div id="ToyProgressBar" class="progress-bar progress-bar-success"> <span id="ToyProgressBarNumber" class="ng-binding ng-scope">49 / 62 (79%)</span> </div>	</div> </div> </h2> </div>';

	let firstLetter = "";
	let letterBlock = [];	

	ToyData.toys.forEach(function(toy) {
	 	
	 	let letter = toy[2].charAt(0);

	 	if(firstLetter != letter)
	 	{
	 		if(firstLetter != "")
	 		{
	 			RenderToyBlock(mainContainer,firstLetter,letterBlock);
	 			letterBlock = [];
	 		}
	 	}
			letterBlock.push(toy);
	 	firstLetter = letter;
	});

	RenderToyBlock(mainContainer,firstLetter,letterBlock);

	let checkBoxs = document.getElementsByClassName("toyCheckBox");
	for(let i = 0; i < checkBoxs.length ; i++)
	{
		checkBoxs[i].addEventListener("click", ClickCheckBox);
	}

	SizeProgressBar();
}

function ClickCheckBox(e)
{
	let checkbox = e["srcElement"];
	let image = checkbox.parentNode.querySelectorAll('img')[0];
	let index = CollectedToys.indexOf(checkbox.value);

	if(checkbox.checked)
	{
		if(index === -1 )
		{
			CollectedToys.push(checkbox.value);
		}
		image.style.filter = "grayscale(0%)";
	}
	else
	{
		if (index != -1) 
		{
			CollectedToys.splice(index, 1);
		}
		image.style.filter = "grayscale(100%)";
	}

	SizeProgressBar();
	SaveCollectedToyData();
}

function SizeProgressBar()
{
	let bar = document.getElementById("ToyProgressBar");
	let percent = (CollectedToys.length / ToyData.toys.length) * 100;
	bar.style.width = percent + "%";

	let numberString = "";

	if(CollectedToys.length >= 180)
	{
		numberString = CollectedToys.length + " / " + ToyData.toys.length + " (" + Math.floor(percent) + "%)";
	}
	else if(CollectedToys.length >= 80)
	{
		numberString = CollectedToys.length + " / " + ToyData.toys.length;
	}
	else if(CollectedToys.length >= 25)
	{
		numberString = CollectedToys.length;
	}

	let nunber = document.getElementById("ToyProgressBarNumber");
	nunber.innerHTML = numberString;

}

function RenderToyBlock(menus,letter,toyArray)
{
	let addString = '<div class="sect ng-scope"><h5 class="zoneHeader">'+letter+'</h5>';
	toyArray.forEach(function(blockToy) {
		let collected = CollectedToys.indexOf(blockToy[0]) != -1;
		addString += '<div style="float:left;position:relative;"><input '+(collected ? "checked" : "") +' class="toyCheckBox" style="position:absolute;left:0;bottom:0;z-index:10;" type="checkbox" value="'+blockToy[0]+'"><a target="_blank" class="thumbnail ng-scope borderOff" href="//wowhead.com/item='+blockToy[0]+'"> <img style="filter: grayscale('+(collected ? "0" : "100")+'%);" src="//wow.zamimg.com/images/wow/icons/medium/'+blockToy[1]+'.jpg"> </a></div>';
	});
    addString += '</div>';
	menus.innerHTML += addString;
}

function LoadToyDataError()
{
	let mainContainer = document.getElementsByClassName('container ng-scope')[0];
	mainContainer.innerHTML = '<div class="page-header"> <h2> Toys  <div class="progress progressRight"> <div class="progress"> <div id="ToyProgressBar" class="progress-bar progress-bar-success"> <span id="ToyProgressBarNumber" class="ng-binding ng-scope"></span> </div>	</div> </div> </h2> </div> <span style="color:red">Error loading toy data</span>';
}

function ElementFromString(string)
{
	let div = document.createElement('div');
	div.innerHTML = string;
	return div.firstChild;
}

function SaveCollectedToyData()
{
	chrome.storage.sync.set({'CollectedToys': CollectedToys}, function() {
		//console.log('Settings saved');
	});
}

function LoadCollectedToyData() {
	chrome.storage.sync.get('CollectedToys', function(data) {
		if(typeof data.CollectedToys !== "undefined")
		{
			CollectedToys = data.CollectedToys;
		}
	});
}