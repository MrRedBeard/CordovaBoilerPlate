/*
touchStartX: 0,
touchStartY: 0,
touchEndX: 0,
touchEndY: 0,
touchAction: '',
touchDirection: '',
distance: 0,
distanceHorz: 0,
distanceHorzAbs: 0,
distanceVert: 0,
distanceVertAbs: 0
*/

//Handle Touch Events per Element
class xtouchEvent
{
    constructor(element, originCtx)
    {
        this.originCtx = originCtx;
        this.element = element;

        this.debug = false;

        this.mouseValues =
            {
                isEvent: false,
                mouseStartX: 0,
                mouseStartY: 0
            };

        this.positionValues =
            {
                x: 0,
                y: 0,
                elx: 0,
                ely: 0
            };

        this.el = document.querySelector(element);

        this.touchValues =
            {
                touchStartX: 0,
                touchStartY: 0,
                touchEndX: 0,
                touchEndY: 0,
                touchAction: '',
                touchDirection: '',
                distance: 0,
                distanceHorz: 0,
                distanceHorzAbs: 0,
                distanceVert: 0,
                distanceVertAbs: 0,
                deviceWidth: (window.innerWidth > 0) ? window.innerWidth : screen.width,
                elWidth: this.el.innerWidth,
                swipeDistanceScreenPercentage: 0
            };

        this.el.addEventListener('touchstart', this.touchstart.bind(this), false);
        this.el.addEventListener('touchend', this.touchend.bind(this), false);
        this.el.addEventListener('touchmove', this.touchPosition.bind(this), false);

        this.el.addEventListener('mousemove', this.mouseMove.bind(this), false);

        this.onTouchEvent = function () { };
        this.onTouchPosition = function () { };
    }

    reset()
    {
        this.touchValues.touchStartX = 0;
        this.touchValues.touchStartY = 0;
        this.touchValues.touchEndX = 0;
        this.touchValues.touchEndY = 0;
        this.touchValues.touchAction = '';
        this.touchValues.touchDirection = '';
        this.touchValues.distance = 0;
        this.touchValues.distanceHorz = 0;
        this.touchValues.distanceHorzAbs = 0;
        this.touchValues.distanceVert = 0;
        this.touchValues.distanceVertAbs = 0;
        this.mouseValues.isEvent = false;
        this.mouseValues.mouseStartX = 0;
        this.mouseValues.mouseStartY = 0;
    }

    mouseMove(event)
    {
        if (event.which === 1 && !this.mouseValues.isEvent)
        {
            this.mouseValues.isEvent = true;
            this.mouseValues.mouseStartX = event.pageX;
            this.mouseValues.mouseStartY = event.pageY;
            //console.log('mouse start');
        }
        else if (event.which !== 1 && this.mouseValues.isEvent)
        {
            this.touchValues.touchStartX = this.mouseValues.mouseStartX;
            this.touchValues.touchStartY = this.mouseValues.mouseStartY;
            this.touchValues.touchEndX = event.pageX;
            this.touchValues.touchEndY = event.pageY;
            this.mouseValues.isEvent = false;
            //console.log('mouse end');
            this.handleTouch();
        }
    }

    touchstart(event)
    {
        if (!this.mouseValues.isEvent)
        {
            this.touchValues.touchStartX = event.changedTouches[0].screenX;
            this.touchValues.touchStartY = event.changedTouches[0].screenY;
            //console.log('touchstart');
        }
    }

    touchend(event)
    {
        this.touchValues.touchEndX = event.changedTouches[0].screenX;
        this.touchValues.touchEndY = event.changedTouches[0].screenY;
        //console.log('touchend');
        this.handleTouch();
    }

    touchPosition(event)
    {
        this.positionValues.x = event.changedTouches[0].pageX;
        this.positionValues.y = event.changedTouches[0].pageY;
        this.positionValues.elx = event.changedTouches[0].pageX - this.el.offsetLeft;
        this.positionValues.ely = event.changedTouches[0].pageY - this.offsetTop;
        this.onTouchPosition();
    }

    handleTouch()
    {
        this.touchValues.distanceHorz = this.touchValues.touchStartX - this.touchValues.touchEndX;
        this.touchValues.distanceVert = this.touchValues.touchStartY - this.touchValues.touchEndY;
        this.touchValues.distanceHorzAbs = Math.abs(this.touchValues.distanceHorz);
        this.touchValues.distanceVertAbs = Math.abs(this.touchValues.distanceVert);
        this.touchValues.swipeDistanceScreenPercentage = ((this.touchValues.distanceHorzAbs * 100) / this.touchValues.deviceWidth);

        if (this.debug)
        {
            document.querySelector('.touchVals').innerHTML = 'TouchStart: ' + this.originCtx.BodyTouch.touchValues.touchStartX + ' Device Width: ' + this.touchValues.deviceWidth + ' Swipe Distance: ' + this.touchValues.distanceHorzAbs + ' Distance Percentage: ' + this.touchValues.swipeDistanceScreenPercentage;
            console.log('startX: ' + this.touchValues.touchStartX + ' startY: ' + this.touchValues.touchStartY + ' endX: ' + this.touchValues.touchEndX + ' endY: ' + this.touchValues.touchEndY + ' Horz: ' + this.touchValues.distanceHorz + ' Vert: ' + this.touchValues.distanceVert + ' HorzAbs: ' + this.touchValues.distanceHorzAbs + ' VertAbs: ' + this.touchValues.distanceVertAbs);
        }

        if (this.touchValues.distanceHorzAbs > this.touchValues.distanceVertAbs && (this.touchValues.distanceHorzAbs + this.touchValues.distanceVertAbs) > 2 && this.touchValues.swipeDistanceScreenPercentage >= 14)
        {
            //horz swipe
            if (this.touchValues.distanceHorz < 0)
            {
                //right
                if (this.debug)
                {
                    console.log('right');
                }
                this.touchValues.touchAction = 'swipe';
                this.touchValues.touchDirection = 'right';
            }
            else
            {
                //left
                if (this.debug)
                {
                    console.log('left');
                }
                this.touchValues.touchAction = 'swipe';
                this.touchValues.touchDirection = 'left';
            }
        }
        else if (this.touchValues.distanceHorzAbs < this.touchValues.distanceVertAbs && (this.touchValues.distanceHorzAbs + this.touchValues.distanceVertAbs) > 2 && this.touchValues.swipeDistanceScreenPercentage >= 14)
        {
            //vert swipe
            if (this.touchValues.distanceVert < 0)
            {
                //down
                if (this.debug)
                {
                    console.log('down');
                }
                this.touchValues.touchAction = 'swipe';
                this.touchValues.touchDirection = 'down';
            }
            else
            {
                //up
                if (this.debug)
                {
                    console.log('up');
                }
                this.touchValues.touchAction = 'swipe';
                this.touchValues.touchDirection = 'up';
            }
        }
        else if (this.touchValues.swipeDistanceScreenPercentage <= 1)
        {
            //tap
            if (this.debug)
            {
                console.log('tap');
            }
            this.touchValues.touchAction = 'tap';
            this.touchValues.touchDirection = '';
            return null;
        }
        else
        {
            this.touchValues.touchAction = 'tap';
            this.touchValues.touchDirection = '';
            return null;
        }

        this.onTouchEvent();
    }

}