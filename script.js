(function ($) {
    function callIfCurrentUrlMatches(pattern, callback) {
        if ((new RegExp(`^https:\\/\\/www\\\\.littlebock\\.fr\\/${pattern}`)).test(window.location.href)) {
            callback();
        }
    }

    function insertTotalButton(content, style) {
        let $sibling = $('.btn[data-path]:first');

        $sibling.parent().addClass('d-flex align-items-center justify-content-between');

        $sibling.before(`<button type="button" class="total-button btn btn-rounded btn-outline-${style || ''} disabled">${content}</button>`);

        $('.total-button').css('box-shadow', 'none');
    }

    function computeIngredientsTotalStock() {
        let sum = 0;
        let unit = 'g';
        let ok = true;

        $('.items-list-container table tbody tr').each(function () {
            let parse = /([\d.]+) (\w+)/.exec($('td:first', this).text().trim());

            if (parse) {
                sum += (parse[2] === 'kg') ? parseFloat(parse[1]) * 1000 : parseFloat(parse[1]);
            } else {
                ok = false;
                $(this).addClass('text-danger');
            }
        });

        if (sum > 1000) {
            sum /= 1000;
            unit = 'kg';
        }

        insertTotalButton(ok ? `<strong>Stock total :</strong> ${sum} ${unit}` : `Impossible de calculer le stock.`);
    }

    function computeBeerProductTotalStock() {
        let bottles = 0;
        let volume = 0;

        $('.items-list-container table tbody tr').each(function () {
            bottles += parseInt($('td:first div:first', this).text().replace(/[^\d]/g, ''));
            volume += parseFloat($('td:first div:last', this).text().replace(/[^\d.]/g, ''));
        });

        insertTotalButton(`<strong>Stock total :</strong> ${Math.round(volume * 100) / 100} L (${bottles} bouteilles)`);
    }

    function enhanceRecipePrintStyles() {
        $(`<style>
.card-header{
    padding-top: 0;
    padding-bottom: 0;
    margin-bottom: 2rem;
}

.recipe-sheet-print{
    margin-bottom: 0 !important;
}

.card-bordered{
    padding: .5rem;
    margin-bottom: 1rem;
}

h4{
    margin-top: 1.5rem !important;
    margin-bottom: 1rem !important;
}

#custom-intro{
    display: flex;
    flex-wrap: wrap;
}

#custom-intro li{
    flex-basis: 33.33%;
    padding-right: .5rem;
}

.table-wrapper{
    margin: 0 !important;
    padding: .25rem 0 !important;
}

.table-wrapper table{
    margin: 0 !important;
}

.table-wrapper table th{
    background: none !important;
    text-transform: none !important;
    color: #6c757d !important;
    font-weight: bold !important;
    font-size: .875rem !important;
    padding: .25rem .5rem !important;
}

.table-wrapper table td{
    padding: .25rem .5rem !important;
}

.table-wrapper table th:last-child, .table-wrapper table td:last-child{
   //display: none;
}

#steps{
    margin-bottom: 1.5rem;
}

#steps .recipe-timeline{
    padding-left: 10px;
}

@media print {
    .card-body.p-4{
        padding: 0 !important;
    }
}
</style>`).appendTo('head');
    }

    function enhanceRecipePrintDOM() {
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
    }

    callIfCurrentUrlMatches('.+\\/print', enhanceRecipePrintStyles);

    $(document).ready(function () {
        callIfCurrentUrlMatches('.+\\/print', enhanceRecipePrintDOM);
        callIfCurrentUrlMatches('user\\/brewery\\/ingredient\\/(fermentable|hop|yeast)', computeIngredientsTotalStock);
        callIfCurrentUrlMatches('user\\/brewery\\/beer-product', computeBeerProductTotalStock);
    });
}(jQuery))