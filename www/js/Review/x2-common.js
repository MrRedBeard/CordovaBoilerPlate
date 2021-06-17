
class x2timer
{
    /*
        var t = new timer();

        t.onLapse = function ()
        {
            document.querySelector('.app .timer').innerHTML = 'timeLapsed: ' + t.timeLapsed;
        };

        document.querySelector('.app .startTimer').onclick = function () { t.start() };
        document.querySelector('.app .stopTimer').onclick = function () { t.stop() };
    */
    constructor()
    {
        this.timeLapsed;
        this.onLapse = function () { };
        
        this.startTime = null;
        this.endTime = null;

        this.poll = function () { };
    }

    reset()
    {
        this.poll = null;
        this.startTime = null;
        this.endTime = null;
    }

    start()
    {
        this.startTime = new Date(Date.now()); 

        this.poll = setInterval(function ()
        {
            this.timeLapsed = this.msDiff(this.startTime, Date.now());
            this.onLapse();
        }.bind(this), 150);
    }

    getTime()
    {
        this.timeLapsed = this.msDiff(this.startTime, Date.now());
        return this.timeLapsed;
    }

    stop()
    {
        this.timeLapsed = this.msDiff(this.startTime, Date.now());
        this.onLapse();
        clearInterval(this.poll);
        this.reset();
    }

    //var /*Date*/ date1, var /*Date*/ date2
    msDiff(startDate, endDate) 
    {

        startDate = new Date(startDate);
        endDate = new Date(endDate);

        return endDate.getTime() - startDate.getTime();
    }
}

