//ONLOAD EVENT
document.addEventListener('DOMContentLoaded', function (event)
{
    //Navigation
    //Direct links to specific tabs of a workspace
    var loc = '#' + document.location.href.split('#')[1];

    loc = loc.split('?')[0];

    if (loc !== null && loc !== '#undefined')
    {
        //var element = 'a[href="' + loc + '"]';
        var element = document.querySelectorAll("a[href='" + loc + "']")[0];
        if (element)
        {
            element.click();
        }
        scrollToTopOfPage();
    }

    // Adds #tab to end of URL
    //Tab toggle
    let tabClickSelector = document.querySelectorAll("a[data-toggle='tab']");

    for (var i = 0; i < tabClickSelector.length; i++)
    {
        tabClickSelector[i].addEventListener('click', function ()
        {
            var vars = [], hash;
            var hashes = this.href.slice(this.href.indexOf('?') + 1).split('&');

            if (hashes.length > 0) {
                hash = '#' + hashes[0].split('#')[1];
            }

            var tmpUrl = document.location.href.split('#')[0];



            //if (!tmpUrl.endsWith("/"))
            if (tmpUrl.slice(-1) !== "/") {
                tmpUrl = tmpUrl + '/';
            }
            //document.location.href = CurrentWorkSpace() + '#' + CurrentTab();
            window.history.pushState({}, {}, tmpUrl + hash);
            scrollToTopOfPage();
        });
    }


    //Sidebar
    if (CurrentWorkSpace() !== '/')
    {
        try
        {
            let roles = T.jwt.token.Payload.Roles.split(',');

            if (roles.indexOf('Staff') > -1)
            {
                document.getElementsByTagName('body')[0].classList.add('sidebar-collapse');
            }
        } catch (e)
        {
            //Do nothing
        }
    }
    else
    {
        //$("body").removeClass("sidebar-collapse");
        document.getElementsByTagName('body')[0].classList.remove('sidebar-collapse');
    }

    //Prevent Loading Screen when clicking link to current workspace
    setTimeout(function ()
    {
        var alllinks = document.getElementsByTagName('a');
        for (var ii = 0; ii < alllinks.length; ii++)
        {
            alllinks[ii].addEventListener('click', function (e)
            {
                //*** Start *** Find parent that contains the URL and record the click
                let url = e.srcElement.href;
                let ictr = 0;
                let xNode;
                while (ictr < 5)
                {
                    if (!url || url === null || typeof url === 'undefined')
                    {
                        if (ictr === 0)
                        {
                            xNode = e.target;
                        }
                        xNode = xNode.parentNode;
                        url = xNode.href || xNode.pathname;
                    }
                    else
                    {
                        break;
                    }
                    ictr++;
                }
                if (url !== null && typeof url !== 'undefined')
                {
                    CreateCMSClick(url);
                }
                //*** End *** Find parent that contains the URL and record the click

                //Statistics Menu Click Counter
                if (this.hasAttribute('MenuItem'))
                {
                    let menuItemID = this.getAttribute('MenuItem');

                    UpdateMenuItemCounter(menuItemID);
                }

                var curWS = CurrentWorkSpace().replace(/\//g, '');
                //var clkWS = $(this).attr('href').replace(/\//g, '').split('#')[0];
                var clkWS = this + ' ';
                clkWS = clkWS.split('#')[0].split('/')[3]; //.replace(/\//g, ''); 

                if (curWS === clkWS)
                {
                    //var element = document.querySelector('a[href="#' + $(this).attr('href').split('#')[1] + '"]');
                    //var element = 'a[href="#' + $(this).attr('href').split('#')[1] + '"]';
                    var element = document.querySelector('a[href="#' + curWS + '"]');

                    if (element !== null && element !== '#undefined')
                    {
                        element.click();
                        //$(element).click();
                    }

                    scrollToTopOfPage();

                    setTimeout(function ()
                    {
                    }, 500);

                    return null;
                }
            });
        }
    }, 500);
    
});

function CurrentTab()
{
    var loc = '#' + document.location.href.split('#')[1];

    loc = loc.split('?')[0];

    return loc;
}

function getUrlParameter(name)
{
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function GetQueryStrings()
{
    let querystrings = CurrentQueryStrings();
    let querystringObject = [];
    for (var i = 0; i < querystrings.length; i++)
    {
        querystringObject[querystrings[i].split('=')[0]] = querystrings[i].split('=')[1];
    }
    return querystringObject;
}

function CurrentQueryStrings()
{

    var loc = document.location.href;

    if (loc.split('?')[1] && loc.split('?')[1] !== 'undefined' && loc.split('?').length > 0)
    {
        loc = loc.split('?')[1];
    }

    if (loc.split('&')[1] && loc.split('&')[1] !== 'undefined' && loc.split('&').length > 0)
    {
        loc = loc.split('&');
    }

    return loc;
}

function CurrentWorkSpace()
{
    var url = document.location.pathname;

    return url;
}

function UpdateMenuItemCounter(MenuItemID)
{
    //MenuItem='" + result[i].MenuItemID + "'

    if (!MenuItemID)
    {
        return;
    }

    T.ajax
        ({
            auth: true,
            url: '/ContentMgmt/UpdateMenuItemCounter',
            method: 'POST',
            data:
            {
                MenuItemID: MenuItemID
            },
            success: function (result) { },
            error: function (result) { }
        });
}

//Track URL usage
function CreateCMSClick(url)
{
    let CMSClicksObj = new clsCMSClicks();

    CMSClicksObj.URL = url;

    if (!T.jwt.validateToken(T.jwt.token))
    {
        return;
    }

    T.ajax
        ({
            auth: true,
            url: '/ContentMgmt/CreateCMSClick',
            method: 'POST',
            data:
            {
                CMSClicksObj: CMSClicksObj
            },
            success: function (result) { },
            error: function (result) { }
        });
}

