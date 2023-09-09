function getIbu() {
    let ibu = 0;

    $('#hops .info-data-hops-ibu').each(function () {
        if (!isNaN(parseFloat($(this).text()))) {
            ibu += parseFloat($(this).text());
        }
    });

    return ibu;
}

function makeTotalWidget(container, unit) {
    let $parent = $(`#${container}`).parent();

    let $div = $('<div class="d-flex align-item-center justify-content-between mb-2" style="border-bottom: 1px solid #eceff1;">').prependTo($parent);

    $('h4.header-title', $parent).addClass('m-0').appendTo($div).append(`<span id="${container}-total-amount" class="total-amount d-inline-block ml-1">`);

    $div.append(`  <div id="${container}-total-widget" class="remove-wrapper d-flex align-item-center ml-3">
                        <div class="form-group mb-0 mr-1">
                            <div class="input-group">
                                <input type="text" class="form-control" value="" style="width: 100px;" placeholder="Total">
                                <div class="input-group-append">
                                    <div class="input-group-text">${unit}</div>
                                </div>
                            </div>
                        </div>
                        <button type="button" class="btn btn-sm btn-primary" style="height: 31px"><i class="mdi mdi-arrow-right-bold"></i></button>
                    </div>`);
}

function manageTotalAmount(container, items, unit, format) {
    let sum = 0;
    let ok = true;

    $(items, `#${container}`).each(function () {
        let val = parseFloat($(this).val().replace(',', '.'));

        if (!isNaN(val)) {
            sum += val;
        } else {
            ok = false;
        }
    });

    if (ok) {
        sum = Math.round(sum * format) / format;
    }

    $(`#${container}-total-widget`).toggleClass('d-none', !(ok && sum > 0)).toggleClass('d-flex', ok && sum > 0);

    $(`#${container}-total-amount`)
        .toggleClass('text-danger', !ok)
        .text(ok ? `(${sum} ${unit})` : '(erreur !)')
        .data('total', ok ? sum : false);
}

function computeBasedOnTotal(container, items, currentTotal, format) {
    let $input = $(`#${container}-total-widget input`).removeClass('is-invalid');

    let newTotal = parseFloat($input.val().replace(',', '.'));
    if (isNaN(newTotal) || newTotal <= 0) {
        $input.addClass('is-invalid').focus();
        return;
    }

    $(items).each(function () {
        let value = parseFloat($(this).val().replace(',', '.'))
        $(this).val(Math.round(value / currentTotal * newTotal * format) / format);
    });

    $input.val('');
}

function makeSummaryWidgets() {
    let observer = new MutationObserver(function (mutations) {
        let $container = $('#profile_standard');
        if ($container.length && !$('#volumes-widget').length) {
            $('> .mb-1', $container).removeClass('mb-1');
            $container.append(`<div id="rbr-widget"></div><hr><div id="volumes-widget"></div>`);
        }
    });

    observer.observe(document, {attributes: false, childList: true, characterData: false, subtree: true});
}

function makeSummaryRow(widget, title, value) {
    if (typeof value === 'function') {
        value = value();
    }

    if (value) {
        $(`#${widget}-widget`).append(`<div class="row">
            <div class="col-8"><strong>${title}</strong></div>
            <div class="col-4 text-right"><strong>${value}</strong></div>
        </div>`);
    }
}

function parseVolumeInput($el) {
    if (!($el instanceof jQuery)) {
        $el = $($el);
    }

    if ($el.length && $el.is('input') && $el.val() !== '') {
        let value = parseFloat($el.val());

        if (!isNaN(value) && value > 0) {
            return `${value} L`;
        }
    }

    return false;
}

function refreshSummaryVolumes() {
    let $widget = $('#volumes-widget');
    if ($widget.length) {
        $widget.empty();

        $('#mashsteps > li').each(function () {
            if ($('.fields-infusion', this).is(':visible')) {
                let label = ($(this).index() === 0) ? 'Volume d\'empâtage' : $('.mash-step-name', this).val();
                label += ` (${$('.mash-step-infuse-temp', this).val()}°C)`;
                makeSummaryRow('volumes', label, parseVolumeInput($('.mash-step-infuson-amount', this)));
            }
        });

        makeSummaryRow('volumes', `Volume de rinçage (${$('#app_recipe_mash_spargeTemp').val()}°C)`, parseVolumeInput('#app_recipe_mash_spargeSize'));

        makeSummaryRow('volumes', 'Volume pré-ébullition', parseVolumeInput('#app_recipe_boilSize'));

        makeSummaryRow('volumes', 'Volume en fermenteur', parseVolumeInput('#app_recipe_batchSize'));
    }
}

function refreshSummaryRbr() {
    let $widget = $('#rbr-widget');
    if ($widget.length) {
        $widget.empty();

        let title = `Relative Bitterness Ratio 
                           <a href="https://docs.google.com/spreadsheets/d/1sxEsKbCpKzyVOkt6iXQCN5Cmut2Dz7mspO8qZmOsamU" target="_blank">
                               <i class="mdi mdi-help-circle text-info"></i>
                           </a>`

        makeSummaryRow('rbr', title, function () {
            let bu = getIbu();
            let og = parseFloat($('#profile_standard .text-info:eq(0)').text());
            let fg = parseFloat($('#profile_standard .text-info:eq(1)').text());

            if (bu && og && fg && og > 1) {
                let gu = (og * 1000) - 1000;
                let adf = (og - fg) / (og - 1);
                return Math.round((bu / gu) * (1 + (adf - 0.7655)) * 1000) / 1000;
            }

            return false;
        });
    }
}

$(document).ready(function () {
    // Reorder recipe steps.
    $('#mashsteps').parents('#form_recipe > .row').insertAfter('#form_recipe > .row:first');
    $('#yeasts').parents('#form_recipe > .row').insertAfter('#form_recipe > .row:first');

    // Init fermentables & hops total widget
    makeTotalWidget('fermentables', 'kg');
    makeTotalWidget('hops', 'IBU');

    // Init volumes summary widget
    makeSummaryWidgets();

    // Set fermentables total amount
    $('#fermentables-total-widget button').click(function () {
        computeBasedOnTotal('fermentables', '.fermentable-amount', $(`#fermentables-total-amount`).data('total'), 1000);
    });

    // Set hops total IBU
    $('#hops-total-widget button').click(function () {
        computeBasedOnTotal('hops', '.hop-amount', getIbu(), 1);
    });

    // Tick to synchronize widgets
    setInterval(function () {
        manageTotalAmount('fermentables', '.fermentable-amount', 'kg', 1000);
        manageTotalAmount('hops', '.hop-amount', 'g', 10);
        refreshSummaryRbr();
        refreshSummaryVolumes();
    }, 500);
});

