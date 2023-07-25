$(document).ready(function () {
    let bottles = 0;
    let volume = 0;

    $('.items-list-container table tbody tr').each(function () {
        bottles += parseInt($('td:first div:first', this).text().replace(/[^\d]/g, ''));
        volume += parseFloat($('td:first div:last', this).text().replace(/[^\d.]/g, ''));
    });

    $(`<button type="button" class="btn btn-rounded btn-outline-secondary disabled">`)
        .css('box-shadow', 'none')
        .html(`<strong>Stock total :</strong> ${Math.round(volume * 100) / 100} L (${bottles} bouteilles)`)
        .insertBefore('.btn[data-path]:first')
        .parent()
        .addClass('d-flex align-items-center justify-content-between');
});