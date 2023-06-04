$(document).ready(function () {
    $('.card-header h1').text($('.card-header h1').text().replace('Recette ', ''));

    let $intro = $('.card-bordered:first');
    $('<ul id="custom-intro" class="list-unstyled m-0">').append($('li', $intro)).appendTo($intro);
    $('> .row', $intro).remove();

    if ($('.presentation-wrapper > .row').text().trim() === '') {
        $('.presentation-wrapper > .row').remove();
    }

    $('.ingredient-wrapper > .table-responsive + .row').each(function () {
        let content = $(this).text().trim();

        if (content.includes(':')) {
            let tmp = /([^:]+:)(.*)/.exec(content);
            if (tmp && tmp[1] && tmp[2]) {
                content = `<strong>${tmp[1]}</strong>${tmp[2]}`;
            }
        }

        $('<li>').html(content).appendTo('#custom-intro');
        $(this).remove();
    });

    // Steps

    let $mash = $('.ingredient-wrapper:last + .row > .col-6:first');
    let $boil = $('.ingredient-wrapper:last + .row > .col-6:last');
    let $ferm = $('.ingredient-wrapper:last + .row + .row > .col-12');

    $(`<div id="steps" class="row">
                <div id="mash" class="col-4"></div>
                <div id="boil" class="col-4"></div>
                <div id="fermentation" class="col-4"></div>
            </div>`).insertAfter('.ingredient-wrapper:last');

    // Mash

    $('h4', $mash).removeClass('text-center').prepend('<i class="mdi mdi-thermometer-lines mr-1"></i>').appendTo('#mash');
    if ($('em', $mash).length) {
        $(`<em class="notes d-block mb-2">${$('em', $mash).text().trim().replace(/\n\s*/g, '<br>')}</em>`).appendTo('#mash');
    }
    $('.col-6 .col-6', $mash).each(function () {
        $('<p class="m-0">').html($(this).html()).appendTo('#mash');
    });
    $('.recipe-timeline', $mash).addClass('mt-2 mb-0').appendTo('#mash');

    // Boil

    $('h4', $boil).removeClass('text-center').prepend('<i class="mdi mdi-fire mr-1"></i>').appendTo('#boil');
    $('.col-4 .col-12', $boil).each(function () {
        $('<p class="m-0">').html($(this).html()).appendTo('#boil');
    });
    $('.recipe-timeline', $boil).addClass('mt-2 mb-0').appendTo('#boil');

    // Fermentation

    $('h4', $ferm).removeClass('text-center').prepend('<i class="mdi mdi-chart-bubble mr-1"></i>').appendTo('#fermentation');
    if ($('em', $ferm).length) {
        $(`<em class="notes d-block mb-2">${$('em', $ferm).text().trim().replace(/\n\s*/g, '<br>')}</em>`).appendTo('#fermentation');
    }
    $('> .row', $ferm).each(function () {
        let $tmp = $('<div class="mb-2">').appendTo('#fermentation');
        $('> div', $(this)).each((index, el) => {
            let content = ((index === 0) ? $(el).html() : $(el).text()).trim();
            if (index === 1) {
                content += '_____';
            }
            $('<p class="m-0">').html(content).appendTo($tmp);
        });
    });
    $('#fermentation > div:last').removeClass('mb-2');

    // Cleanup
    $mash.parent().remove();
    $ferm.parent().remove();
});