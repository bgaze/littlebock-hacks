$(document).ready(function () {
    let ok = true;
    let weight = 0;
    let unit = 'g';
    let amount = 0;

    $('.items-list-container table tbody tr').each(function () {
        let w = /([\d.]+) (\w+)/.exec($('td:first', this).text().trim());
        if (w) {
            weight += (w[2] === 'kg') ? parseFloat(w[1]) * 1000 : parseFloat(w[1]);
        }

        let a = 0;
        if ($('.text-muted', this).text().length) {
            a = parseFloat($('.text-muted', this).text().trim().replace(/[^\d.]/g, ''));
            if (!isNaN(a)) {
                amount += a;
            }
        }

        if (!w || isNaN(a)) {
            console.log(w, a);
            ok = false;
            $(this).addClass('text-danger');
        }
    });

    if (weight > 1000) {
        weight /= 1000;
        unit = 'kg';
    }

    amount = Math.round(amount * 100) / 100;

    $(`<button type="button" class="btn btn-rounded btn-outline-${ok ? 'secondary' : 'danger'} disabled">`)
        .css('box-shadow', 'none')
        .html(ok ? `<strong>Stock total :</strong> ${weight} ${unit} (${amount} €)` : 'Impossible de calculer le stock.')
        .insertBefore('.btn[data-path]:first')
        .parent()
        .addClass('d-flex align-items-center justify-content-between');
});