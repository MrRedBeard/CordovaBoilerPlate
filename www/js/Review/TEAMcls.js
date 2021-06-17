/*

Shared Library

*/
class clsLibJS
{
    constructor(element)
    {
        this.documentReady = function () { };

        if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll))
        {
            this.documentReady();
        }
        else
        {
            document.addEventListener("DOMContentLoaded", this.documentReady);
        }

        this.jwt;

        let kioskMode = true;

        if (!kioskMode)
        {
            try
            {
                this.jwt = new clsWebToken();
            } catch (e)
            {
                console.log('No web token defaulting to kiosk mode unless token is established later.');
            }
        }
    }

    ajax(options)
    {
        return new clsAjax(options, this.jwt);
    }

    toggleClass(el)
    {
        el = document.querySelector(el);
        //el = document.querySelectorAll(el);

        if (el.classList)
        {
            el.classList.toggle(className);
        }
        else
        {
            var classes = el.className.split(' ');
            var existingIndex = classes.indexOf(className);

            if (existingIndex >= 0)
                classes.splice(existingIndex, 1);
            else
                classes.push(className);

            el.className = classes.join(' ');
        }
    }

    addClass(el, className)
    {
        try
        {
            let el = document.querySelectorAll(el);
        } catch (e)
        {
            return;
        }

        for (let i = 0; i < el.length; i++)
        {
            el[i].classList.add(className);
        }
    }

    removeClass(el, className)
    {
        try
        {
            let el = document.querySelectorAll(el);

            for (let i = 0; i < el.length; i++)
            {
                el[i].classList.remove(className);
            }
        } catch (e)
        {
            return;
        }

    }

    html(html)
    {
        var range = document.createRange();
        return range.createContextualFragment(html);
    }

    isIE()
    {
        //legacy IE
        let isIE = false;

        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
        {
            isIE = true;
        }
        else  // If another browser, return 0
        {
            isIE = false;
        }

        return isIE;
    }

    RequireRoleAdmin()
    {
        if (!T.jwt.token.Payload.Roles.includes('Admin'))
        {
            alert('You do not have permission to use this page.');
            window.location.href = '/';
        }
    }

    RequireRoleIAM()
    {
        if (!T.jwt.token.Payload.Roles.includes('IAM') && !T.jwt.token.Payload.Roles.includes('Admin'))
        {
            alert('You do not have permission to use this page.');
            window.location.href = '/';
        }
    }

    RequireRoleStaff()
    {
        if (!T.jwt.token.Payload.Roles.includes('Staff'))
        {
            alert('You do not have permission to use this page.');
            window.location.href = '/';
        }
    }

    RequireRoleATRRS()
    {
        if (!T.jwt.token.Payload.Roles.includes('PrivUser') && !T.jwt.token.Payload.Roles.includes('Admin'))
        {
            alert('You do not have permission to use this page.');
            window.location.href = '/';
        }
    }

    RequireRoleFrontDesk()
    {
        if (!T.jwt.token.Payload.Roles.includes('EventSignIn') && !T.jwt.token.Payload.Roles.includes('Admin'))
        {
            alert('You do not have permission to use this page.');
            window.location.href = '/';
        }
    }
}

const T = new clsLibJS();
Object.freeze(T);

