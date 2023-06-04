$(document).ready(function () {
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

    $(`<button type="button" class="btn btn-rounded btn-outline-${ok ? 'secondary' : 'danger'} disabled">`)
        .css('box-shadow', 'none')
        .html(ok ? `<strong>Stock total :</strong> ${sum} ${unit}` : 'Impossible de calculer le stock.')
        .insertBefore('.btn[data-path]:first')
        .parent()
        .addClass('d-flex align-items-center justify-content-between');
});