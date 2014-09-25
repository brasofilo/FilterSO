// ==UserScript==
// @name        Filter Stack Exchange Questions
// @namespace   stackapps.com/users/10590/brasofilo
// @version     1.0.2
// @description hide questions by score, user reputation and accepted answers
// @homepage    https://github.com/brasofilo/FilterSO
// @author      brasofilo
// @copyright   2014, Rodolfo Buaiz (http://stackapps.com/users/10590/brasofilo)
// @license MIT http://opensource.org/licenses/MIT
// @match       *://*.askubuntu.com/*
// @match       *://*.mathoverflow.net/*
// @match       *://*.serverfault.com/*
// @match       *://*.stackapps.com/*
// @match       *://*.stackexchange.com/*
// @match       *://*.stackoverflow.com/*
// @match       *://*.superuser.com/*
// @resource    jqUI_CSS  http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/css/jquery-ui.css
// @resource    IconSet1  http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/css/images/ui-bg_flat_75_ffffff_40x100.png
// @resource    IconSet2  http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/css/images/ui-bg_glass_75_e6e6e6_1x400.png
// @resource    IconSet3  http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/css/images/ui-bg_glass_75_dadada_1x400.png
// @resource    IconSet4  http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/css/images/ui-bg_glass_65_ffffff_1x400.png
// @homepageURL http://stackapps.com/q/4888/10590
// @updateURL   https://github.com/brasofilo/FilterSO/raw/master/FilterSO.user.js
// @downloadURL https://github.com/brasofilo/FilterSO/raw/master/FilterSO.user.js
// @grant       GM_addStyle
// @grant       GM_getResourceURL
// @grant       GM_getResourceText
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

/** Tooltip CSS: http://www.nitinh.com/2010/03/sexy-tooltip-using-css3/ */
GM_addStyle("\
#my-mod-cont { top:34px; width:375px; height:220px; display:none; overflow:hidden }\
#my-mod-cont ul { position:absolute; top:0; left:0; width:100%; height:100%; }\
#sliders-save { padding:5px;float:right; margin-right:3%; }\
#settings-save { padding:5px;float:right; margin-top:-13px; }\
.fse-save-btn { padding: .3em .6em; box-shadow: 0 2px 1px rgba(0,0,0,0.3),0 1px 0 rgba(255,255,255,0.4) inset; background-color: #3A3C68; color: #fff; border: 1px solid #000 !important; border-radius: 3px; text-decoration: none; }\
#slider-rep a:focus, #slider-votes a:focus, #slider-views a:focus{ outline:0 }\
#range-votes-min, #range-votes-max, #range-rep-max, #range-views-max { padding: 1px; margin: 0 }\
#fse-settings-screen {display:none}\
#fse-settings-screen input { width: 35%; }\
#fse-settings-screen li:last-of-type, #fse-main-screen li:last-of-type { height: 70px }\
.topbar-dialog.filter-dialog .modal-content li>* { padding: 0; }\
.fse-modal.modal-content ul:nth-of-type(1) h4 { margin-top:5px}\
.fse-modal.modal-content { padding: 0; }\
.fse-modal.modal-content .inbox-item { padding: 0 5px 5px; }\
.fse-modal.modal-content li.inbox-item { padding: 10px; }\
.fse-title.fse-info { float: left; font-weight:normal; color: #868686; opacity: .5; }\
.fse-title { font-size: .9em; font-weight: bold; }\
.fse-title-settings { float: left; line-height: 20px; width:20% }\
.fse-slider { right: 13px;float: right;margin-top: -12px; width:67%}\
.inbox-item.fse-checkbox label { line-height:20px; width: 100%; margin-left: 5px; }\
.inbox-item.fse-checkbox input { float:left; }\
h4.fse-totals { float: right; margin: 3px 15px 0 0; }\
h4.fse-totals span { font-size:.7em }\
.se-app-gear1 {\
	background: url('http://i.stack.imgur.com/I5vIL.png') no-repeat -2px -2px !important;\
	width: 24px !important;\
	height: 14px !important;\
	margin-top: 9px;\
}\
.se-app-gear2 {\
	background: url('http://i.stack.imgur.com/I5vIL.png') no-repeat -2px -20px !important;\
	width: 24px !important;\
	height: 14px !important;\
	margin-top: 9px;\
}\
#my-so-mod:after{font:12px/1.4 Arial,Georgia,sans-serif;content:attr(tip);display:none;position:absolute;padding:5px 10px;top:0;margin:1em 0 3em;color:#fff;left:-20px;-moz-border-radius:4px;-webkit-border-radius:4px;border-radius:4px;background:-webkit-gradient(linear,left top,left bottom,from(#075698),to(#2e88c4));background:-moz-linear-gradient(top,#075698,#2e88c4);background:-o-linear-gradient(top,#075698,#2e88c4);background:linear-gradient(top,#075698,#2e88c4);-moz-box-shadow:0 0 4px #000;-webkit-box-shadow:0 0 4px #000;box-shadow:0 0 4px #000;}\
#my-so-mod:before{z-index:13;position:absolute;content:'\00a0';display:none;width:0;height:0;border-style:solid;top:-3px;left:0;border-width:15px 7px;border-color:transparent transparent #075698}\
#my-so-mod:hover::before{display:block}\
#my-so-mod:hover{z-index:10;position:relative}\
#my-so-mod:hover::after{width:200px;display:block;margin:25px 0 0 10px}\
");                                

var jquery_url = '//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js';     

var filter_so_startup = function() {
    /* menu icon */
    var $icon;
    
    var $dialogHeader = '<div id="my-mod-cont" class="topbar-dialog filter-dialog dno tooltip">\
        <div class="header">\
            <h3>filter homepage</h3><a href="javascript:void(0);" style="float:right;" id="help-filter-se">(?)</a>\
        </div>\
        <div class="fse-modal modal-content">\
            <ul id="fse-settings-screen">\
                <li class="inbox-item">\
                    <div class="fse-title fse-title-settings">Votes:</div>\
                    <input type="text" placeholder="minimum" id="range-votes-min" onkeypress="return event.charCode >= 48 && event.charCode <= 57"> | <input type="text" placeholder="maximum" id="range-votes-max" onkeypress="return event.charCode >= 48 && event.charCode <= 57">\
                </li>\
                <li class="inbox-item">\
                    <div class="fse-title fse-title-settings">Reputation:</div>\
                    <input type="text" placeholder="maximum" id="range-rep-max" onkeypress="return event.charCode >= 48 && event.charCode <= 57">\
                </li>\
                <li class="inbox-item">\
                    <div class="fse-title fse-title-settings">Views:</div>\
                    <input type="text" placeholder="maximum" id="range-views-max" onkeypress="return event.charCode >= 48 && event.charCode <= 57">\
                </li>\
                <li class="inbox-item unread-item fse-checkbox">\
                    <div class="fse-title fse-info">\
						View <a href="http://stackapps.com/q/4888/10590">FilterSE Questions by Votes, Views and Rep</a> \
						at Stack Apps <div class="favicon favicon-stackapps" style="transform:scale(.7);margin-bottom:-4px;"></div><br /><br />\
						Inspired by a <a href="http://meta.stackoverflow.com/questions/271684/im-getting-really-really-tired-of-filtering-through-the-garbage-any-tips/271821#271821">Meta.SO question <div class="favicon favicon-stackoverflowmeta" style="transform:scale(.9);margin-bottom:-2px;"></div></a>\
                    </div>\
                    <button id="settings-save" class="fse-save-btn">save settings</button>\
                </li>\
            </ul>\
            <ul id="fse-main-screen">';

    var $dialogFooter = '\
                <li class="inbox-item fse-checkbox">\
                    <label><input type="checkbox" id="hide-accepted"> Hide accepted</label>\
                    <h4 class="fse-totals">Questions hidden: <span id="slider-hide-count"></span></h4>\
                </li>\
                <li class="inbox-item unread-item fse-checkbox">\
                    <label><input type="checkbox" id="enable-filter" /> Enable filter</label>\
                    <button id="sliders-save" class="fse-save-btn">save</button>\
                </li>\
            </ul>\
        </div>\
    </div>';
       
    /**
     * Localstorage for saving options
     */
    var $userOptions;
    
    var update_storage = function( page, values ) {
        var update = JSON.parse(localStorage.filterSE);
        if( update[window.location.hostname] )
            delete update[window.location.hostname];
        update[page] = values;
        $userOptions = update;
        localStorage.filterSE = JSON.stringify(update);
    };
    
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
     * Icon statuses
     */
    var $statusSet,
        update_icon_status = function() {
              $statusSet = ( $userOptions.filter.enabled ) ? 'icon-inbox-mod-unread' : 'icon-inbox-mod-announcements';
          };

    var $hiddenQuestions;
    
    /**
     * Box and filtering for /questions and /unanswered pages
     */
    var start_filtering = function( actual_page ) {
        /**
         * Dialog window
         */
        var $dialog = '\
                <li class="inbox-item slider">\
                    <div id="slider-votes-count" class="fse-title">Votes: NaN</div>\
                    <div id="slider-votes" class="fse-slider"></div>\
                </li>\
                <li class="inbox-item slider" id="fse-rep-container">\
                    <div id="slider-rep-count" class="fse-title">Reputation: NaN</div>\
                    <div id="slider-rep" class="fse-slider"></div>\
                </li>\
                <li class="inbox-item slider">\
                    <div id="slider-views-count" class="fse-title">Views: NaN</div>\
                    <div id="slider-views" class="fse-slider"></div>\
                </li>';    
        $($dialogHeader + $dialog + $dialogFooter).appendTo('div.js-topbar-dialog-corral');
        if( 'questions' !== actual_page )
            $("#fse-rep-container *").disable();
        $('#my-mod-cont .header h3').text('filter ' + actual_page);

        /**
         * Update counts after show/hide 
         */
        var update_counts = function( how, howmany ) {
            $('#slider-hide-count').text( howmany );
            $('#slider-votes-count').text( 'Votes: ' + $userOptions.filter.votes );
            $('#slider-rep-count').text( 'Reputation: ' + $userOptions.filter.rep );
            $('#slider-views-count').text( 'Views: ' + $userOptions.filter.views );
            if( !how ) {
                $('#my-so-mod').attr('title', 'Filter inactive' );
                $('#fse-mini-count').text('');
            }
            else {
                var $numHidden = ( $('.question-summary').length - howmany) + ' questions';
                var $theVotes = ' with votes > ' + $userOptions.filter.votes;
                var $theRep = ( 'questions' === actual_page ) ? ', rep > ' + $userOptions.filter.rep : '';
                var $theViews = ', views > ' + $userOptions.filter.views;
                var $hasAccepted = $userOptions.filter.accept ? ', no accepted' : '';
                $('#my-so-mod').attr('title', $numHidden + $theVotes + $theRep + $theViews + $hasAccepted);
                $('#fse-mini-count').text(howmany);
            }
        };
        
        /**
         * Get views from title
         */
        var parse_title_views = function( title ){
            return title.replace(' views','').replace(' visitas','').replace( /,/g, '' );
        };
        
        var parse_text_rep = function( text ){
            var parsed = 0;
            if( text.indexOf('k') > -1 ) {
                var splited = text.replace('k','').split('.');
                if( splited.length === 1 )
                    parsed = parseInt( splited[0], 10 ) * 1000;
                else
                    parsed = parseInt( splited[0], 10 ) * 1000 + parseInt( splited[1], 10 ) * 100;
            }
            else {
                parsed = parseInt( text.replace(',','').replace(' ',''), 10 );
            }
            return parsed;
        };
        
        /**
         * Show/hide questions
         */
        var do_hide = function( how ) {
            $hiddenQuestions = 0;
            if( !how ) {
                $('.question-summary').each(function() {
                    $(this).slideDown(200);
                });
                update_counts( how, $hiddenQuestions );
                return;
            }
            
            // HOMEPAGE & UNANSWERED
            if( 'questions' !== actual_page ) {
                $('.question-summary').each(function() {
                    var $doAccept = $(this).find('.status.answered-accepted').length && $userOptions.filter.accept;
                    var $votes = $(this).find('.votes .mini-counts').text();
                    var $doVotes = ( parseInt( $votes, 10 ) < $userOptions.filter.votes );
                    var $views = ( 'homepage' === actual_page ) 
                    	? parse_title_views( $(this).find('.views .mini-counts span').attr('title') )
                    	: parse_title_views( $(this).find('.statscontainer .views').attr('title') );
                    var $doViews = ( parseInt( $views, 10 ) < $userOptions.filter.views );
                    if( $doVotes || $doViews || $doAccept ) {
                        $(this).slideUp(100);
                        $hiddenQuestions++;
                    }
                    else {
                        $(this).slideDown(200);
                    }
                });
            }
            // QUESTIONS
            else {
                $('.question-summary').each(function() {
                    var $doAccept = $(this).find('.stats .status').hasClass('answered-accepted') && $userOptions.filter.accept;
                    var $votes = $(this).find('.stats .vote .votes .vote-count-post').text();
                    var $doVotes = ( parseInt( $votes, 10 ) < $userOptions.filter.votes );
                    var $views = parse_title_views( $(this).find('.statscontainer .views').attr('title') );
                    var $doViews = ( parseInt( $views, 10 ) < $userOptions.filter.views );
                    var $rep = parse_text_rep( $(this).find('.user-info .user-details .reputation-score').text() );
                    var $doRep = ( parseInt( $rep, 10 ) < $userOptions.filter.rep );
                    if( $doVotes || $doRep || $doViews || $doAccept ) {
                        $(this).slideUp(100);
                        $hiddenQuestions++;
                    }
                    else {
                        $(this).slideDown(200);
                    }
                });
            }
            update_counts( how, $hiddenQuestions );
        };
        
        /**
         * Votes and reputation sliders (dialog)
         */
        $('#slider-votes').slider({
            slide: function( event, ui ) {
                $('#slider-votes-count').text( 'Votes: ' + ui.value );
            },
            step: 1,
            min: $userOptions.ranges.votes.min,
            max: $userOptions.ranges.votes.max
        });
        $('#slider-votes-count').text( 'Votes: ' + get_slider_value('votes') );
        $('#slider-rep').slider({
            slide: function( event, ui ) {
                $('#slider-rep-count').text( 'Reputation: ' + ui.value );
            },
            step: 5,
            min: 0,
            max: $userOptions.ranges.rep,
            disabled: ( 'questions' !== actual_page )
        });
        $('#slider-rep-count').text( 'Reputation: ' + get_slider_value('rep') );    
        $('#slider-views').slider({
            slide: function( event, ui ) {
                $('#slider-views-count').text( 'Views: ' + ui.value );
            },
            step: 5,
            min: 0,
            max: $userOptions.ranges.views
        });
        $('#slider-views-count').text( 'Views: ' + get_slider_value('views') );

        /**
         * Save options
         */
        $('#sliders-save').click(function(){
            update_storage( 'filter', { 
                'enabled': $('#enable-filter').prop('checked'), 
                'accept': $('#hide-accepted').prop('checked'), 
                'votes': get_slider_value('votes'), 
                'rep': get_slider_value('rep'),
                'views': get_slider_value('views')
            });
            update_icon_status();
            $('#slider-hide-count').parent().animate({ color: '#aaa' }, 300, function() {
                $('#slider-hide-count').parent().animate({ color: '#000' }, 300);
            });
            do_hide( $userOptions.filter.enabled );
        });
    
        /**
         * Set item states by cookies
         */
        if( $userOptions.filter.enabled )
            $('#enable-filter').prop('checked', true );
        if( $userOptions.filter.accept )
            $('#hide-accepted').prop('checked', true );
        set_slider_value('rep', parseInt( $userOptions.filter.rep, 10 ) );
        set_slider_value('votes', parseInt( $userOptions.filter.votes, 10 ) );
        set_slider_value('views', parseInt( $userOptions.filter.views, 10 ) );
        $('#range-votes-min').val( $userOptions.ranges.votes.min );
        $('#range-votes-max').val( $userOptions.ranges.votes.max );
        $('#range-rep-max').val( $userOptions.ranges.rep );
        $('#range-views-max').val( $userOptions.ranges.views );
        
        do_hide( $userOptions.filter.enabled );
    };
        
    /**
     * Add icon to multicollider menu
     */
    var start_menu = function( actual_page ) {
        /**
         * Different icons for moderators
         */
        var testForMod = function() {
            return $('div.topbar-links').find('.mod-only').length;
        };

        var $class = testForMod() ? ' se-app-gear1' : ' icon-inbox-mod';
        var $html_icon = '<a href="javascript:void(0)" id="my-so-mod" class="topbar-icon yes-hover' + $class + '" title="Filter questions"></a>';
        $($html_icon).appendTo('div.network-items');
        $icon = $('#my-so-mod');
		var $html_count = '<em id="fse-mini-count" style="margin-top: 4px; float: right; color: #575757; margin-left: -5px; font-size: .8em;"></em>';
        $($html_count).appendTo('div.network-items');

        /**
         * Diamond button for mortals, Gear icon for mods
         */
        $icon.hover(
            function () {
                if( !$('#my-mod-cont').is(':visible') )
	                $('#fse-mini-count').fadeOut(75);
                if( testForMod() )
                    $(this).removeClass('se-app-gear1').addClass('se-app-gear2');
                else 
                    $(this).addClass($statusSet);
            }, 
            function () {
                if( !$('#my-mod-cont').is(':visible') )
	                $('#fse-mini-count').fadeIn(75);
                 if( testForMod() )
                    $(this).removeClass('se-app-gear2').addClass('se-app-gear1');
                else 
                    $(this).removeClass($statusSet);
            }
        );
        $icon.click(function(){
            $('#my-mod-cont').css('left', $(this).position().left );
            if( $('#my-mod-cont').is(':visible') ) {
                $(this).removeClass('topbar-icon-on');
                $('#my-mod-cont').hide();
                $('#fse-mini-count').fadeIn(75);
            }
            else {
                $(this).addClass('topbar-icon-on');
                $('#my-mod-cont').show();
                $('#fse-mini-count').fadeOut(75);
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
         * New plugin settings area
         */
        $(document).on('click', '#help-filter-se', function(){
            if( $('#fse-settings-screen').is(':visible') ) {
                $('#my-mod-cont .header h3').text('filter ' + actual_page);
                $('#fse-settings-screen').fadeOut('fast');
                $('#fse-main-screen').fadeIn('fast');
            }
            else {
                $('#my-mod-cont .header h3').text('range settings');
                $('#fse-main-screen').fadeOut('fast');
                $('#fse-settings-screen').fadeIn('fast');
            }
        });
        
        $(document).on('click', '#settings-save', function(){
            update_storage( 'ranges', { 
                'votes': {
                   'min': parseInt( $('#range-votes-min').val(), 10 ),
                   'max': parseInt( $('#range-votes-max').val(), 10 )
                },
                'rep': parseInt( $('#range-rep-max').val(), 10 ),
                'views': parseInt( $('#range-views-max').val(), 10 )
            });
            $icon.click();
            $icon.removeClass( $statusSet );
            if (window.confirm("Reload page?")) { 
                document.location.reload(true);
            }
        });
    };
    
    /**
     * Detect if we are in the homepage, /questions/not-id and /unanswered pages
     */
    var filter_so_check_page = function() {
        var path = window.location.pathname;
        var unanswered = ( path.indexOf('/unanswered') > -1 ); 
        var questions = ( path.indexOf('/questions') > -1 );
        if( questions ) {
            var pathArray = window.location.pathname.split( '/' ); 
            if( ( pathArray[2] && !isNaN( parseInt( pathArray[2], 10 ) ) ) || ( path.indexOf('/ask') > -1 ) )
                questions = false;
        }
        if( path == '/' )
            return 'homepage';
        else if( questions )
            return 'questions';
        else if( unanswered )
            return 'unanswered';
        else
            return false;
    };

    /**
     * Read options or set defaults 
     */
    if ( localStorage ) {
        if (!localStorage.filterSE) {
            localStorage.filterSE = JSON.stringify({
                'filter': { 'enabled': false, 'accept': false, 'votes': 0, 'rep': 0, 'views': 0 },
                'ranges': { 'votes': { 'min': -6, 'max': 6 }, 'rep': 250, 'views': 1500 }
             });
        }
        $userOptions = JSON.parse(localStorage.filterSE);
    } 
    else {
        console.error('Local storage disabled. FilterSE cannot save its data.');
    }
        
    /**
     * Start up
     */
    if( ( page = filter_so_check_page() ) !== false ) {
        start_menu(page);
        update_icon_status();
        start_filtering(page);
    }
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
 * Start up
 * don't run on /questions/POST-ID or /questions/ask
 */
if( window.location.pathname.indexOf('/questions') > -1 ) { 
    var pathArray = window.location.pathname.split( '/' ); 
    if( isNaN( parseInt( pathArray[2], 10 ) )  && ( window.location.pathname.indexOf('/ask') === -1 ) ) {
    	filter_so_add_jquery( filter_so_startup );
    }
} else {
    filter_so_add_jquery( filter_so_startup );
}
