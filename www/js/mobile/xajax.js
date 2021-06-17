class xAjax
{
    constructor(options)
    {
        const request = new XMLHttpRequest();

        if (typeof options === 'undefined')
        {
            throw 'options must be defined';
        }

        this.options = options;

        if (typeof this.options.url === 'undefined')
        {
            throw 'ajax options.url must be defined';
        }

        if (!this.options.dataType || typeof this.options.dataType === 'undefined' || this.options.dataType === '')
        {
            this.options.dataType = 'json';
        }
        else if(this.options.dataType && this.options.dataType.toLowerCase() === 'blob')
        {
            this.options.dataType = 'blob';
            request.responseType = this.options.dataType;
        }
        else if(this.options.dataType && this.options.dataType.toLowerCase() === 'html')
        {
            this.options.dataType = 'html';
            request.responseType = this.options.dataType;
        }

        if (!this.options.contentType || typeof this.options.contentType === 'undefined' || this.options.contentType === '')
        {
            //this.options.contentType = 'json';
        }

        if (!this.options.async || typeof this.options.async === 'undefined' || this.options.async === '')
        {
            this.options.async = false;
        }

        if (!this.options.method || typeof this.options.method === 'undefined' || this.options.method === '')
        {
            this.options.method = 'GET';
        }

        this.options.success = options.success || function () { };
        this.options.error = options.error || function () { };

        this.options.auth = false;

        request.onload = function ()
        {
            if (request.readyState === 4)
            {
                //console.log(request.getResponseHeader('content-type'));

                var headers = {};

                var arr = request.getAllResponseHeaders().trim().split(/[r\n]+/);

                arr.forEach(function (line)
                {
                    var parts = line.split(': ');
                    var header = parts.shift();
                    var value = parts.join(': ');
                    headers[header] = value;
                });

                switch (request.status)
                {
                    case 200:
                    case 201:
                    case 204:
                        this.options.success(request.response);
                        break;
                    case 401: 
                        //Unauthorized
                        break;
                    case 400:
                    case 404:
                    case 403: 
                        //Forbidden
                    case 500:
                        if (this.options.error)
                        {
                            //this.options.error(request.statusText);
                            if(this.options.dataType === 'json')
                            {
                                let response = JSON.parse(request.response);
                                this.options.error(response);
                            }
                            else
                            {
                                this.options.error();
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        }.bind(this);

        request.onerror = function ()
        {
            this.options.error();
        }.bind(this);

        //request.responseType = "document";

        //request.open('GET', this.options.url, false);
        request.open(this.options.method, this.options.url, this.options.async);

        if(this.options.contentType == 'JSON')
        {
            request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        }

        //request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        //request.setRequestHeader('Content-Type', 'text/html; charset=iso-8859-1');
        //switch (this.options.contentType.toUpperCase())
        //{
        //    case 'JSON':
        //        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        //        break;
        //    default:
        //}


        this.sendRequest(request);
    }

    sendRequest(request)
    {
        switch (this.options.method.toUpperCase())
        {
            case 'GET':
                request.send();
                break;
            case 'POST':
                if (this.options.data instanceof FormData)
                {
                    request.send(this.options.data);
                }
                else
                {
                    var blob = new Blob([JSON.stringify(this.options.data)], { type: 'application/json' });

                    request.send(blob);
                }
                break;
            default:
                break;
        }
    }
}