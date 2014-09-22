// ==UserScript==
// @name        Filter SO Questions
// @description hide questions by score, user reputation and accepted answers
// @namespace   so.app
// @author      brasofilo
// @version     0.2
// @copyright   2014, Rodolfo Buaiz (http://stackapps.com/users/10590/brasofilo)
// @license     ISC; http://opensource.org/licenses/ISC
// @match http*://*.stackoverflow.com/questions*
// @match http*://*.serverfault.com/questions*
// @match http*://*.superuser.com/questions*
// @match http*://*.stackexchange.com/questions*
// @match http*://*.askubuntu.com/questions*
// @match http*://*.mathoverflow.net/questions*
// @match http*://*.stackapps.com/questions*// @resource jqUI_CSS  http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/css/jquery-ui.css
// @resource    IconSet1  http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/css/images/ui-bg_flat_75_ffffff_40x100.png
// @resource    IconSet2  http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/css/images/ui-bg_glass_75_e6e6e6_1x400.png
// @resource    IconSet3  http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/css/images/ui-bg_glass_75_dadada_1x400.png
// @resource    IconSet4  http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/css/images/ui-bg_glass_65_ffffff_1x400.png
// @homepageURL http://stackapps.com/questions/
// @updateURL   https://github.com/brasofilo/FilterSO/raw/master/FilterSO.user.js
// @downloadURL https://github.com/brasofilo/FilterSO/raw/master/FilterSO.user.js
// @grant    	GM_addStyle
// @grant    	GM_getResourceURL
// @grant    	GM_getResourceText
// ==/UserScript==

var iconSet1    = GM_getResourceURL ("IconSet1");
var iconSet2    = GM_getResourceURL ("IconSet2");
var iconSet3    = GM_getResourceURL ("IconSet3");
var iconSet4    = GM_getResourceURL ("IconSet4");
var jqUI_CssSrc = GM_getResourceText ("jqUI_CSS");
jqUI_CssSrc     = jqUI_CssSrc.replace (/url\(images\/ui\-bg_.*00\.png\)/g, "");
jqUI_CssSrc     = jqUI_CssSrc.replace (/images\/ui-bg_flat_75_ffffff_40x100\.png/g, iconSet1);
jqUI_CssSrc     = jqUI_CssSrc.replace (/images\/ui-bg_glass_75_e6e6e6_1x400\.png/g, iconSet2);
jqUI_CssSrc     = jqUI_CssSrc.replace (/images\/ui-bg_glass_75_dadada_1x400\.png/g, iconSet3);
jqUI_CssSrc     = jqUI_CssSrc.replace (/images\/ui-bg_glass_65_ffffff_1x400\.png/g, iconSet4);

GM_addStyle (jqUI_CssSrc);
GM_addStyle(".topbar-dialog.filter-dialog .modal-content li>* { padding: 0; } #slider-rep a:focus, #slider-votes a:focus{ outline:0 }");
            
var jquery_url = '//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js';

var filter_so_startup = function() {
    /**
     * Cookie functions
     * http://stackoverflow.com/a/24103596/1287812
     */
    var create_cookie = function(name,value,days) {
        var expires = '', date;
        if (days) {
            date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            expires = "; expires="+date.toGMTString();
        }
        else expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
    };   
    var read_cookie = function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    };
    var erase_cookie = function(name) {
        create_cookie(name,"",-1);
    };

    /**
     * Read cookies
     */
    var $votesCookie = read_cookie('hide-negs3');
    $votesCookie = ( $votesCookie==null || $votesCookie==false || $votesCookie=='false' ) ? 0 : parseInt($votesCookie,10);
    
    var $repCookie = read_cookie('hide-rep3');
    $repCookie = ( $repCookie==null || $repCookie==false || $repCookie=='false' ) ? 0 : parseInt($repCookie,10);
    
    var $acceptedsCookie = read_cookie('hide-accept3');
    $acceptedsCookie = ( $acceptedsCookie==null || $acceptedsCookie==false || $acceptedsCookie=='false' ) ? false : true;
    
    var $enableCookie = read_cookie('hide-enable3');
    $enableCookie = ( $enableCookie==null || $enableCookie==false || $enableCookie=='false' ) ? false : true;
    
    /**
     * Sliders get and set
     */
    var get_slider_value = function( which ) {
        return $( "#slider-" + which ).slider( "option", "value" );
    };
    
    var set_slider_value = function( which, what ) {
        $( "#slider-" + which ).slider( "option", "value", what );
    };

    /**
     * Dialog window
     */
    var $dialog = '<div id="my-mod-cont" class="topbar-dialog filter-dialog dno" style="top:34px;width:375px;height:235px;display:none;">\
    <div class="header">\
        <h3>filter questions</h3>\
    </div>\
    <div class="modal-content">\
        <ul>\
            <li class="inbox-item" style="padding: 0 5px 12px;">\
				<h4 style="padding: 0 0 7px 0">Votes: <span id="slider-votes-count" style="font-size:.7em">NaN</span></h4>\
				<div id="slider-votes" style="width: 90%; margin: auto; clear:both"></div>\
            </li>\
            <li class="inbox-item" style="padding: 12px 5px;">\
				<h4 style="padding: 0 0 7px 0">Reputation: <span id="slider-rep-count" style="font-size:.7em">NaN</span></h4>\
                <div id="slider-rep" style="width: 90%; margin: auto; clear:both;"></div>\
            </li>\
            <li class="inbox-item unread-item" style="padding: 12px 5px;">\
				<label style="line-height:20px; width: 100%;"><input type="checkbox" id="hide-accepted" style="float:left; margin-left:5%;"> Hide accepted</label>\
				<h4 style="float: right; margin: 3px 15px 0 0;">Question hidden: <span id="slider-hide-count" style="font-size:.7em">NaN</span></h4>\
            </li>\
            <li class="inbox-item" style="padding: 10px 0 0;">\
<label style="line-height:20px"><input type="checkbox" id="enable-filter" style="float:left; margin-left:5%;" /> Enable filter</label>\
<button id="sliders-save" class="ui-button-text" style="padding:5px;float:right; margin-right:5%;">save</button>\
            </li>\
        </ul>\
    </div>\
</div>';
    
    $($dialog).appendTo('div.js-topbar-dialog-corral');
    var $popover = $('#my-mod-cont');

    var $html = '<a href="javascript:void(0)" id="my-so-mod" class="topbar-icon yes-hover icon-inbox-mod" title="Filter questions"></a>';
    $($html).appendTo('div.network-items');
    var $icon = $('#my-so-mod');
    
    /**
     * Icon statuses
     */
    var $statusSet,
        update_stati = function() {
      	  $statusSet = ( $enableCookie ) ? 'icon-inbox-mod-unread' : 'icon-inbox-mod-announcements';
  	  };
    
    /**
     * Show/hide questions
     */
    var $hiddenQuestions,
        do_hide = function( how ) {
            $hiddenQuestions = 0;
            $('.question-summary').each(function() {
                var $accept = $(this).find('.stats .status').hasClass('answered-accepted') && $acceptedsCookie;
                var $votes = $(this).find('.stats .vote .votes .vote-count-post').text();
                var $rep = $(this).find('.user-info .user-details .reputation-score').text();
                var $rep2 = $rep.replace(',','');
                var $rep3 = $rep2.replace('.',''); // produces wrong value for .3k, .4k, etc, but it doesn't matter, we're not filtering this
                var $rep4 = $rep3.replace('k','000');
                $(this).slideDown(50);
                if( parseInt( $votes, 10 ) < $votesCookie || parseInt( $rep4, 10 ) < $repCookie || $accept ) {
                    if( how ) {
                        $(this).slideUp(100);
                        $hiddenQuestions++;
                    }
                    else {
                        $(this).slideDown(200);
                    }
                }
            });
            $('#slider-hide-count').text( $hiddenQuestions );
            $('#slider-votes-count').text( $votesCookie );
            $('#slider-rep-count').text( $repCookie );
        };
    
    /**
     * Votes and reputation sliders (dialog)
     */
    $('#slider-votes').slider({
        slide: function( event, ui ) {
            $('#slider-votes-count').text( ui.value );
        },
        step: 1,
        min: -4,
        max: 4
    });
    $('#slider-votes-count').text( get_slider_value('votes') );

    $('#slider-rep').slider({
        slide: function( event, ui ) {
            $('#slider-rep-count').text( ui.value );
        },
        step: 5,
        min: 0,
        max: 150
    });
    $('#slider-rep-count').text( get_slider_value('rep') );
    
    /**
     * Save options
     */
    $('#sliders-save').click(function(){
        $icon.click();
        $icon.removeClass( $statusSet );
        
        $enableCookie = $('#enable-filter').prop('checked');
        create_cookie( 'hide-enable3', $enableCookie, 9999 );
        
        $acceptedsCookie = $('#hide-accepted').prop('checked');
        create_cookie( 'hide-accept3', $acceptedsCookie, 9999 );
        
        $votesCookie = get_slider_value('votes');
        create_cookie( 'hide-negs3', $votesCookie, 9999 );
        
        $repCookie = get_slider_value('rep');
        create_cookie( 'hide-rep3', $repCookie, 9999 );
        
        update_stati();
        do_hide( $enableCookie );
    });
    
    
    /**
     * Diamond button
     */
    $icon.hover(
        function () {
            if( !$popover.is(':visible') ) {
	            $(this).addClass($statusSet);
            }
        }, 
        function () {
            if( !$popover.is(':visible') ) {
	            $(this).removeClass($statusSet);
            }
        }
    );
    
    $icon.click(function(){
        var $pos = $(this).position();
        $popover.css('left', $pos.left );
        if( $popover.is(':visible') ) {
            $(this).removeClass('topbar-icon-on');
	        $popover.hide();
        }
        else {
            $(this).addClass('topbar-icon-on');
	        $popover.show();
        }
    });
    
    /**
     * Detect click outside the element
     * http://stackoverflow.com/a/3028037/1287812
     */
    $(document).click(function(event) { 
        if(!$(event.target).closest('#my-so-mod, #my-mod-cont').length) {
            if($('#my-mod-cont').is(":visible")) {
                $icon.click();
                $icon.removeClass( $statusSet );
            }
        }        
    });
    
    /**
     * Set item states by cookies
     */
    if( $enableCookie )
        $('#enable-filter').prop('checked', true );
        
    if( $acceptedsCookie )
        $('#hide-accepted').prop('checked', true );
        
    if( $repCookie )
        set_slider_value('rep', $repCookie);
        
    if( $votesCookie )
        set_slider_value('votes', $votesCookie);
    
    /**
     * Start up
     */
    do_hide( $enableCookie );
    update_stati();
};

/**
 * Load jQuery and do callback when jQuery has finished loading
 * Note, jQ replaces $ to avoid conflicts.
 * 
 * http://stackoverflow.com/a/3550261/1287812
 */
var filter_so_add_jquery = function( callback ) 
{
    var script = document.createElement( 'script' );
    script.setAttribute( 'src', jquery_url );
    script.addEventListener( 'load', function() 
    {
        var script = document.createElement('script');
        script.textContent = '(' + callback.toString() + ')();';
        document.body.appendChild( script );
    }, false );
    document.body.appendChild( script );
};

/**
 * Don't run on single question pages
 */
var filter_so_check_page = function() {
    var pathArray = window.location.pathname.split( '/' ); 
    /*** Check IF /questions/11111 OR /questions/tagged/ ***/
    if( pathArray[2] ) 
        return isNaN( parseInt( pathArray[2], 10 ) ); 
    
    /*** Check IF /questions ***/
    else 
        return true;
}
/**
 * Start up
 */
if( filter_so_check_page() )
	filter_so_add_jquery( filter_so_startup );
