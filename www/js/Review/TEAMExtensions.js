if (!Element.prototype.matches)
{
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.remove)
{
    Element.prototype.remove = function ()
    {
        if (this.parentNode)
        {
            this.parentNode.removeChild(this);
        }
    };
}

if (!Element.prototype.closest)
{
    Element.prototype.closest = function (s)
    {
        var el = this;

        do
        {
            if (Element.prototype.matches.call(el, s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

HTMLTableCellElement.prototype.setHeaderAndFooter = function (value)
{
    var headerText = this.querySelector('.dt-header-text');

    if (headerText)
    {
        const html = headerText.innerHTML;

        const table = this.parentElement.parentElement.parentElement;

        for (var i = 0; i < table.querySelectorAll('.dt-header-text').length; i++)
        {
            var k = table.querySelectorAll('.dt-header-text')[i];

            if (k.innerHTML === html)
            {
                if (!k.value === '' || value === '')
                {
                    if (k.parentElement.querySelector('.dt-header-icon'))
                    {
                        k.parentElement.querySelector('.dt-header-icon').style.display = 'none';
                    }
                }

                k.innerHTML = value;
            }
        }

        for (var i = 0; i < table.querySelectorAll('.dt-footer-text').length; i++)
        {
            var k = table.querySelectorAll('.dt-footer-text')[i];

            if (k.innerHTML === html)
            {
                if (!k.value === '' || value === '')
                {
                    if (k.parentElement.querySelector('.dt-footer-icon'))
                    {
                        k.parentElement.querySelector('.dt-footer-icon').style.display = 'none';
                    }
                }

                k.innerHTML = value;
            }
        }
    }

};

HTMLTableCellElement.prototype.getHeaderText = function ()
{
    if (this.querySelector('.dt-header-text'))
    {
        return this.querySelector('.dt-header-text').innerHTML;
    }
};

HTMLElement.prototype.disableEl = function ()
{
    this.setAttribute('disabled', 'true');
};

HTMLElement.prototype.enableEl = function ()
{
    this.removeAttribute('disabled');
};

HTMLElement.prototype.readOnlyEl = function (val)
{
    if (val)
    {
        this.setAttribute('readOnly', 'true');
    }
    else
    {
        this.removeAttribute('readOnly');
    }
};



HTMLElement.prototype.hideEl = function ()
{
    this.style.display = 'none';
};

HTMLElement.prototype.showEl = function ()
{
    this.style.display = 'block';
};

HTMLElement.prototype.addClass = function (className)
{
    try
    {
        this.classList.add(className);
    } catch (e)
    {
        return;
    }
};

HTMLElement.prototype.removeClass = function (className)
{
    try
    {
        this.classList.remove(className);
    } catch (e)
    {
        return;
    }
};

//HTMLElement.prototype.addClass = function (className)
//{
//    if (className.indexOf(',') > -1)
//    {
//        let classes = className.split(',');

//        for (var i = 0; i < classes.length; i++)
//        {
//            this.addClass(classes[i]);
//        }
//    }
//    else
//    {
//        this.addClass(className);
//    }
//};

if (!Array.prototype.findIndex)
{
    Object.defineProperty(Array.prototype, 'findIndex',
        {
        value: function (predicate)
        {
            // 1. Let O be ? ToObject(this value).
            if (this === null)
            {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function')
            {
                throw new TypeError('predicate must be a function');
            }

            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];

            // 5. Let k be 0.
            var k = 0;

            // 6. Repeat, while k < len
            while (k < len)
            {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return k.
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o))
                {
                    return k;
                }
                // e. Increase k by 1.
                k++;
            }

            // 7. Return -1.
            return -1;
        },
        configurable: true,
        writable: true
    });
}

//SAMPLE CODE

if (!String.prototype.includes) 
{
    String.prototype.includes = function (search, start)
    {
        if (search instanceof RegExp)
        {
            throw TypeError('first argument must not be a RegExp');
        }
        if (start === undefined) { start = 0; }
        return this.indexOf(search, start) !== -1;
    };
}

if (window.NodeList && !NodeList.prototype.forEach)
{
    NodeList.prototype.forEach = function (callback, thisArg)
    {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++)
        {
            callback.call(thisArg, this[i], i, this);
        }
    };
}