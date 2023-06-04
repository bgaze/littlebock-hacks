function manageTotalAmount(container, items, unit) {
    let $parent = $(container).parent();

    if (!$('.total-amount', $parent).length) {
        $('h4.header-title', $parent).append('<span class="total-amount d-inline-block ml-1">');
    }

    let sum = 0;
    let ok = true;

    $(items).each(function () {
        let val = parseFloat($(this).val().replace(',', '.'));

        if (!isNaN(val)) {
            sum += val;
        } else {
            ok = false;
        }
    });

    $('.total-amount', $parent).toggleClass('text-danger', !ok).text(ok ? `(${sum} ${unit})` : '(erreur !)');
}

$(document).ready(function () {
    // Reorder recipe steps.
    $('#mashsteps').parents('#form_recipe > .row').insertAfter('#form_recipe > .row:first');
    $('#yeasts').parents('#form_recipe > .row').insertAfter('#form_recipe > .row:first');

    // Manage fermentables & hops total
    setInterval(function () {
        manageTotalAmount('#fermentables', '.fermentable-amount', 'kg');
        manageTotalAmount('#hops', '.hop-amount', 'g');
    }, 500);
});