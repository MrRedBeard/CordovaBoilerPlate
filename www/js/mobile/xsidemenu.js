class xsideMenu
{
    constructor()
    {
        this.MenuButton = document.querySelectorAll('.menu-button');
        this.MenuClose = document.querySelector('.menu-close');
        this.SideBar = document.querySelector('.sidebar');
        this.BodyTouch = new xtouchEvent('body', this);
        this.SidebarTouch = new xtouchEvent('.sidebar', this);

        this.MenuOpen = false;

        this.addClickEvents();
        this.addTouchEvent();

    }

    addClickEvents()
    {
        let MenuOpenerEvent = function()
        {
            this.MenuOpener();
        }.bind(this);

        for(let i=0; i < this.MenuButton.length; i++)
        {
            this.MenuButton[i].addEventListener('click', MenuOpenerEvent, false);
        }

        this.MenuClose.addEventListener('click', MenuOpenerEvent, false);
    }

    addTouchEvent()
    {
        this.BodyTouch.onTouchEvent = function ()
        {
            var startPosPercent = (this.BodyTouch.touchValues.touchStartX * 100) / this.BodyTouch.touchValues.deviceWidth;

            //console.log(startPosPercent);

            //console.log(BodyTouch.touchValues.touchStartX - BodyTouch.touchValues.touchEndX);
            //console.log(BodyTouch.touchValues.touchAction);

            if (this.BodyTouch.touchValues.touchDirection === 'right' && startPosPercent <= 9.7)
            {
                x.addClass(this.SideBar, 'show');
                this.MenuOpen = true;
            }
            else if (this.BodyTouch.touchValues.touchAction === 'tap')
            {
                x.removeClass(this.SideBar, 'show');
                this.MenuOpen = false;
            }
            else
            {
                x.removeClass(this.SideBar, 'show');
                this.MenuOpen = false;
            }
        }.bind(this);
        this.SidebarTouch.onTouchEvent = function ()
        {
            if (this.SidebarTouch.touchValues.touchDirection === 'left')
            {
                x.removeClass(this.SideBar, 'show');
                this.MenuOpen = false;
            }
        }.bind(this);
    }

    MenuOpener(event)
    {
        if (!this.MenuOpen)
        {
            x.addClass(this.SideBar, 'show');
            this.MenuOpen = true;
        }
        else
        {
            x.removeClass(this.SideBar, 'show');
            this.MenuOpen = false;
        }
    }

    MenuCloser()
    {
        x.removeClass(this.SideBar, 'show');
        this.MenuOpen = false;
    }
}