
function scrollX() {
	return window.scrollX || document.documentElement.scrollLeft; 
}

function scrollY() {
	return window.scrollY || document.documentElement.scrollTop;
}

function getOffset(el: HTMLElement) {
	const offset = el.getBoundingClientRect();
	return { top : offset.top + scrollY(), left : offset.left + scrollX() };
}


function getViewportW() {
	const client = document.documentElement['clientWidth'],
		inner = window['innerWidth'];
	
	if( client < inner )
		return inner;
	else
		return client;
}

function getViewportH() {
	const client = document.documentElement['clientHeight'],
		inner = window['innerHeight'];
	
	if( client < inner )
		return inner;
	else
		return client;
}



type objectType = {[key:string]: any};



export class Grid3D {
	
	private el:HTMLElement;
    public options:objectType = {};
    private gridWrap:HTMLElement|null=null;
    private grid:HTMLElement|null=null;
    private gridItems:HTMLElement[]=[];
    private itemSize:objectType = {};
    private contentEl:HTMLElement|null=null;
    private contentItems:HTMLElement[]=[];
    private close:HTMLElement|null=null;
    private loader:HTMLElement|null=null;
    private support:boolean = false;
    private isAnimating:boolean = false;
    private scrollPosition:objectType|null=null;
    private resizeTimeout:number|null=null;
    private resizeFn:Function|null=null;
    private resizeDelay:number = 100;
    private placeholder:HTMLElement|null=null;
    private didScroll:boolean = false;

	
	constructor ( el:HTMLElement, options:objectType ) {
		this.el = el;

		this.options = {...this.options, options};
  		// extend( this.options, options );
  		this._init();
	}

	

	_init() {
		// grid wrapper
		this.gridWrap = this.el.querySelector( 'div.grid-wrap1732916007947' );
		// grid element
		this.grid = this.gridWrap?.querySelector( 'div.grid1732916007947' ) as HTMLElement;
		// main grid items
		this.gridItems = [].slice.call( this.grid.children );
		// default sizes for grid items
		this.itemSize = { width : this.gridItems[0].offsetWidth, height : this.gridItems[0].offsetHeight };
		// content
		// Sélectionne l'élément avec vérification de nullité
this.contentEl = this.el.querySelector('.content1732916007947') as HTMLElement ;

// Si l'élément existe, transforme ses enfants en tableau, sinon initialise avec un tableau vide
this.contentItems =  Array.from(this.contentEl.children) as HTMLElement[];

		// close content cross
		this.close = this.contentEl?.querySelector( 'span.close-content1732916007947' ) as HTMLElement;
		// loading indicator
		this.loader = this.contentEl?.querySelector( 'span.loading1732916007947' ) as HTMLElement;
		// support: support for pointer events, transitions and 3d transforms
		this.support = true;
		// init events
		this._initEvents();
	};

	_initEvents() {
		const self = this;
		
		// open the content element when clicking on the main grid items
		this.gridItems.forEach( function( item, idx ) {
			item.addEventListener( 'click', function() {
				self._showContent( idx );
			} );
		} );

		// close the content element
		this?.close?.addEventListener( 'click', function() {
			self._hideContent();
		} );

		if( this.support ) {
			// window resize
			window.addEventListener( 'resize', function() { self._resizeHandler(); } );

			// trick to prevent scrolling when animation is running (opening only)
			// this prevents that the back of the placeholder does not stay positioned in a wrong way
			window.addEventListener( 'scroll', function() {
				if ( self.isAnimating ) {
					window.scrollTo( self.scrollPosition ? self.scrollPosition.x : 0, self.scrollPosition ? self.scrollPosition.y : 0 );
				}
				else {
					self.scrollPosition = { x : window.pageXOffset || this.document.documentElement.scrollLeft, y : window.scrollY || this.document.documentElement.scrollTop };
					// change the grid perspective origin as we scroll the page
					self._scrollHandler();
				}
			});
		}
	};

	// creates placeholder and animates it to fullscreen
	// in the end of the animation the content is shown
	// a loading indicator will appear for 1 second to simulate a loading period
	_showContent( pos:number ) {
		if( this.isAnimating ) {
			return false;
		}
		this.isAnimating = true;

		const self = this,
			loadContent = function() {
				// simulating loading...
				setTimeout( function() {
					// hide loader
					self.loader?.classList?.remove('show1732916007947' );
					// in the end of the transition set class "show" to respective content item
					self.contentItems[ pos ].classList.add( 'show1732916007947' );
				}, 1000 );
				// show content area
				self.contentEl?.classList?.add( 'show1732916007947' );
				// show loader
				self.loader?.classList?.add( 'show1732916007947' );
				document.body.classList.add('noscroll' );
				self.isAnimating = false;
			};

		// if no support just load the content (simple fallback - no animation at all)
		if( !this.support ) {
			loadContent();
			return false;
		}

		const currentItem = this.gridItems[ pos ],
			itemContent = currentItem.innerHTML;
		
		// create the placeholder
		this.placeholder = this._createPlaceholder(itemContent );
		
		// set the top and left of the placeholder to the top and left of the clicked grid item (relative to the grid)
		this.placeholder.style.left = currentItem.offsetLeft + 'px';
		this.placeholder.style.top = currentItem.offsetTop + 'px';
		
		// append placeholder to the grid
		this.grid?.appendChild( this.placeholder );

		// and animate it
		const animFn = function() {
			// give class "active" to current grid item (hides it)
			currentItem.classList.add(  'active' );
			// add class "view-full" to the grid-wrap
			self.gridWrap?.classList?.add('view-full1732916007947' );
			// set width/height/left/top of placeholder
			self._resizePlaceholder();
			const onEndTransitionFn = function( ev:TransitionEvent ) {
				if( ev.propertyName.indexOf( 'transform' ) === -1 ) return false;
                //@ts-ignore
				(this as any).removeEventListener( "transitionend", onEndTransitionFn );
				loadContent();
			};
			self.placeholder?.addEventListener( "transitionend", onEndTransitionFn );
		};

		setTimeout( animFn, 25 );
	};

	_hideContent() {
		const self = this,
			contentItem = this.el.querySelector( 'div.content1732916007947 > .show1732916007947' ) as HTMLElement;
            console.log(contentItem, "contentItem")
			const currentItem = this.gridItems[ this.contentItems.indexOf(this.contentItems.find( (item:HTMLElement) => item.id===contentItem.id) as any ) ];
            console.log(this.contentItems, contentItem);
           // console.log(this.el.querySelector('div.content1732916007947  > .show1732916007947'), this.contentItems.indexOf(contentItem));
		
            contentItem?.classList?.remove('show1732916007947' );
            this.contentEl?.classList?.remove( 'show1732916007947' );
		// without the timeout there seems to be some problem in firefox
        console.log(currentItem, contentItem, this.gridItems);
		setTimeout( function() {
            document.body?.classList?.remove( 'noscroll' ); 
			}, 25 );
		// that's it for no support..
		if( !this.support ) return false;

		this.gridWrap?.classList?.remove(  'view-full1732916007947' );
        console.log(this.placeholder);

		// reset placeholder style values
		(this.placeholder as HTMLElement).style.left = currentItem.offsetLeft + 'px';
		(this.placeholder as HTMLElement).style.top = currentItem.offsetTop + 'px';
		(this.placeholder as HTMLElement).style.width = this.itemSize.width + 'px';
		(this.placeholder as HTMLElement).style.height = this.itemSize.height + 'px';

		const onEndPlaceholderTransFn = function( ev:TransitionEvent ) {

            //@ts-ignore
			this.removeEventListener( "transitionend", onEndPlaceholderTransFn );
			// remove placeholder from grid
			self.placeholder?.parentNode?.removeChild( self.placeholder );
			// show grid item again
			currentItem.classList.remove( 'active' );
		};
		this.placeholder?.addEventListener( "transitionend", onEndPlaceholderTransFn );
	}

	
	_createPlaceholder( content:string ) {
		const front = document.createElement( 'div' );
		front.className = 'front1732916007947';
		front.innerHTML = content;
		const back = document.createElement( 'div' );
		back.className = 'back1732916007947';
		back.innerHTML = '&nbsp;';
		const placeholder = document.createElement( 'div' );
		placeholder.className = 'placeholder1732916007947';
		placeholder.appendChild( front );
		placeholder.appendChild( back );
		return placeholder;
	};

	_scrollHandler() {
		const self:Grid3D = this;
		if( !this.didScroll ) {
			this.didScroll = true;
			setTimeout( function() { self._scrollPage(); }, 60 );
		}
	};

	// changes the grid perspective origin as we scroll the page
	_scrollPage() {
		const perspY = scrollY() + getViewportH() / 2;
		// this.gridWrap?.style?.WebkitPerspectiveOrigin = '50% ' + perspY + 'px';
		// this.gridWrap.style.MozPerspectiveOrigin = '50% ' + perspY + 'px';
		(this.gridWrap as HTMLElement).style.perspectiveOrigin = '50% ' + perspY + 'px';
		this.didScroll = false;
	};

	_resizeHandler() {
		const self = this;
		function delayed() {
			self._resizePlaceholder();
			self._scrollPage();
			self.resizeTimeout = null;
		}
		if ( this.resizeTimeout ) {
			clearTimeout( this.resizeTimeout );
		}
		this.resizeTimeout = setTimeout( delayed, 50 );
	}

	_resizePlaceholder() {
		// need to recalculate all these values as the size of the window changes
		this.itemSize = { width : this.gridItems[0].offsetWidth, height : this.gridItems[0].offsetHeight };
		if( this.placeholder ) {
			// set the placeholders top to "0 - grid offsetTop" and left to "0 - grid offsetLeft"
			
			const gridOffset = getOffset( this.grid as HTMLElement );
			
			this.placeholder.style.left = Number( -1 * ( gridOffset.left - scrollX() ) ) + 'px';
			this.placeholder.style.top = Number( -1 * ( gridOffset.top - scrollY() ) ) + 'px';
			// set the placeholders width to windows width and height to windows height
			this.placeholder.style.width = getViewportW() + 'px';
			this.placeholder.style.height = getViewportH() + 'px';
		}
	}



}