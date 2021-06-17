class xspa
{
	constructor(sidemenuCtx)
	{
		this.sidemenuCtx = sidemenuCtx;
		this.loadCtr = 0;
		//If page is refreshed or requested when opening app
		this.pageToLoad = this.getCurrPage();

		this.loadClickListeners();


		setTimeout(function ()
		{
			if (!this.pageToLoad) //Default load home
			{
				this.loadPage('home');
			}
			else //load requested page
			{
				this.loadPage(this.pageToLoad);
			}
		}.bind(this), 500);
	}

	loadClickListeners()
	{
        let nav = function(event)
        {
            this.nav(event);
        }.bind(this);

		document.addEventListener('click', nav, false);
    	document.addEventListener("touchstart", nav, false);
	}

	nav(event)
	{
		//console.log('nav event');
		let target = event.target;
		let parentElement;

		//console.log(target.parentElement.parentElement);

		//Modified for tiles
		if (target.parentElement.tagName === 'A' && target.parentElement.getAttribute('href') && target.parentElement.getAttribute('href').indexOf("#") > -1 && event.type === 'click')
		{
			x.scrollTop();
			//If # url then pass to navigation
			this.loadPage(target.parentElement.getAttribute('href').replace('#', ''));
			if(this.sidemenuCtx)
			{
				setTimeout(function ()
				{
					x.removeClass(this.sidemenuCtx.SideBar, 'show');
				}.bind(this), 300);
				this.sidemenuCtx.MenuOpen = false;
			}
		}
		else if (target.parentElement.parentElement && target.parentElement.parentElement.tagName === 'A' && target.parentElement.parentElement.getAttribute('href') && target.parentElement.parentElement.getAttribute('href').indexOf("#") > -1 && event.type === 'click')
		{
			x.scrollTop();
			//If # url then pass to navigation
			this.loadPage(target.parentElement.parentElement.getAttribute('href').replace('#', ''));
			if(this.sidemenuCtx)
			{
				setTimeout(function ()
				{
					x.removeClass(this.sidemenuCtx.SideBar, 'show');
				}.bind(this), 300);
				this.sidemenuCtx.MenuOpen = false;
			}
		}
		else if (target.tagName === 'A' && target.getAttribute('href') && target.getAttribute('href').indexOf("#") > -1 && event.type === 'click')
		{
			x.scrollTop();
			//If # url then pass to navigation
			this.loadPage(target.getAttribute('href').replace('#', ''));
			if(this.sidemenuCtx)
			{
				setTimeout(function ()
				{
					x.removeClass(this.sidemenuCtx.SideBar, 'show');
				}.bind(this), 300);
				this.sidemenuCtx.MenuOpen = false;
			}
		}
		else
		{
			return;
		}
	}

	getCurrPage()
	{
		var url = window.location.href;
		var urlArray = url.split('#');
		if (urlArray.length > 1 && urlArray[1] !== 'load')
		{
			return urlArray[1];
		}
		else
		{
			return null;
		}
	}

	loadPage(url)
	{
		if(this.loadCtr !== 0 && cordova.require("cordova/plugin_list").metadata.hasOwnProperty('cordova-plugin-splashscreen'))
		{
			navigator.splashscreen.show();
		}
		
		//This needs to be made into its own function to assist with params on getCurrPage(), loadPage(url)
		let page = url;
		let paramDelim = url.indexOf('?');
		let params = '';
		if (paramDelim > -1)
		{
			params = page.substring(paramDelim, page.length);
			page = page.split('?')[0];

			//One argument only for now

			//console.log(page);
			//console.log(params);
		}

		var filepath = 'views/' + page + '.html' + params;

		//Active Link
		let ActiveLinks = document.querySelectorAll('.active');
		for (var i = 0; i < ActiveLinks.length; i++)
		{
			try
			{
				x.removeClass(ActiveLinks[i], 'active');
			}
			catch {}
		}
		try
		{
			x.addClass(document.querySelector('.sidebar [href="#' + url + '"]'), 'active');
		}
		catch {}

		setTimeout(function ()
		{
			x.ajax(
				{
					url: filepath,
					dataType: 'html',
					success: function (response)
					{
						history.pushState(null, '', '#' + url);
						document.querySelector('.app').innerHTML = response;
						var js = document.querySelector('.app').getElementsByTagName('script');
						for (var i = 0; i < js.length; i++)
						{
							eval(js[i].innerHTML);
						}
					}.bind(this),
					error: function ()
					{
					}
				});
		}.bind(this), 500)

		if(this.loadCtr !== 0 && cordova.require("cordova/plugin_list").metadata.hasOwnProperty('cordova-plugin-splashscreen'))
		{
			setTimeout(function() 
			{
				navigator.splashscreen.hide();
			}, 600);
		}

		this.loadCtr++;
	}
}