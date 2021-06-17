/**
* Represents a single menu item consumed by clsDynamicMenu. Creates obj Array [{ "pageFileName": "", "icon": "", "menuTitle": "" }, { "pageFileName": "", "icon": "", "menuTitle": "" }]
* To be used as a single item or array of items. If used without dropDownMenu then add <li class="nav-item"> wrap
* @constructor
* @param {Object} options - options to initialize an object.
* @param {String} options.pageFileName - Page File Name
* @param {String} options.icon - Menu Item Icon
* @param {String} options.menuTitle - Menu Item Title
*/
class clsSingleMenuItem
{
	constructor(options)
	{
		this.pageFileName = "";
		this.icon = "";
		this.menuTitle = "";

		if (typeof options !== 'undefined')
		{
			this.pageFileName = options.pageFileName || "";
			this.icon = options.icon || "";
			this.menuTitle = options.menuTitle || "";
		}
	}
}

/**
* Represents a menu constructor.
* @constructor
* @param {Object} options - options to initialize an object.
* @param {Array} options.clsSingleMenuItemArray - Array, Object, String [{ "pageFileName": "", "icon": "", "menuTitle": "" }, { "pageFileName": "", "icon": "", "menuTitle": "" }] Array or string representation of an array that contains values for menu item(s). Anonymous/JSON Array in structure of clsSingleMenuItem or Array of clsSingleMenuItem objects or String in structure of clsSingleMenuItem.
* @param {Boolean} options.isDropDown - Is menu a dropDown
* @param {Boolean} options.isTiles - Is menu a set of tiles
* @param {String} options.title - Menu Title
* Containers are dynamicSideMenu & dynamicTilesMenu
*/
class clsDynamicMenu
{
	constructor(options)
	{
		if (typeof options === 'undefined')
		{
			throw "dynamicMenu.js clsDynamicMenu: options must be defined.";
		}

		this.sideMenuContainer = document.querySelector('dynamicSideMenu');
		this.tilesMenuContainer = document.querySelector('dynamicTilesMenu');

		let tilesMenuContainerInnerWrapper;
		if(!document.querySelector('.tilesMenuContainerInnerWrapper') && this.tilesMenuContainer)
		{
			tilesMenuContainerInnerWrapper = document.createElement('div');
			tilesMenuContainerInnerWrapper.classList.add('tilesMenuContainerInnerWrapper');
			//this.tilesMenuContainer.appendChild(tilesMenuContainerInnerWrapper);
		}

		this.singleMenuItemArray = [];

		options.clsSingleMenuItemArray = options.clsSingleMenuItemArray || '';

		if (options.clsSingleMenuItemArray === '')
		{
			//Do nothing can add menu items manually
		}
		else if (Array.isArray(options.clsSingleMenuItemArray) && options.clsSingleMenuItemArray.length > 0)
		{
			//Handle anonymous/JSON Array in structure of clsSingleMenuItem or Array of clsSingleMenuItem objects
			this.cast(options.clsSingleMenuItemArray);
		}
		else if (typeof options.clsSingleMenuItemArray === 'string' && options.clsSingleMenuItemArray.length > 0)
		{
			//Handle String in structure of clsSingleMenuItem
			options.clsSingleMenuItemArray = JSON.parse(options.clsSingleMenuItemArray);
			this.cast(options.clsSingleMenuItemArray);
		}
		else
		{
			throw "dynamicMenu.js clsDynamicMenu: options.clsSingleMenuItemArray is malformed.";
		}

		this.isDropDown = false;
		if (typeof options.isDropDown !== 'undefined' && options.isDropDown)
		{
			this.isDropDown = true;
		}

		this.isTiles = false;
		if (typeof options.isTiles !== 'undefined' && options.isTiles)
		{
			this.isTiles = true;
		}

		this.title = options.title || '';

		this.UID; //Unique ID for Dropdown
		if (this.isDropDown)
		{
			this.UID = this.title.split(' ').join('');

			let pass = false;
			while (!pass) //Ensure UID does not already exist
			{
				let tempUID = this.UID + Math.floor(Math.random() * 65).toString();
				if (document.querySelector('.' + tempUID) === null)
				{
					this.UID = tempUID;
					pass = true;
				}
			}
		}

		this.constructMenu();

		//loadClickListeners();
	}

	constructMenu()
	{
		let domparser = new DOMParser();
		let contentTemplates;

		x.ajax(
			{
				url: 'templates/dynamicMenu.html',
				success: function (response)
				{
					contentTemplates = domparser.parseFromString(response, 'text/html');
				}.bind(this),
				error: function ()
				{
				}
			});

		//console.log(contentTemplates);

		let SingleURLContainer = contentTemplates.querySelector('.SingleURL').innerHTML; //Will be duplicated
		let SideMenuSingleItem = contentTemplates.querySelector('.SideMenuSingleItem').innerHTML; //Will be duplicated
		let DropdownContainer = contentTemplates.querySelector('.DropdownContainer').innerHTML; //Single Instance
		//Tiles
		let TileContainer = contentTemplates.querySelector('.TileContainer').innerHTML; //Single Tile

		if (this.isDropDown)
		{
			//sideMenu Dropdown

			this.sideMenuContainer.innerHTML = DropdownContainer
				.split('[Title]').join(this.title)
				.split('[UID]').join(this.UID);

			let linksContainer = this.sideMenuContainer.querySelector('.dropdown-menu');

			for (var i = 0; i < this.singleMenuItemArray.length; i++)
			{
				//<a class="nav-link" href="#[PageFileName]"><span class="[iconClasses]"></span> [PageTitle] </a>
				let linkBuilding = document.createElement('div');
				linkBuilding.innerHTML = SingleURLContainer
					.split('[PageFileName]').join(this.singleMenuItemArray[i].pageFileName)
					.split('[iconClasses]').join(this.singleMenuItemArray[i].icon)
					.split('[PageTitle]').join(this.singleMenuItemArray[i].menuTitle);

				linksContainer.appendChild(linkBuilding.querySelector('a'));
			}

			this.sideMenuContainer.querySelector('.dropdown-toggle').addEventListener('click', function ()
			{
				if (this.sideMenuContainer.querySelector('.dropdown').classList.contains('show'))
				{
					this.sideMenuContainer.querySelector('.dropdown').classList.remove('show');
					this.sideMenuContainer.querySelector('.dropdown-menu').classList.remove('show');
				}
				else
				{
					this.sideMenuContainer.querySelector('.dropdown').classList.add('show');
					this.sideMenuContainer.querySelector('.dropdown-menu').classList.add('show');
				}
			}.bind(this));

		}
		else
		{
			//sideMenu Items
			this.sideMenuContainer.innerHTML = '';

			for (var i = 0; i < this.singleMenuItemArray.length; i++)
			{
				let link = SingleURLContainer
					.split('[PageFileName]').join(this.singleMenuItemArray[i].pageFileName)
					.split('[iconClasses]').join(this.singleMenuItemArray[i].icon)
					.split('[PageTitle]').join(this.singleMenuItemArray[i].menuTitle);

				//<a class="nav-link" href="#[PageFileName]"><span class="[iconClasses]"></span> [PageTitle] </a>
				let linkBuilding = document.createElement('div');
				linkBuilding.innerHTML = SideMenuSingleItem.split('[Link]').join(link);

				this.sideMenuContainer.appendChild(linkBuilding.querySelector('li'));
			}

		}
		if (this.isTiles)
		{
			if(!document.querySelector('dynamicTilesMenu'))
			{
				return;
			}

			//Tiles on page
			this.tilesMenuContainer = document.querySelector('dynamicTilesMenu');

			let ul = contentTemplates.querySelector('.TileContainer').querySelector('ul');
			let li = contentTemplates.querySelector('.TileContainer').querySelector('li');

			document.querySelector('dynamicTilesMenu').appendChild(ul);
			let newUl = document.querySelector('dynamicTilesMenu').querySelector('ul');
			newUl.innerHTML = '';

			if(typeof this.tilesMenuContainer === 'object')
			{
				for (var i = 0; i < this.singleMenuItemArray.length; i++)
				{
					let thisli = document.createElement('div');
					thisli.innerHTML = li.outerHTML;
					thisli = thisli.querySelector('li');

					thisli.innerHTML = thisli.innerHTML.replace('[PageFileName]', this.singleMenuItemArray[i].pageFileName);
					thisli.innerHTML = thisli.innerHTML.replace('[iconClasses]', this.singleMenuItemArray[i].icon);
					thisli.innerHTML = thisli.innerHTML.replace('[PageTitle]', this.singleMenuItemArray[i].menuTitle);

					newUl.appendChild(thisli);
				}
			}

		}
	}

	addMenuItem()
	{
		//Future use
		//Add menu item to array then rebuild

		//this.constructMenu();
	}

	cast(SingleMenuItemArray)
	{
		for (var ictr = 0; ictr < SingleMenuItemArray.length; ictr++)
		{
			//this.singleMenuItemArray.push(Object.assign(new clsSingleMenuItem, SingleMenuItemArray[ictr])); //ToDo: assign not compatible

			let newclsSingleMenuItem = new clsSingleMenuItem();

			for (var prop in SingleMenuItemArray[ictr])
			{
				newclsSingleMenuItem[prop] = SingleMenuItemArray[ictr][prop];
			}
			this.singleMenuItemArray.push(newclsSingleMenuItem);
		}

		if (this.singleMenuItemArray.length <= 0)
		{
			console.log("dynamicMenu.js clsDynamicMenu: options.clsSingleMenuItemArray is malformed or empty.");
		}
	}
}