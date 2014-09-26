// ==UserScript==
// @name        Filter Stack Exchange Questions
// @namespace   stackapps.com/users/10590/brasofilo
// @version     1.2
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
h4.fse-totals { float: left; margin: 4px 28% 0; width: 70%; opacity: .4 }\
h4.fse-totals span { font-size:1.3em }\
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
#fse-mini-count { display: inline-block; color: #747272;  border-radius: 2px; font-size: 11px; font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif !important; margin: 10px 0 0 35px; cursor: default; }\
#my-so-mod:after{font:12px/1.4 Arial,Georgia,sans-serif;content:attr(tip);display:none;position:absolute;padding:5px 10px;top:0;margin:1em 0 3em;color:#fff;left:-20px;-moz-border-radius:4px;-webkit-border-radius:4px;border-radius:4px;background:-webkit-gradient(linear,left top,left bottom,from(#075698),to(#2e88c4));background:-moz-linear-gradient(top,#075698,#2e88c4);background:-o-linear-gradient(top,#075698,#2e88c4);background:linear-gradient(top,#075698,#2e88c4);-moz-box-shadow:0 0 4px #000;-webkit-box-shadow:0 0 4px #000;box-shadow:0 0 4px #000;}\
#my-so-mod:before{z-index:13;position:absolute;content:'\00a0';display:none;width:0;height:0;border-style:solid;top:-3px;left:0;border-width:15px 7px;border-color:transparent transparent #075698}\
#my-so-mod:hover::before{display:block}\
#my-so-mod:hover{z-index:10;position:relative}\
#my-so-mod:hover::after{width:200px;display:block;margin:25px 0 0 10px}\
#fse-checkbox-left { float: left }\
#fse-checkbox-right { margin-right: 20px }\
");                                

var jquery_url = '//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js';     

var filter_so_startup = function( actual_page ) {
    var second_run = false, // prevent slider to respond onChange when instantiated
        $appIcon,           // our multicollider menu item
        $hiddenQuestions,   // actual number of hidden q's
        $userOptions,       // holds the current settings
        $dialogHeader = '<div id="my-mod-cont" class="topbar-dialog filter-dialog dno tooltip">\
        <div class="header">\
            <h3>filter homepage</h3><a href="javascript:void(0);" style="float:right;" id="help-filter-se">[?]</a>\
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
            <ul id="fse-main-screen">',
        $dialogFooter = '\
                <li class="inbox-item fse-checkbox" style="height: 17px;">\
					<div id="fse-checkbox-left" style="float:left"><label><input type="checkbox" id="hide-accepted"> Hide accepted</label></div>\
                    <div id="fse-checkbox-right" style="float:right;margin-right: 15px;"><label><input type="checkbox" id="enable-filter" /> <strong>Enable filter</strong></label></div>\
                </li>\
                <li class="inbox-item unread-item fse-checkbox">\
                    <h4 class="fse-totals">Questions hidden: <span id="slider-hide-count"></span></h4>\
                </li>\
            </ul>\
        </div>\
    </div>',
        $dialog = '\
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
       
    /**
     * Read options or set defaults 
     */
     var setup_local_storage = function()
     {
         var defaults = {
            'filter': { 'enabled': false, 'accept': false, 'votes': 0, 'rep': 0, 'views': 0 },
            'ranges': { 'votes': { 'min': -6, 'max': 6 }, 'rep': 250, 'views': 1500 }
         };
         if ( localStorage ) {
             if (!localStorage.filterSE) {
                 localStorage.filterSE = JSON.stringify(defaults);
             }
             $userOptions = JSON.parse(localStorage.filterSE);
         } 
         else {
             $userOptions = defaults;
             console.error('Local storage disabled. FilterSE cannot save its data.');
         }
     };

    /**
     * Localstorage for saving options
     */
    var update_storage = function( section ) {
        var values;
        if( section === 'filter' ) {
            values = {
                'enabled': $('#enable-filter').prop('checked'), 
                'accept':  $('#hide-accepted').prop('checked'), 
                'votes':   get_slider_value('votes'), 
                'rep':     get_slider_value('rep'),
                'views':   get_slider_value('views')
            };
        } else {
            values = { 
                'votes': {
                   'min': parseInt( $('#range-votes-min').val(), 10 ),
                   'max': parseInt( $('#range-votes-max').val(), 10 )
                },
                'rep':   parseInt( $('#range-rep-max').val(), 10 ),
                'views': parseInt( $('#range-views-max').val(), 10 )
            };
        }
        var update = JSON.parse(localStorage.filterSE);
        update[section] = values;
        $userOptions = update;
        localStorage.filterSE = JSON.stringify(update);
    };
    
    /**
     * Sliders get and set
     */
    var get_slider_value = function( which ) {
        return $( "#slider-" + which ).slider( "option", "value" );
    };   
    var set_slider_value = function( which, howmuch ) {
        $( "#slider-" + which ).slider( "option", "value", howmuch );
        write_slider_text( which, howmuch );
    };

    /**
     * Icon statuses
     */
    var update_icon_status = function() {
        return ( $userOptions.filter.enabled ) ? 'icon-inbox-mod-unread' : 'icon-inbox-mod-announcements';
    };
    
    /**
     * Different icons for moderators
     */
    var testForMod = function() {
        return $('div.topbar-links').find('.mod-only').length;
    };

    var write_slider_text = function( which, howmuch ) {
        var texts = { 'votes': 'Votes: ', 'rep': 'Reputation: ', 'views': 'Views: ' };
        $('#slider-' + which + '-count').text( texts[which] + howmuch );
    };
    
    /**
     * Update counts after show/hide 
     */
    var update_counts = function() {
        var how = $userOptions.filter.enabled;
        var total_questions = $('.question-summary').length;
        $('#fse-mini-count').text( ( how ? ( total_questions - $hiddenQuestions ) + '/' + total_questions : '' ) );
        //console.log($('#fse-mini-count').text());
        $('#slider-hide-count').text( $hiddenQuestions );// + '/' + total_questions);
        write_slider_text( 'votes', $userOptions.filter.votes );
        write_slider_text( 'rep', $userOptions.filter.rep );
        write_slider_text( 'views', $userOptions.filter.views );
        //$('#slider-votes-count').text( 'Votes: ' + $userOptions.filter.votes );
        //$('#slider-rep-count').text( 'Reputation: ' + $userOptions.filter.rep );
        //$('#slider-views-count').text( 'Views: ' + $userOptions.filter.views );
        if( !how ) {
            $('#my-so-mod').attr('title', 'Filter inactive' );
        }
        else {
            var $numHidden = ( total_questions - $hiddenQuestions) + ' questions';
            var $theVotes = ' with votes > ' + $userOptions.filter.votes;
            var $theRep = ( 'questions' === actual_page ) ? ', rep > ' + $userOptions.filter.rep : '';
            var $theViews = ', views > ' + $userOptions.filter.views;
            var $hasAccepted = $userOptions.filter.accept ? ', no accepted' : '';
            $('#my-so-mod').attr('title', $numHidden + $theVotes + $theRep + $theViews + $hasAccepted);
        }
    };
    
    /**
    * Get views from title
    */
    var parse_title_views = function( title ){
        return title.replace(' views','').replace(' visitas','').replace( /,/g, '' );
    };
    
    /**
    * Get rep from text
    */
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
    * Custom slider steps depending on app settings
    */
    var calculate_slider_step = function( which ) {
        var step;
        if( 'views' === which ) {
            var view_range = parseInt( $userOptions.ranges.views, 10 );
            if( view_range > 10000 ) step = 200;
            else if( view_range > 3000 ) step = 50;
            else step = 5;
        }
        else {
            var rep_range = parseInt( $userOptions.ranges.rep, 10 );
            if( rep_range > 2500 ) step = 50;
            else if( rep_range > 1000 ) step = 20;
            else step = 5;
        }
        return step;
    };
    
    /**
     * Show/hide questions
     */
    var do_hide = function() {
        var how = $userOptions.filter.enabled;
        $hiddenQuestions = 0;
        
        // Show
        if( !how ) {
            $('.question-summary').each(function() {
                $(this).slideDown(200);
            });
        }
        // Hide
        else {
            switch( actual_page ) {
                case 'homepage':
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
                    break;
                case 'unanswered':
                    $('.question-summary').each(function() {
                        var $votes = $(this).find('.stats .vote .votes .vote-count-post').text();
                        var $doVotes = ( parseInt( $votes, 10 ) < $userOptions.filter.votes );
                        var $views = ( 'homepage' === actual_page ) 
                        ? parse_title_views( $(this).find('.views .mini-counts span').attr('title') )
                        : parse_title_views( $(this).find('.statscontainer .views').attr('title') );
                        var $doViews = ( parseInt( $views, 10 ) < $userOptions.filter.views );
                        if( $doVotes || $doViews  ) {
                            $(this).slideUp(100);
                            $hiddenQuestions++;
                        }
                        else {
                            $(this).slideDown(200);
                        }
                    });
                    break;
                case 'questions':
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
                    break;
            }
        }
        update_counts();
    };

    /**
     * Add icon to multicollider menu and app ui box
     */
    var create_elements = function() {
        
        var html_icon = '<a href="javascript:void(0)" id="my-so-mod" class="topbar-icon yes-hover' 
                        + ( testForMod() ? ' se-app-gear1' : ' icon-inbox-mod' )
                        + '" title="Filter questions"><span id="fse-mini-count">2/50</span></a>';
        $( html_icon ).appendTo('div.network-items');
        var $appIcon = $('#my-so-mod');
        
        /**
         * Diamond button for mortals, Gear icon for mods
         */
        $appIcon.hover(
            function () {
                if( testForMod() )
                    $(this).removeClass('se-app-gear1').addClass('se-app-gear2');
                else 
                    $(this).addClass( update_icon_status() );
            }, 
            function () {
                 if( testForMod() )
                    $(this).removeClass('se-app-gear2').addClass('se-app-gear1');
                else 
                    $(this).removeClass( update_icon_status() );
            }
        );
        $appIcon.click(function(){
            $('#my-mod-cont').css('left', $(this).position().left );
            if( $('#my-mod-cont').is(':visible') ) {
                $(this).removeClass('topbar-icon-on');
                $('#my-mod-cont').hide();
            }
            else {
                $(this).addClass('topbar-icon-on');
                $('#my-mod-cont').show();
            }
        });

        /**
         * Detect click outside the element
         * http://stackoverflow.com/a/3028037/1287812
         */
        $(document).click(function(event) { 
            if(!$(event.target).closest('#my-so-mod, #my-mod-cont').length) {
                if($('#my-mod-cont').is(":visible")) {
                    $appIcon.click();
                    $appIcon.removeClass(  update_icon_status()  );
                }
            }        
        });
        
        /**
         * Settings area button
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
        
        /**
         * Settings area save options
         */
        $(document).on('click', '#settings-save', function(){
            update_storage( 'ranges' );
            $appIcon.click();
            $appIcon.removeClass(  update_icon_status()  );
            if (window.confirm("Reload page?")) { 
                document.location.reload(true);
            }
        });
        
        /**
         * Dialog window
         */
        $( $dialogHeader + $dialog + $dialogFooter ).appendTo('div.js-topbar-dialog-corral');
        
        /**
         * Checkboxe accepted
         */
        $('#hide-accepted').click(function(){
            $userOptions.filter.accept = $(this).prop('checked' );
            do_hide();
            update_storage( 'filter' );
        });

        /**
         * Checkboxe enabled
         */
        $('#enable-filter').click(function(){
            $userOptions.filter.enabled = $(this).prop('checked' );
            do_hide();
            update_storage( 'filter' );
        });
        
        /**
         * Votes slider
         */
        $('#slider-votes').slider({
            step: 1,
            min: $userOptions.ranges.votes.min,
            max: $userOptions.ranges.votes.max,
            slide: function (event, ui) {
                write_slider_text( 'votes', ui.value );
                $userOptions.filter.votes = ui.value;
                do_hide();
            },
            change: function (event, ui) {
                if( second_run )
	                update_storage( 'filter' );
            }
        });

        /**
         * Reputation slider
         */
        var rep_step, 
            views_step,
            view_range = calculate_slider_step('views'), // custom steps depending on saved options
            rep_range = calculate_slider_step('rep');
        $('#slider-rep').slider({
            step: rep_step,
            min: 0,
            max: $userOptions.ranges.rep,
            disabled: ( 'questions' !== actual_page ),
            slide: function (event, ui) {
                write_slider_text( 'rep', ui.value );
                $userOptions.filter.rep = ui.value;
                do_hide();
            },
            change: function (event, ui) {
                if( second_run )
	                update_storage( 'filter' );
            }
        });

        /**
         * Views slider
         */
        $('#slider-views').slider({
            step: rep_step,
            min: 0,
            max: $userOptions.ranges.views,
            slide: function (event, ui) {
                write_slider_text( 'views', ui.value );
                $userOptions.filter.views = ui.value;
                do_hide();
            },
            change: function (event, ui) {
                if( second_run )
	                update_storage( 'filter' );
            }
        });

        /**
         * Set item states
         */
        if( $userOptions.filter.enabled )
            $('#enable-filter').prop('checked', true );
        if( $userOptions.filter.accept )
            $('#hide-accepted').prop('checked', true );

        set_slider_value( 'votes', parseInt( $userOptions.filter.votes, 10 ) );
        set_slider_value( 'rep', parseInt( $userOptions.filter.rep, 10 ) );
        set_slider_value( 'views', parseInt( $userOptions.filter.views, 10 ) );

        $('#range-votes-min').val( $userOptions.ranges.votes.min );
        $('#range-votes-max').val( $userOptions.ranges.votes.max );
        $('#range-rep-max').val( $userOptions.ranges.rep );
        $('#range-views-max').val( $userOptions.ranges.views );

        $('#my-mod-cont .header h3').text('filter ' + actual_page);

        if( 'questions' !== actual_page )
            $("#fse-rep-container *").disable();
        
        if( 'unanswered' === actual_page )
            $("#fse-checkbox-left *").disable();
               
        second_run = true;
        do_hide();
    };

    /* Start up */
     setup_local_storage();
     create_elements();
};

/**
 * Load jQueryUI and do callback when finished loading
 * http://stackoverflow.com/a/3550261/1287812
 */
var filter_so_add_jquery = function( callback, page ) 
{
    var script = document.createElement( 'script' );
    script.setAttribute( 'src', jquery_url );
    script.addEventListener( 'load', function() 
    {
        var script = document.createElement('script');
        script.textContent = '(' + callback.toString() + ')("' + page + '");';
        document.body.appendChild( script );
    }, false );
    document.body.appendChild( script );
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
 * Start up
 */
if( ( page = filter_so_check_page() ) !== false ) {
	filter_so_add_jquery( filter_so_startup, page );
}
