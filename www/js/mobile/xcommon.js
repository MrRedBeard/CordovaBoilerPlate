class xcommon
{
    constructor()
    {
        this.extensions();
    }

    ajax(options)
    {
        return new xAjax(options);
    }

    ready(fn)
    {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading")
        {
            fn();
        }
        else
        {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    //Returns dom object
    select(elementString)
    {
        return document.querySelector(elementString);
    }

    //Create dom element from string
    parseHTML(htmlString)
    {
        var parseHTML = function (str)
        {
            var tmp = document.implementation.createHTMLDocument();
            tmp.body.innerHTML = str;
            return tmp.body.children;
        };

        parseHTML(htmlString);
    }

    html(html)
    {
        var range = document.createRange();
        return range.createContextualFragment(html);
    }

    hasClass(el, className)
    {
        if (el.classList)
            el.classList.contains(className);
        else
            new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }

    addClass(el, className)
    {
        if (el.classList)
            el.classList.add(className);
        else
            el.className += ' ' + className;
    }

    removeClass(el, className)
    {
        if (el.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    toggleClass(el, className)
    {
        if (el.classList) 
        {
            el.classList.toggle(className);
        }
        else
        {
            var classes = el.className.split(' ');
            var existingIndex = classes.indexOf(className);

            if (existingIndex >= 0)
            {
                classes.splice(existingIndex, 1);
            }
            else
            {
                classes.push(className);
            }

            el.className = classes.join(' ');
        }
    }

    setFocus(el)
    {
        document.querySelector(el).focus();
    }

    position(el)
    {
        return { left: el.offsetLeft, top: el.offsetTop };
    }

    hide(el)
    {
        el.style.display = 'none';
    }

    show(el)
    {
        el.style.display = '';
    }

    scrollTop()
    {
        document.body.scrollTop = 0;
    }

    scrollBottom()
    {
        window.scrollTo(0,document.body.scrollHeight);
    }

    matchRuleShort(str, searchstr)
    {
        let found = 1;
        
        searchstr = searchstr.replace('.', '*').replace(',', '*').replace('%', '*').replace('**', '*');
        let arr = searchstr.split(' ');

        for (let i = 0; i < arr.length; i++)
        {
            let search = '*' + arr[i] + '*';

            if (!RegExp("^" + search.split("*").join(".*") + "$").test(str))
            {
                found--;
            }
        }

        if (found < 1)
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    aContainsB(a, b)
    { 
        return a.indexOf(b) >= 0; 
    }

    b64toBlob(b64Data, contentType = '', sliceSize = 512)
    {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize)
        {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++)
            {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    getBase64Image(img) 
    {
        let newImg = new Image();
        newImg.src = img;

        let canvas = document.createElement("canvas");
        canvas.width = newImg.width;
        canvas.height = newImg.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(newImg, 0, 0);

        let dataURL = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
        return dataURL;
    }

    extensions()
    {
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

        if (!Element.prototype.setFocus)
        {
            Element.prototype.setFocus = function ()
            {
                this.focus();
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
    }
}