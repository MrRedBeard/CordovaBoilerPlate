/*****************************************
    TEAM JavaScript Library
*****************************************/
// Set Focus
function setFocus(el)
{
    document.querySelector(el).focus();
}

// Select All Checkboxes
function SelectUnselectAllCheckboxes(el, isChecked) 
{
    var SA = document.getElementsByTagName('input');
    for (var i = 0; i < SA.length; i++) {
        if (SA[i].type === 'checkbox') {
            if (isChecked === true) {
                SA[i].checked = true;
            }
            else {
                SA[i].checked = false;
            }
        }
    }
}

// Get content for information modal

function InformationModalFunction() { }



// Get Select 2 list styled for search
var template = function (data) {
    if (data.loading) {
        return data.text;
    }
    var markup = '<div>' + data.name + '</div>';
    return markup;
};

// Get Select 2 list styled for filter
var template2 = function (data) {
    if (data.loading) {
        return data.text;
    }
    var markup = '<div>' + data.text + '</div>';
    return markup;
};

var contentTemplate = function (data) {
    if (data.loading) {
        return data.name;
    }
    var markup = '<p>' + data.name + '</p>' + '<p>' + data.description + '</p>' + '<p>' + data.html + '</p>';
    return markup;
};

// Get Select 2 list styled for staff
var staffTemplate = function (data) {
    if (data.loading) {
        return data.text;
    }
    var photo = data.photo === null ? '' : '<span><img style="float: left; padding-right: 5px; height: 40px; width: 40px;" src="' + data.photo + '"/></span>';
    var markup = '<div style="margin-bottom: 7px;">' + photo + data.name + '</div>  ';
    var email = data.email === null ? '' : data.email;
    markup += '<div style="font-size: 12px;">' + email + '</div>';
    return markup;
};

// Get Select2 list styled for person
var personTemplate = function (data) {
    if (data.loading) {
        return data.text;
    }
    var rank = !data.rank || data.rank === 'NULL' ? '' : data.rank + ', ';
    var state = !data.state || data.state === 'NULL' ? '' : ', ' + data.state;
    var markup = '<div>' + rank + data.name + state + '</div>  ';
    var email = data.email === null ? '' : data.email;
    markup += '<div style="font-size: 12px;">' + email + '</div>';
    return markup;
};

// select2 template to format the eventres list
function eventresTemplate(resData) {
    if (resData.loading) {
        return resData.text;
    }
    var startDate = convertDate(resData.EventStartDate, 'MM/DD/YYYY');
    var endDate = convertDate(resData.EventEndDate, 'MM/DD/YYYY');
    var markup = $('<div>' + resData.text + '-' + resData.CourseNumber + '-' + resData.ClassNumber + '<br />' + startDate + '-' + endDate + '</div>');
    return markup;
}

// select2 template to format the eventres list
function eventTemplate(eventData) {
    if (eventData.loading) {
        return eventData.text;
    }
    var startDate = convertDate(eventData.start, 'MM/DD/YYYY');
    var endDate = convertDate(eventData.end, 'MM/DD/YYYY');
    var markup = $('<div>' + eventData.name + '-' + eventData.classNum + '<br />' + startDate + '-' + endDate + '</div>');
    return markup;
}

// select2 template to format the service request list
//TODO: ServiceRequestDelete
function serviceRequestTemplate(srData)
{
    if (srData.loading)
    {
        return srData.text;
    }
    var submittedDate = srData.submittedDate;
    var notes = srData.text;
    var markup = $('<div>' + srData.id + ' : Submitted on ' + submittedDate + '<br />' + notes + '</div>');
    return markup;
}

// Get auto year selector    
function getAutoYearValues(el) 
{
    let autoYrSelector = document.querySelector(el + ' #auto_year_select');
    let min = 1927;
    let max = new Date().getFullYear();
    let options = "<option value=''></option>";
    for (let i = max; i >= min; i--) { options += "<option value=" + i + ">" + i + "</option>"; }

    autoYrSelector.innerHTML = '';
    autoYrSelector.innerHTML = options;
}

// Truncate decimal to 2 places 99.33333 becomes 99.33 and 99.9999 becomes 99.99
function truncateDecimal(numVal) 
{
    var rtnVal = numVal.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    return rtnVal;
}

function isBrowserIE()
{
    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    return isIE;
}

function BrowserDetection()
{
    // Opera 8.0+
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';

    // Safari 3.0+ "[object HTMLElementConstructor]" 
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;

    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;

    // Chrome 1+
    var isChrome = !!window.chrome && !!window.chrome.webstore;

    // Blink engine detection
    var isBlink = (isChrome || isOpera) && !!window.CSS;

    //if (isIE || isEdge)
    if (isIE)
    {
        //alert("<h4>Browser Warning</h4><p>IE is not recommended for use on this portal. Many current industry standards do not work in IE and break several features we've made available. Please use Chrome or FireFox for the best possible experience. See our <a href='/Compatibility'>Compatibility</a> page for more information. </p>");
        if (!sessionStorage.alreadyClicked && !window.alreadyClicked)
        {
            alert("IE is not recommended for use on this portal.Many current industry standards do not work in IE and break several features we've made available. Please use Chrome or FireFox for the best possible experience. See our Compatibility page for more information.");
            sessionStorage.alreadyClicked = 1;
        }
    }
    
}

function DoDWarningBanner()
{
    if (!sessionStorage.DoDBannerShown || sessionStorage.DoDBannerShown === 'false')
    {
        let DoDWarningModal = new clsModal(
            {
                containerElement: document.querySelector('.DoDWarningModal'),
                header: '',
                body: '',
                footer: '',
                hideCloseButtons: true,
                userCanExit: false,
                footerCloseButton: false,
                footerButtons: true
            });

        let hdr = document.createElement('h1');
        hdr.classList.add('text-center');
        hdr.innerHTML = 'DoD Warning Notice';
        DoDWarningModal.setHeader(hdr);

        let msg = document.createElement('div');
        msg.classList.add('text-center');
        msg.innerHTML = 'You are accessing a U.S. Government (USG) Information System (IS) that is provided for USG-authorized use only.' + '<BR /><BR />';
        msg.innerHTML += 'By using this IS(which includes any device attached to this IS), you consent to the following conditions:' + '<BR /><BR />';
        msg.innerHTML += '-The USG routinely intercepts and monitors communications on this IS for purposes including, but not limited to, penetration testing, COMSEC monitoring, network operations and defense, personnel misconduct(PM), law enforcement(LE), and counterintelligence(CI) investigations.' + '<BR /><BR />';
        msg.innerHTML += '- At any time, the USG may inspect and seize data stored on this IS.' + '<BR /><BR />';
        msg.innerHTML += '- Communications using, or data stored on, this IS are not private, are subject to routine monitoring, interception, and search, and may be disclosed or used for any USG - authorized purpose.' + '<BR /><BR />';
        msg.innerHTML += '- This IS includes security measures(e.g., authentication and access controls) to protect USG interests—not for your personal benefit or privacy.' + '<BR /><BR />';
        msg.innerHTML += '- Notwithstanding the above, using this IS does not constitute consent to PM, LE or CI investigative searching or monitoring of the content of privileged communications, or work product, related to personal representation or services by attorneys, psychotherapists, or clergy, and their assistants.Such communications and work product are private and confidential.See User Agreement for details.' + '<BR /><BR />';
        DoDWarningModal.setBody(msg);

        DoDWarningModal.FooterButtons.cancelButton.button.hideEl();
        DoDWarningModal.FooterButtons.resetButton.button.hideEl();
        DoDWarningModal.FooterButtons.openButton.button.hideEl();
        DoDWarningModal.FooterButtons.createButton.button.hideEl();
        DoDWarningModal.FooterButtons.deleteButton.button.hideEl();

        DoDWarningModal.FooterButtons.containerElement.classList.add('text-center');
        DoDWarningModal.FooterButtons.updateButton.button.removeClass('pull-right');
        DoDWarningModal.FooterButtons.updateButton.button.classList.add('text-center');
        DoDWarningModal.FooterButtons.updateButton.button.innerText = 'I Agree';
        DoDWarningModal.FooterButtons.handleUpdate = function ()
        {
            sessionStorage.DoDBannerShown = true;
            DoDWarningModal.close();
        };

        DoDWarningModal.open();
    }
}

function matchRuleShort(str, searchstr)
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


const b64toBlob = (b64Data, contentType = '', sliceSize = 512) =>
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
};

function aContainsB(a, b) { return a.indexOf(b) >= 0; }

function clearForm(form_obj)
{
    alert('in form object clear');
    Object.keys(form_obj).forEach(function (key)
    {
        if (!form_obj[key] || typeof form_obj[key].tagName === 'undefined')
        {
            return;
        }
        else if (form_obj[key].tagName === 'input')
        {
            if (form_obj[key].getAttribute('type') === 'text')
            {
                form_obj[key].value = '';
            }
            else if (form_obj[key].getAttribute('type') === 'checkbox')
            {
                form_obj[key].value = false;
                form_obj[key].checked = false;
            }
            else
            {
                form_obj[key].value = '';
            }
        }
        else if (form_obj[key].tagName === 'textarea')
        {
            form_obj[key].innerText = '';
        }
        else
        {
            form_obj[key].value = '';
        }
    });
}