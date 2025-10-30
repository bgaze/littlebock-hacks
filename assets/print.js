$(document).ready(function () {
    // Utils

    function slugify(string) {
        const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıİłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż';
        const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz';
        const p = new RegExp(a.split('').join('|'), 'g')

        return `${string}`
            .toLowerCase()
            .replace(p, c => b.charAt(a.indexOf(c)))
            .replace(/[^a-z0-9]/g, '-')
            .replace(/--+/g, '-')
            .replace(/(^-+|-+$)/, '');
    }

    function parseCells($cells, actions, debug) {
        $cells.each((i, el) => {
            let label = $(el).find('strong').text().replace(':', '').trim();
            let value = $(el).clone().children().remove().end().text().replace(':', '').trim();

            if (debug) {
                console.log(label, value);
            }

            if (typeof actions === 'function') {
                actions(value, label, el);
            } else if (typeof actions[label] === 'function') {
                actions[label](value, label, el);
            } else if (typeof actions[label] === 'string') {
                indicators[actions[label]][1] = value;
            }
        });
    }

    function makeIndicator(title, expected, input) {
        let html = `<p class="indicator m-0"><strong>${title}&nbsp;:</strong>`;

        if (expected !== false) {
            html += `<span class="expected">${expected || ''}</span>`;
        }

        if (input !== false) {
            html += `<span class="input">${input || ''}</span>`;
        }

        return html + `</p>`;
    }

    // Title

    $('.card-header')
        .addClass('mb-0 py-2 px-4 d-flex align-items-end')
        .removeClass('text-center')
        .append('<h5 class="ml-4 flex-grow-0 flex-shrink-0">Brassin n° _________</h5>')
        .append('<h5 class="ml-4 flex-grow-0 flex-shrink-0">Date de brassage : ____________________</h5>')
        .find('h1')
        .removeClass('my-1')
        .addClass('flex-grow-1 flex-shrink-1')
        .text($('.card-header h1').text().replace('Recette ', ''));

    // Intro

    let $intro = $('.card-bordered:first');
    $('<ul id="custom-intro" class="list-unstyled m-0">').append($('li', $intro)).appendTo($intro);
    $('> .row', $intro).remove();
    $('.profil-wrapper .col-2').each((i, el) => $('<li>').append($(el).html()).appendTo('#custom-intro'));

    // Recipe notes

    if ($('.presentation-wrapper > .row').text().trim() === '') {
        $('.presentation-wrapper > .row').remove();
    } else {
        $('.presentation-wrapper .notes').addClass('mb-0').addClass('mt-2');
    }

    // Add id to ingredients blocs

    $('.ingredient-wrapper h4').each(function () {
        $(this).parents('.ingredient-wrapper').attr('id', slugify($(this).text()));
    });

    $('#levures').insertBefore('#cereales-et-sucres');

    // Format ingredients blocs notes

    $('.ingredient-wrapper .notes').each(function () {
        let cols = $(this).parents('.table').find('tr:first th').length;
        $(this).parents('tr')
            .addClass('notes-row')
            .html(`<td colspan="${cols}" style="padding-top: 0 !important;">
                       <span class="text-muted notes">${$(this).html()}</span>
                   </td>`);
    });

    // Add checkboxes

    $('.ingredient-wrapper:not(#eau-profil-cible) > .table-responsive').each(function () {
        let cols = $('thead th', this).length;

        $('tbody tr:not(.notes-row)', this).each(function () {
            $('td:first', this).prepend('<i class="far fa-square mr-1" style="color: #000;"></i>');
        });
    });

    // Reduce water block

    $('#eau-profil-cible table th').each((i, el) => {
        $(`#eau-profil-cible table td:eq(${i})`).prepend(`<strong class="mr-2">${$(el).text()}&nbsp;:</strong>`);
    });
    $('#eau-profil-cible table tr:first').remove();

    // Move dry hopping value to intro

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

    // Init steps

    let $mash = $('.ingredient-wrapper:last + .row > .col-6:first');
    let $boil = $('.ingredient-wrapper:last + .row > .col-6:last');
    let $ferm = $('.ingredient-wrapper:last + .row + .row > .col-12');

    $(`<div id="steps" class="row">
            <div id="mash" class="col-4">
                <h4 class="mb-2"><i class="mdi mdi-thermometer-lines mr-1"></i> Empâtage</h4>
                <table class="indicators"></table>
            </div>
            <div id="boil" class="col-4">
                <h4 class="mb-2"><i class="mdi mdi-fire mr-1"></i> Ébullition</h4>
                <table class="indicators"></table>
            </div>
            <div id="fermentation" class="col-4">
                <h4 class="mb-2"><i class="mdi mdi-chart-bubble mr-1"></i>Fermentation</h4>
                <div class="fermenting mb-3">
                    <table class="indicators"></table>
                </div>
                <h4 class="mb-2"><i class="mdi mdi-bottle-wine mr-1"></i>Conditionnement</h4>
                <div class="conditioning">
                    <table class="indicators"></table>
                </div>
            </div>
        </div>`).insertAfter('.ingredient-wrapper:last');

    let indicators = {
        ph: ['pH', '', ''],
        pre_boil_volume: ['Volume avant ébullition', '', ''],
        pre_boil_gravity: ['Densité avant ébullition', '', ''],

        post_boil_volume: ['Volume après ébullition', false, ''],
        post_boil_gravity: ['Densité après ébullition', '', ''],
        original_volume: ['Volume en fermenteur', '', ''],
        original_gravity: ['Densité initiale', '', ''],

        final_gravity: ['Densité finale', '', ''],
        final_volume: ['Volume conditionné', false, ''],
        sugar: ['Resucrage', false, ''],
        abv: ['Taux d’alcool', '', ''],
    };

    // Mash

    if ($('em', $mash).length) {
        let text = $('em', $mash).text().trim().replace(/\n\s*/g, '<br>');
        if (text !== '') {
            $(`<em class="notes d-block mb-2">${text}</em>`).insertAfter('#mash h4');
        }
    }

    $('.recipe-timeline', $mash).addClass('m-0').insertBefore('#mash .indicators');

    parseCells($('.col-6 .col-6', $mash), {
        ['Ratio eau/grain de départ']: v => $('#mash h4').append(` ( ${v} )`),
        'pH cible': 'ph',
    });


    // Boil

    $('.recipe-timeline', $boil).addClass('m-0').insertBefore('#boil .indicators');

    parseCells($('.col-4 .col-12', $boil), {
        ['Volume d\'ébullition']: 'pre_boil_volume',
        ['Temps d\'ébullition']: v => $('#boil h4').append(` ( ${v} )`),
        ['Densité avant ébullition']: 'pre_boil_gravity',
    });

    // Fermentation

    if ($('em', $ferm).length) {
        let text = $('em', $ferm).text().trim().replace(/\n\s*/g, '<br>');
        if (text !== '') {
            $(`<em class="notes d-block mb-2">${text}</em>`).insertBefore('#fermentation .fermenting');
        }
    }

    parseCells($('> .row > div', $ferm), (v, l) => {
        switch (l) {
            case 'Primaire':
            case 'Secondaire':
            case 'Tertiaire':
                $('#fermentation .fermenting').append(makeIndicator(l, v, false));
                break;
            case 'Garde en bouteille':
            case 'Carbonatation':
                $('#fermentation .conditioning').append(makeIndicator(l, v, false));
                break;
        }
    });

    $('#fermentation .fermenting')
        .append(makeIndicator('Début de fermentation', false, ''))
        .append(makeIndicator('Garde à froid', false, ''))
        .append(makeIndicator('Dry hopping', false, ''))
        .append(makeIndicator('Fin de fermentation', false, ''));

    $('#fermentation .conditioning')
        .append(makeIndicator('Date de conditionnement', false, ''))
        .append(makeIndicator('Bières conditionnées', false, ''));


    // Misc indicators

    parseCells($('.profil-wrapper > .row > div'), {
        'DI est.': v => {
            indicators.post_boil_gravity[1] = v;
            indicators.original_gravity[1] = v;
        },
        'DF est.': v => indicators.final_gravity[1] = v,
        'Alcool est.': v => indicators.abv[1] = v.replace('alc./vol.', ''),
    });

    let buGuRatio = false;

    parseCells($('#custom-intro li'), {
        'Volume': 'original_volume',
        'Fermentation': (v, l, el) => $(el).remove(),
        'Ratio IBU/DI': (v, l, el) => {
            $(el).remove();
            buGuRatio = v;
        },
        'IBU': (v, l, el) => {
            let bu = parseInt(v);
            let og = parseFloat(indicators.original_gravity[1]);
            let fg = parseFloat(indicators.final_gravity[1]);

            if (buGuRatio) {
                $(el).append(`<span class="mx-1">|</span><strong>IBU/DI&nbsp;:</strong> ${buGuRatio}`);
            }

            if (bu && og && fg && og > 1) {
                let gu = (og * 1000) - 1000;
                let adf = (og - fg) / (og - 1);
                let rbr = Math.round((bu / gu) * (1 + (adf - 0.7655)) * 1000) / 1000;

                $(el).append(`<span class="mx-1">|</span><strong>RBR&nbsp;:</strong> ${rbr}`);
            }
        }
    });

    $('#steps').after(`<div id="indicators" class="row">
        <div class="col-4">
            ${makeIndicator(...indicators.ph)}
            ${makeIndicator(...indicators.pre_boil_volume)}
            ${makeIndicator(...indicators.pre_boil_gravity)}
        </div>
        <div class="col-4">
            ${makeIndicator(...indicators.post_boil_volume)}
            ${makeIndicator(...indicators.post_boil_gravity)}
            ${makeIndicator(...indicators.original_volume)}
            ${makeIndicator(...indicators.original_gravity)}
        </div>
        <div class="col-4">
            ${makeIndicator(...indicators.final_gravity)}
            ${makeIndicator(...indicators.final_volume)}
            ${makeIndicator(...indicators.sugar)}
            ${makeIndicator(...indicators.abv)}
        </div>
    </div>`);

    // Cleanup.

    $mash.parent().remove();
    $ferm.parent().remove();
    $('.profil-wrapper').remove();
});