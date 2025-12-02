$(document).ready(function() {

    $('a[href^="#"]').on('click', function(event) {
        event.preventDefault();
        
        var target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 70
            }, 1000);
        }
    });

    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 100) {
            $('.header').addClass('scrolled');
        } else {
            $('.header').removeClass('scrolled');
        }
    });

    $('.menu-toggle').on('click', function() {
        $('.nav').toggleClass('active');
    });

    $('.nav a').on('click', function() {
        $('.nav').removeClass('active');
    });

    setTimeout(function() {
        $('.hero-title').animate({
            opacity: 1,
            top: 0
        }, 800);
        
        $('.hero-subtitle').delay(300).animate({
            opacity: 1,
            top: 0
        }, 800);
        
        $('.hero .btn').delay(600).animate({
            opacity: 1,
            top: 0
        }, 800);
    }, 500);
    
    function animateOnScroll() {
        $('.service-card, .portfolio-item').each(function() {
            var elementTop = $(this).offset().top;
            var windowBottom = $(window).scrollTop() + $(window).height();
            
            if (elementTop < windowBottom - 50) {
                $(this).animate({
                    opacity: 1,
                    top: 0
                }, 800);
            }
        });
    }
    

    $(window).on('scroll', animateOnScroll);
    animateOnScroll();
    

    function animateCounters() {
        $('.stat-number').each(function() {
            var $this = $(this);
            var countTo = $this.attr('data-count');
            
            $({ countNum: 0 }).animate({
                countNum: countTo
            }, {
                duration: 2000,
                easing: 'swing',
                step: function() {
                    $this.text(Math.floor(this.countNum));
                },
                complete: function() {
                    $this.text(this.countNum);
                }
            });
        });
    }
    

    function checkCounters() {
        var aboutSection = $('.about');
        var aboutTop = aboutSection.offset().top;
        var windowBottom = $(window).scrollTop() + $(window).height();
        
        if (aboutTop < windowBottom - 100) {
            animateCounters();
            $(window).off('scroll', checkCounters);
        }
    }
    
    $(window).on('scroll', checkCounters);
    
    $('.contact-form').on('submit', function(event) {
        event.preventDefault();
        
        var form = $(this);
        var submitBtn = form.find('button[type="submit"]');
        var originalText = submitBtn.text();
        

        submitBtn.text('Отправка...').prop('disabled', true);
        

        setTimeout(function() {
            alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
            form[0].reset();
            submitBtn.text(originalText).prop('disabled', false);
        }, 2000);
    });
    

    $('.contact-form input, .contact-form textarea').on('blur', function() {
        var field = $(this);
        
        if (field.val().trim() === '') {
            field.addClass('error');
        } else {
            field.removeClass('error');
        }
    });
    

    $('<style>.error { border-color: #dc3545 !important; }</style>').appendTo('head');
    
});
