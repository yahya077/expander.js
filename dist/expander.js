/**
 * Expander JavaScript Plugin.
 * @version 1.0.0
 * @author Yahya Hindioglu <business@yahyahindioglu.com>
 * @license The MIT License (MIT)
 */

const Expander = (_ => {
    // ---------------------------------
    // # Define Constants
    // ---------------------------------
    //

    const MAIN_KEY = '.cs-expander';
    const VERSION = '1.0.0';

    const DEFAULTS = {
        /**
         * Number of items initially shown
         * @type {Number}
         *
         */
        show: 4,
        /**
         * Number of items to add per click
         * @type {Number}
         *
         */
        increase: 3,
        /**
         * Number of items to remove per click,
         * if it is zero it will use increase variable
         * @type {Number}
         *
         */
        decrease: 0,
        /**
         * Append a toggle btn,
         * @type {Boolean}
         *
         */
        toggle: false,
        /**
         * Activates reset btn
         * @type {Boolean}
         *
         */
        resetable: false,
        /**
         * Removes increase and decrease buttons if toggle true
         * @type {Boolean}
         *
         */
        unary: false,
        /**
         * Button container for increasing items
         * @type {String}
         *
         */
        increaseBtn: '.cs-expander-increase-btn',
        /**
         * Increase button text
         * @type {String}
         *
         */
        increaseBtnValue: 'Increase Items',
        /**
         * Button container for toggling
         * @type {String}
         *
         */
        toggleBtn: '.cs-expander-toggle-btn',
        /**
         * Toggle button text
         * @type {String}
         *
         */
        toggleBtnValue: 'Toggle Items',
        /**
         * Button container for decreasing items
         * @type {String}
         *
         */
        decreaseBtn: '.cs-expander-decrease-btn',
        /**
         * Decrease button text
         * @type {String}
         *
         */
        decreaseBtnValue: 'Decrease Items',
        /**
         * Button container for collapsing all items
         * @type {String}
         *
         */
        resetBtn: '.cs-expander-reset-btn',
        /**
         * Reset button text
         * @type {String}
         *
         */
        resetBtnValue: 'Collapse',
        /**
         * Animation Duration
         * @type {Number}
         *
         */
        animationDuration: 1,
    }

    // ---------------------------------
    // # Class Definition
    // ---------------------------------
    //
    /**
     * Expander Class.
     * @public
     */
    class Expander {

        /**
         * Expander Constructor.
         * @constructor
         * @param {HTMLElement|String} expander - The expander element or expander selector.
         * @param {Object} options - The options of expander.
         */
        constructor(expander, options = {}) {
            this._uniqCode = Expander.counter;
            this.options = Expander.inject(DEFAULTS, options);
            this.expander = ('string' === typeof expander) ? document.querySelector(expander) : expander;
            // Init for first time
            this.initialize();
        }

        /**
         * Initialization
         * @private
         */
        initialize() {
            //initialize vars
            Expander.createUniqID(this);
            //set default decrease value
            this.setDecrease();
            // initializing buttons
            this.collapse();
            //create buttons to work
            Expander.createOrInitializeButton(this)
        }

        /**
         * Collapse all items by show value
         * @public
         */
        collapse() {
            this.moving = false;
            this.lastIndex = 0;
            Array.from(this.expander.children).forEach((ctx, i) => {
                if (i >= this.options.show) {
                    ctx.classList.add('hidden')
                } else {
                    if (i !== 0) {
                        this.lastIndex++
                        new Animate(ctx, i, this.lastIndex, {delay: this.options.animationDuration}).animate()
                    }
                }
            })
        }

        /**
         * Creates a unique value to avoid conflicts
         * when there are multiple implementations
         * @static
         */
        static createUniqID(expander) {
            if (!expander.expander.parentElement.classList.contains('cs-expander-init')) {
                expander.id = '#cs-ew-' + expander._uniqCode;
                expander.expander.parentElement.id = 'cs-ew-' + expander._uniqCode;
                expander.expander.parentElement.classList.add('cs-expander-init')
            }
        }

        /**
         * Set decrease value same as increment value
         * if it's using default value
         * @public
         */
        setDecrease() {
            if (!this.options.decrease) this.options.decrease = this.options.increase
        }

        /**
         * Toggle items from wrapper
         * @public
         */
        toggleItem(e) {
            if (!this.moving) {
                this.moving = true
                if (e.target.classList.contains('cs-ew-increase')) {
                    this.increaseItem()
                } else if(e.target.classList.contains('cs-ew-decrease')) {
                    this.decreaseItem()
                }else {
                    if (this.lastIndex > (this.options.show - 1)) {
                        this.lastIndex = 3;
                        this.decreaseItem(this.expander.children.length)
                    }else {
                        this.increaseItem(this.expander.children.length-1);
                        this.lastIndex = this.expander.children.length;
                    }
                }
                setTimeout(function () {
                    this.moving = false
                }.bind(this), this.options.animationDuration * 1000)
            }
        }

        /**
         * Increase items from wrapper
         * @public
         */
        increaseItem(increase = this.options.increase) {
            Array.from(this.expander.children).forEach((ctx, i) => {
                if (i > this.lastIndex && i <= (this.lastIndex + increase)) {
                    ctx.classList.remove('hidden');
                    new Animate(ctx, i, this.lastIndex, {
                        delay: this.options.animationDuration,
                        align: 'end'
                    }).animate()
                }
            })
            this.setIndexesByDirection(true)
        }

        /**
         * Decrease items from wrapper
         * @public
         */
        decreaseItem(decrease = this.options.decrease) {
            this.setIndexesByDirection(false)
            Array.from(this.expander.children).forEach((ctx, i) => {
                if (i > (this.options.show - 1) && i > this.lastIndex && i <= (this.lastIndex + decrease)) {
                    new Animate(ctx, i, this.lastIndex, {
                        delay: this.options.animationDuration, align: 'end', reverse: true, event: function () {
                            ctx.classList.add('hidden')
                        }
                    }).animate()
                }
            })
        }

        /**
         * Updating indexes
         * @function
         */
        setIndexesByDirection = increase => {
            if (increase) {
                if (this.lastIndex < this.expander.children.length)
                    this.lastIndex += this.options.increase
            } else {
                if ((this.options.show - 1) <= this.lastIndex - this.options.decrease)
                    this.lastIndex -= this.options.decrease
            }
        }

        /**
         * Getting which item is shown
         * @function
         * @return {Array}
         */
        getActiveItems = items => {
            return Array.from(items).filter(item => !item.classList.contains('hidden'))
        }

        /**
         * Getting which item is disable
         * @function
         * @return {Array}
         */
        getHiddenItems = items => {
            return Array.from(items).filter(item => item.classList.contains('hidden'))
        }

        /**
         * Inject options object with defaults.
         * @function
         * @static
         */
        static inject(defaults, options) {
            let results = {};
            for (let key in defaults) {
                if ('undefined' !== typeof options[key]) results[key] = options[key];
                else results[key] = defaults[key];
            }
            return results;
        }

        /**
         * Setting button keys of created object
         * @return {Array}
         */
        static setBtnKeys(expander){
            let keys = ['toggle','increase', 'decrease', 'reset'];
            if (!expander.options.resetable) keys.pop()
            if (!expander.options.toggle) keys.shift()
            if (expander.options.unary && expander.options.toggle) keys.splice(1,2)
            return keys;
        }

        /**
         * Creates buttons and initialize them
         * @static
         * @return {Expander}
         */
        static createOrInitializeButton(expander) {
            let btn;
            let callback = expander.toggleItem.bind(expander);
            Expander.setBtnKeys(expander).forEach(key => {
                if (Expander.defaults[`${key}Btn`] !== expander.options[`${key}Btn`]) {
                    btn = document.querySelector(expander.options[`${key}Btn`])
                } else {
                    btn = document.createElement('button');
                    btn.innerHTML = Expander.defaults[`${key}BtnValue`]
                    btn.classList.add(`cs-expander-${key}-btn`)
                    document.querySelector(expander.id + MAIN_KEY).prepend(btn)
                }
                switch (key) {
                    case 'increase':
                        btn.classList.add('cs-ew-increase')
                        break;
                    case 'decrease':
                        btn.classList.add('cs-ew-decrease')
                        btn.addEventListener('click', expander.toggleItem.bind(expander))
                        break;
                    case 'reset':
                        btn.classList.add('cs-ew-reset')
                        callback = expander.collapse.bind(expander)
                        break;
                }
                btn.addEventListener('click', callback)
            })
        }

        /**
         * Gets default values of configuration options.
         * @static
         * @return {Object}
         */
        static get defaults() {
            return DEFAULTS;
        }

        /**
         * Gets how many times the class was created
         * @static
         * @return {Object}
         */
        static get counter() {
            Expander._counter = (Expander._counter || 0) + 1;
            return Expander._counter;
        }
    }

    /**
     * Animate Class.
     * @public
     */
    class Animate {
        DEFAULTS = {
            /**
             * Starting point of the animation
             * Values 'base' || 'end'
             * Default 'base'
             * @type {String}
             *
             */
            align: 'base',
            /**
             * Movement of animation in y-axis
             * To the bottom : true
             * To the top : false
             * Default true
             * @type {Boolean}
             *
             */
            reverse: false,
            /**
             * Triggering an event after animation finished
             * Default null
             * @type {Function}
             *
             */
            event: _ => {
            },
            /**
             * Specifies on which side of the y-axis
             * the animation on the items will start.
             * Values 'top' || 'bottom'
             * Default 'top'
             * @type {String}
             *
             */
            y: 'top',
            /**
             * Specifies on which side of the y-axis
             * the animation on the items will start.
             * Values 'left' || 'right'
             * Default 'right'
             * @type {String}
             *
             */
            x: 'left',
            /**
             * Animation duration
             * Default 0.3
             * Max 1
             * @type {Number}
             *
             */
            delay: 0.3,
        }

        constructor(item, index, lastIndex, options = {}) {
            this.item = item;
            this.index = index;
            this.lastIndex = lastIndex;
            this.options = Animate.inject(this.DEFAULTS, options);
            this.initialize()
        }

        /**
         * Initialization
         */
        initialize() {
            this.pos = 5;
            this.animId = 1;
            this.itemOuterWidth = this.item.parentElement.children[0].offsetWidth;
            this.wrapperWidth = this.item.parentElement.offsetWidth;
            this.flexCount = (this.wrapperWidth / this.itemOuterWidth);
            this.heightRange = Math.ceil(this.index / this.flexCount) - 1;
            this.itemOuterHeight = this.item.parentElement.children[0].offsetHeight;
            this.lastElement = this.item.parentElement.children[this.lastIndex];
            if (this.index % this.flexCount === 0) {
                this.heightRange++
                this.index = 0;
            }

            if (this.index - this.flexCount > 0 && this.index % this.flexCount !== 0) {
                this.index -= (this.flexCount * this.heightRange)
            }
            this.item.style.transition = `all ${this.options.delay}s ease`;
            if (this.options.reverse) {
                this.item.style.position = 'absolute';
                this.item.style[this.options.y] = (this.itemOuterHeight * this.heightRange) + 'px';
                this.item.style[this.options.x] = (this.itemOuterWidth * this.index) + 'px';
            } else {
                switch (this.options.align) {
                    case 'base':
                        this.item.style.position = 'absolute';
                        this.item.style[this.options.y] = '0';
                        this.item.style[this.options.x] = '0';
                        break;
                    case 'end':
                        this.item.style.position = 'absolute';
                        this.item.style[this.options.y] = this.item.parentElement.children[this.lastIndex].offsetTop + 'px';
                        this.item.style[this.options.x] = this.item.parentElement.children[this.lastIndex].offsetLeft + 'px';
                        break;
                }
            }
        }

        /**
         * Clears styles that animation function added
         * @function
         */
        clearAnimStyle(id) {
            setTimeout(function () {
                this.item.removeAttribute('style')
                this.options.event()
            }.bind(this), this.options.delay * 1000)
            clearInterval(id);
        }

        /**
         * Setting animations to items
         * @function
         */
        setAnimation() {
            this.pos--
            this.item.style[this.options.y] = this.options.reverse ? (this.lastElement.offsetTop / this.pos) + 'px' : (this.itemOuterHeight / this.pos) * this.heightRange + 'px'
            this.item.style[this.options.x] = this.options.reverse ? (this.lastElement.offsetLeft / this.pos) + 'px' : (this.itemOuterWidth / this.pos) * this.index + 'px'
            if (this.pos === 1) {
                this.clearAnimStyle(this.animId)
            }
        }

        /**
         * Starts animation
         * @function
         */
        animate() {
            this.animId = setInterval(this.setAnimation.bind(this), 20)
        }

        /**
         * Inject options object with defaults.
         * @function
         * @static
         */
        static inject(defaults, options) {
            let results = {};
            for (let key in defaults) {
                if ('undefined' !== typeof options[key]) results[key] = options[key];
                else results[key] = defaults[key];
            }
            return results;
        }
    }

    return Expander;
})();

module.exports = Expander;