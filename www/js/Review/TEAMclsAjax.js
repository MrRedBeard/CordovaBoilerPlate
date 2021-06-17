class clsAjax
{
    constructor(options, jwt)
    {
        const self = this;

        let requestCount = 1;

        const request = new XMLHttpRequest();

        if (!options)
        {
            throw 'Options must be defined. TEAMclsAjax.js';
        }

        this.options = options;

        if (!this.options.dataType || typeof this.options.dataType === 'undefined' || this.options.dataType === '')
        {
            this.options.dataType = 'json';
        }
        else if (this.options.dataType && this.options.dataType.toLowerCase() === 'blob')
        {
            this.options.dataType = 'blob';
            request.responseType = this.options.dataType;
        }

        if (typeof this.options.error === 'undefined' || !this.options.error)
        {
            this.options.error = function () { };
        }

        this.options.auth = false;

        request.onload = function ()
        {
            if (request.readyState === 4)
            {
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
                        if (this.options.dataType && this.options.dataType.toLowerCase() === 'html')
                        {
                            if (this.options.success)
                            {
                                this.options.success(request.responseText ? request.responseText : null, headers);
                            }
                        }
                        else if (this.options.dataType && this.options.dataType.toLowerCase() === 'blob')
                        {
                            if (this.options.success)
                            {
                                let blobRaw = request.response ? request.response : null;
                                let contentDispo = request.getResponseHeader('Content-Disposition');
                                let fileName = contentDispo.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1];

                                let extension = '';
                                if (fileName.split('.').length > 0)
                                {
                                    extension = fileName.split('.')[fileName.split('.').length - 1] + '';
                                    extension = extension.toLowerCase().replace('"', '').replace('"', '');
                                }

                                //https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types
                                let fileType = "";
                                switch (extension)
                                {
                                    case "pdf":
                                        fileType = 'application/pdf';
                                        break;
                                    case "gif":
                                    case "png":
                                        fileType = 'image/png';
                                        break;
                                    case "jpg":
                                    case "jpeg":
                                        fileType = 'image/jpeg';
                                        break;
                                    case "zip":
                                        fileType = 'application/zip';
                                        break;
                                    case "rtf":
                                        fileType = 'application/rtf';
                                        break;
                                    case "txt":
                                        fileType = 'text/plain;charset=utf-8';
                                        break;
                                    case "xml":
                                        //fileType = 'application/xml';
                                        fileType = 'text/xml';
                                        break;
                                    case "html":
                                    case "htm":
                                        fileType = 'text/html';
                                        break;
                                    default:
                                        fileType = 'application/octet/stream';
                                        break;
                                }

                                //let blob = new Blob([blobRaw], { type: fileType });
                                let blob = new File([blobRaw], fileName, { type: fileType, endings: 'transparent' });

                                switch (extension)
                                {
                                    case 'pdf':
                                    case "xml":
                                    case 'txt':
                                    case "gif":
                                    case "png":
                                    case "jpg":
                                    case "jpeg":
                                        let newWindow = window.open(URL.createObjectURL(blob));
                                        newWindow.onload = () =>
                                        {
                                            let newUrl = newWindow.window.location.href.split('/');
                                            newUrl = newUrl[0] + '/' + newUrl[1] + '/' + newUrl[2] + '/' + encodeURI(fileName.replace('"', '').replace('"', ''));

                                            newWindow.history.pushState({}, fileName, newUrl);
                                        };
                                        break;
                                    default:
                                        let newLink = document.createElement('a');
                                        newLink.href = URL.createObjectURL(blob);
                                        newLink.download = fileName;
                                        newLink.target = '_blank';
                                        newLink.dispatchEvent(new MouseEvent('click'));
                                }
                            }
                        }
                        else
                        {
                            if (this.options.success)
                            {
                                this.options.success(JSON.parse(request.responseText ? request.responseText : null), headers);
                            }
                        }
                        break;
                    case 401: //Unauthorized
                        if (typeof this.options.auth !== 'undefined' && this.options.auth)
                        {
                            jwt.requestToken();

                            if (requestCount !== 2)
                            {
                                T.ajax(this.options, jwt);

                                requestCount++;
                            }
                        }
                        break;
                    case 400:
                    case 404:
                    case 403: //Forbidden
                    case 500:
                        if (this.options.error)
                        {
                            var response = JSON.parse(request.response);
                            this.options.error(response);
                        }
                        break;
                    default:
                        break;
                }
            }
        }.bind(this);

        request.open(this.options.method, this.options.url, this.options.async || false);

        if (typeof this.options.contentType === 'undefined')
        {
            request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        }

        if (typeof this.options.auth !== 'undefined' && this.options.auth)
        {
            if (localStorage.getItem('token'))
            {
                request.setRequestHeader('Authorization', localStorage.getItem('token'));
            }
            else
            {
                jwt.requestToken();
            }

            this.sendRequest(request);
        }
        else
        {
            this.sendRequest(request);
        }
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

    //Not in use yet - Scritch
    saveOrOpenBlob(blob, fileName)
    {
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(window.TEMPORARY, 1024 * 1024, function (fs)
        {
            fs.root.getFile(fileName, { create: true }, function (fileEntry)
            {
                fileEntry.createWriter(function (fileWriter)
                {
                    fileWriter.addEventListener("writeend", function ()
                    {
                        window.location = fileEntry.toURL();
                    }, false);
                    fileWriter.write(blob, "_blank");
                }, function () { });
            }, function () { });
        }, function () { });
    }
}