/* ---------------------------------------------------------

- document:  Slick Modals - HTML5 and CSS3 powered modal popups
- author:    Capelle @ Codecanyon
- profile:   http://codecanyon.net/user/Capelle
- version:   4.4

---------------------------------------------------------- */

(function ($) {
    $.fn.slickModals = function (options) {

        // Settings
        var settings = $.extend({
            // Hide on pages
            hideOnPages: [],
            // Open via URL
            openViaHash: false,
            urlHash: '#loremIpsum',
            // Popup type
            popupType: 'none',
            delayTime: 5000,
            scrollTopDistance: 500,
            // Auto closing
            autoClose: false,
            autoCloseDelay: 5000,
            // Statistics
            enableStats: false,
            fileLocation: 'slickStats/collect.php',
            modalName: 'Modal 1',
            modalSummary: 'Modal 1 summary',
            callToAction: 'cta',
            // Popup cookies
            setCookie: false,
            cookieDays: 30,
            cookieTriggerClass: 'setCookie-1',
            cookieName: 'slickModal-1',
            cookieScope: 'domain',
            // Overlay styling
            overlayVisible: true,
            overlayClosesModal: true,
            overlayColor: 'rgba(0,0,0,0.85)',
            overlayAnimationDuration: '0.4',
            overlayAnimationEffect: 'fadeIn',
            // Background effects
            pageAnimationDuration: '0.4',
            pageAnimationEffect: 'none',
            pageBlurRadius: '1px',
            pageScaleValue: '0.9',
            pageMoveDistance: '30%',
            // Popup styling
            popupWidth: '480px',
            popupHeight: '360px',
            popupLocation: 'center',
            popupAnimationDuration: '0.4',
            popupAnimationEffect: 'fadeIn',
            popupBoxShadow: 'none',
            popupBackground: '#fff',
            popupRadius: '0',
            popupMargin: 'auto',
            popupPadding: '20px',
            // Mobile rules
            showOnMobile: true,
            responsive: true,
            mobileBreakPoint: '480px',
            mobileLocation: 'center',
            mobileWidth: '100%',
            mobileHeight: '360px',
            mobileRadius: '0',
            mobileMargin: '0',
            mobilePadding: '20px',
            // Animate content
            contentAnimation: false,
            contentAnimationEffect: 'zoomIn',
            contentAnimationDuration: '0.4',
            contentAnimationDelay: '0.4',
            // Youtube videos
            videoSupport: false,
            videoAutoPlay: false,
            videoStopOnClose: false,
            // Close and reopen button
            addCloseButton: true,
            buttonStyle: 'icon',
            enableESC: true,
            reopenClass: 'openSlickModal-1'
        }, options);

        // Start each popup
        return this.each(function () {
            var self = this,
                cookieIsSet  = document.cookie.indexOf(settings.cookieName) >= 0,
                currentPath  = window.location.pathname,
                canBeShown   = $.inArray(currentPath, settings.hideOnPages) === -1,
                videoSel     = $(self).find('iframe[src*="youtube.com"]'),
                videoURL     = videoSel.attr('src'),
                pageElements = $('body > *').not('.slickModal, script, style'),
                safePrefix   = 'sm-',
                $slickWindow = $(self).find('.slickWindow'),
                $slickOverlay,
                $slickContent;

            // Popup location fixing
            function locationFix(param) {
                if (param === 'center') {
                    $slickWindow.css({
                        'margin' : 'auto'
                    });
                } else if ((param === 'bottomCenter') || (param === 'topCenter')) {
                    $slickWindow.css({
                        'margin-left' : 'auto',
                        'margin-right' : 'auto'
                    });
                } else if ((param === 'right') || (param === 'left')) {
                    $slickWindow.css({
                        'margin-top' : 'auto',
                        'margin-bottom' : 'auto'
                    });
                }
            };

            // Overlay speed check
            var overlaySpeed = 0;
            switch(settings.overlayVisible) {
                case true  : overlaySpeed = parseFloat(settings.overlayAnimationDuration); break;
                case false : overlaySpeed = 0; break;
            };

            // Popup styling
            function popupStyling() {
                $slickWindow.addClass(safePrefix + 'animated').css({
                    'box-shadow' : settings.popupBoxShadow,
                    'background' : settings.popupBackground,
                    '-webkit-animation-duration' : settings.popupAnimationDuration + 's',
                    'animation-duration' : settings.popupAnimationDuration + 's',
                    '-webkit-animation-delay' : overlaySpeed / 2 + 's',
                    'animation-delay' : overlaySpeed / 2 + 's'
                });
                if (settings.responsive) {
                    if ($(window).width() <= settings.mobileBreakPoint) {
                        $slickWindow.addClass(safePrefix + settings.mobileLocation).css({
                            'border-radius' : settings.mobileRadius,
                            'width' : settings.mobileWidth,
                            'height' : settings.mobileHeight,
                            'margin' : settings.mobileMargin,
                            'padding' : settings.mobilePadding
                        })
                        locationFix(settings.mobileLocation);
                    } else {
                        $slickWindow.addClass(safePrefix + settings.popupLocation).css({
                            'border-radius' : settings.popupRadius,
                            'width' : settings.popupWidth,
                            'height' : settings.popupHeight,
                            'margin' : settings.popupMargin,
                            'padding' : settings.popupPadding
                        })
                        locationFix(settings.popupLocation);
                    }
                } else {
                    $slickWindow.addClass(safePrefix + settings.popupLocation).css({
                        'border-radius' : settings.popupRadius,
                        'width' : settings.popupWidth,
                        'height' : settings.popupHeight,
                        'margin' : settings.popupMargin,
                        'padding' : settings.popupPadding
                    })
                    locationFix(settings.popupLocation);
                }
            };

            // Add effect class
            function addEffectClass() {
                if (settings.overlayVisible) {
                    $slickOverlay.removeClass(safePrefix + 'fadeOut').addClass(safePrefix + settings.overlayAnimationEffect);
                }
                $slickWindow.removeClass(safePrefix + 'fadeOut').addClass(safePrefix + settings.popupAnimationEffect);
            };

            // Remove effect class
            function removeEffectClass() {
                $slickWindow.removeClass(safePrefix + settings.popupAnimationEffect).addClass(safePrefix + 'fadeOut');
                if (settings.overlayVisible) {
                    setTimeout(function () {
                        $slickOverlay.removeClass(safePrefix + settings.overlayAnimationEffect).addClass(safePrefix + 'fadeOut');
                    }, parseFloat(settings.popupAnimationDuration) * 1000 / 2);
                }
            };

            // Content wrap
            function wrapContent() {
                if (settings.contentAnimation) {
                    $slickWindow.children().not('.slickCloseBtn').wrapAll('<div class="slickContent"></div>');
                    $slickContent = $slickWindow.find('.slickContent');
                    $slickContent.addClass(safePrefix + settings.contentAnimationEffect + ' ' + safePrefix + 'animated').css({
                        '-webkit-animation-duration': settings.contentAnimationDuration + 's',
                        'animation-duration': settings.contentAnimationDuration + 's',
                        '-webkit-animation-delay': settings.contentAnimationDelay + 's',
                        'animation-delay': settings.contentAnimationDelay + 's'
                    });
                }
            };

            // Remove content animation
            function removeContentClass() {
                if (settings.contentAnimation) {
                    $slickContent.removeClass(safePrefix + settings.contentAnimationEffect);
                }
            };

            // Page effects
            function startPageEffects() {
                if (settings.pageAnimationEffect === 'blur' || settings.pageAnimationEffect === 'scale' || settings.pageAnimationEffect.indexOf('move') > -1) {
                    pageElements.css({
                       '-webkit-transition-duration' : settings.pageAnimationDuration + 's',
                       'transition-duration' : settings.pageAnimationDuration + 's'
                    });
                    if (settings.pageAnimationEffect === 'blur') {
                        pageElements.addClass('blurred').css({
                            '-webkit-filter' : 'blur' + '(' + settings.pageBlurRadius + ')',
                            'filter' : 'blur' + '(' + settings.pageBlurRadius +')'
                        });
                    } else if (settings.pageAnimationEffect === 'scale') {
                        pageElements.addClass('scaled').css({
                            '-webkit-transform' : 'scale' + '(' + settings.pageScaleValue + ')',
                            'transform' : 'scale' + '(' + settings.pageScaleValue + ')'
                        });
                    } else if (settings.pageAnimationEffect.indexOf('move') > -1) {
                        var moveDir = settings.pageAnimationEffect;
                        switch(true) {
                            case (moveDir === 'moveUp'):    axis = 'Y'; sign = '-'; break;
                            case (moveDir === 'moveDown'):  axis = 'Y'; sign = '';  break;
                            case (moveDir === 'moveLeft'):  axis = 'X'; sign = '-'; break;
                            case (moveDir === 'moveRight'): axis = 'X'; sign = '';  break;
                        }
                        pageElements.addClass('moved').css({
                            '-webkit-transform' : 'translate' + axis + '(' + sign + '' + parseFloat(settings.pageMoveDistance) + '%)',
                            'transform' : 'translate' + axis + '(' + sign + '' + parseFloat(settings.pageMoveDistance) + '%)'
                        });
                    }
                }
            };

            // Remove page effects
            function endPageEffects() {
                if (pageElements.hasClass('blurred') || pageElements.hasClass('scaled') || pageElements.hasClass('moved')) {
                    pageElements.removeClass('blurred scaled moved').css({
                        '-webkit-transform' : '',
                        'transform' : '',
                        '-webkit-filter' : '',
                        'filter' : ''
                    });
                }
            };

            // Overlay styling
            function showOverlay() {
                if (settings.overlayVisible) {
                    $(self).prepend('<div class="slickOverlay ' + safePrefix + 'animated">' + '</div>');
                    $slickOverlay = $(self).find('.slickOverlay');
                    if (settings.overlayClosesModal) {
                        $slickOverlay.addClass('closeModal');
                    }
                    $slickOverlay.css({
                        'background' : settings.overlayColor,
                        '-webkit-animation-duration' : overlaySpeed + 's',
                        'animation-duration' : overlaySpeed + 's'
                    });
                    if (settings.setCookie) {
                        $slickOverlay.addClass(settings.cookieTriggerClass);
                    }
                }
            };

            // Add close button
            function appendCloseButton() {
                if (settings.addCloseButton) {
                    $slickWindow.prepend('<div class="slickCloseBtn close closeModal ' + settings.buttonStyle + '">' + '</div>');
                    if (settings.setCookie) {
                        $slickWindow.children('.closeModal').addClass(settings.cookieTriggerClass);
                    }
                }
            };

            // Close modal on ESC key press
            function activateESC() {
                if (settings.enableESC) {
                    $(window).bind('keydown', function(e) {
                        if (e.keyCode === 27) {
                            disableSlick();
                            if (settings.setCookie) {
                                setSlickCookie();
                            }
                        }
                    });
                }
            };

            // After init
            function slickOnLoad() {
                if (settings.onSlickLoad !== undefined) {
                    settings.onSlickLoad();
                }
            };

            // Before init
            function slickOnClose() {
                if (settings.onSlickClose !== undefined) {
                    settings.onSlickClose();
                }
            };

            var hashExist = (settings.urlHash !== undefined && settings.urlHash !== '');

            // Popup types
            function popupTypes() {
                if (!cookieIsSet) {
                    var currentHash = window.location.hash;
                    if (currentHash !== settings.urlHash || !settings.openViaHash || !hashExist) {
                        if (settings.popupType === 'delayed') {
                            setTimeout(enableSlick, settings.delayTime);
                        } else if (settings.popupType === 'exit') {
                            var t = false;
                            $(document).on('mouseleave', function (e) {
                                if (e.clientY < 0 && !t) {
                                    t = true;
                                    enableSlick();
                                }
                            });
                        } else if (settings.popupType === 'scrolled') {
                            var s = false;
                            $(document).scroll(function() {
                                var scrollY = $(this).scrollTop();
                                if ((scrollY > settings.scrollTopDistance) && !s) {
                                    s = true;
                                    enableSlick();
                                }
                            });
                        }
                    } else {
                        openViaHash(currentHash);
                    }
                }
            };

            // Open via url hash
            function openViaHash(currentHash) {
                if (settings.openViaHash && hashExist) {
                    if (currentHash !== '') {
                        if (currentHash === settings.urlHash) {
                            enableSlick();
                        } else {
                            disableSlick();
                        }
                    }
                }
            };
            $(window).on('hashchange', function() {
                var currentHash = window.location.hash;
                openViaHash(currentHash);
            });

            // Video autoplay
            function videoAutoplay() {
                if ((settings.videoSupport) && (settings.videoAutoPlay)) {
                    if (videoSel.length > 0) {
                        videoSel.attr('src', videoURL + '?autoplay=1');
                    }
                }
            };

            // Video stop
            function videoStop() {
                if ((settings.videoSupport) && (settings.videoStopOnClose)) {
                    if (videoSel.length > 0) {
                        videoSel.attr('src', videoURL + '?autoplay=0');
                    }
                }
            };

            // Set a cookie to hide modal
            function setSlickCookie() {
                days = settings.cookieDays;
                CookieDate = new Date();
                CookieDate.setTime(CookieDate.getTime() + (days * 24 * 60 * 60 * 1000));
                switch (settings.cookieScope) {
                    case 'domain':
                         scopeSetting = '/';
                         break;
                    case 'page':
                         scopeSetting = window.location.href;
                         break;
                };
                if (days > 0) {
                    document.cookie = settings.cookieName + '=true; path=' + scopeSetting + '; expires=' + CookieDate.toGMTString();
                } else if (days === 0) {
                    document.cookie = settings.cookieName + '=true; path=' + scopeSetting + ';';
                }
            };

            // Slick cookie triggers
            function cookieTriggers() {
                if (settings.setCookie) {
                    $('.' + settings.cookieTriggerClass).on('click', function() {
                        setSlickCookie();
                    });
                }
            };

            // Auto close popup
            var autoCloseTimer;
            function autoClosing() {
                if (settings.autoClose) {
                    autoCloseTimer = setTimeout(disableSlick, overlaySpeed * 1000 + settings.autoCloseDelay);
                    if (settings.setCookie) {
                        setSlickCookie();
                    }
                }
            };

            // Statistics
            var views   = 0;
            var seconds = 0;
            var clicks  = 0;
            // Count modal visibility
            var timer = {
                interval: null,
                Start: function() {
                    this.interval = setInterval(function() {
                        seconds += 1;
                    }, 1000);
                },
                Stop: function() {
                    window.clearTimeout(this.interval);
                }
            }
            // Count cta clicks
            function countClicks() {
                $slickWindow.find('.' + settings.callToAction).each(function() {
                    $(this).on('click', function() {
                        clicks = 1;
                        views  = 0;
                    });
                });
            };
            // Send data
            function sendStats(views, clicks, seconds) {
                var statsDATA = {
                    id : $(self).attr('id'),
                    name: settings.modalName,
                    summary: settings.modalSummary,
                    click: clicks,
                    impression: views,
                    time: seconds,
                    isAjax: 1,
                    origin: window.location.origin || window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')
                };
                $.ajax({
                    url: settings.fileLocation,
                    type: 'POST',
                    data: JSON.stringify(statsDATA),
                    dataType: 'text',
                    contentType: 'application/json; charset=utf-8',
                    error: function() {
                        console.log('Data was not saved.');
                    }
                });
            };

            // Enable slick
            function enableSlick() {
                $(self).addClass('isActive');
                startPageEffects();
                addEffectClass();
                slickOnLoad();
                videoAutoplay();
                autoClosing();
                if (settings.enableStats) {
                    timer.Start();
                    views = 1;
                    sendStats(views, clicks, seconds);
                }
            };

            // Disable slick
            function disableSlick() {
                endPageEffects();
                removeEffectClass();
                removeContentClass();
                slickOnClose();
                videoStop();
                if (settings.enableStats) {
                    timer.Stop();
                    views   = 0;
                    sendStats(views, clicks, seconds);
                    clicks  = 0;
                    seconds = 0;
                }
                setTimeout(function() {
                    $(self).removeClass('isActive');
                }, (overlaySpeed + parseFloat(settings.popupAnimationDuration)) * 1000);
                if (typeof autoCloseTimer !== 'undefined') {
                    clearTimeout(autoCloseTimer);
                }
            };

            // Activate the modal
            if (canBeShown) {
                settings.mobileBreakPoint = parseInt(settings.mobileBreakPoint);
                // Initial elements
                showOverlay();
                appendCloseButton();
                activateESC();
                if (settings.showOnMobile) {
                    popupTypes();
                } else {
                    if ($(window).width() > settings.mobileBreakPoint) {
                        popupTypes();
                    }
                }
                popupStyling();
                cookieTriggers();
                wrapContent();
                if (settings.enableStats) {
                    countClicks();
                }
                // Close the modal
                $(self).find('.closeModal').on('click', function() {
                    disableSlick();
                });
                // Reopen the modal
                $('.' + settings.reopenClass).on('click', function() {
                    enableSlick();
                });
            }

        });
    }
}(jQuery));