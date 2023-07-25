(function ($) {
    const misc = /^\/user\/brewery\/(ingredient\/misc|consumable)/.test(window.location.pathname);

    function getWeight($tr) {
        let w = /([\d.]+) (\w+)/.exec($('td:first', $tr).text().trim());

        if (w) {
            return (w[2] === 'kg') ? parseFloat(w[1]) * 1000 : parseFloat(w[1]);
        }

        $('td:first', $tr).addClass('text-danger cannot-parse-value');

        return false;
    }

    function getAmount($tr) {
        let amount = 0;

        if ($('.text-muted', $tr).text().length) {
            amount = parseFloat($('.text-muted', $tr).text().trim().replace(/[^\d.]/g, ''));

            if (isNaN(amount)) {
                $('.text-muted', $tr).removeClass('text-muted').addClass('text-danger cannot-parse-value');
                return false;
            }
        }

        return amount;
    }

    $(document).ready(function () {
        let weight = 0;
        let unit = 'g';
        let amount = 0;

        $('.items-list-container table tbody tr').each(function () {
            let w = misc ? 0 : getWeight($(this));
            if (w !== false) {
                weight += w;
            }

            let a = getAmount($(this));
            if (a !== false) {
                amount += a;
            }
        });

        let content = 'Impossible de calculer le total.';
        let style = 'danger';

        if (!$('.items-list-container table tbody tr .cannot-parse-value').length) {
            style = 'secondary';
            amount = Math.round(amount * 100) / 100;

            if (misc) {
                content = `<strong>Montant total :</strong> ${amount} €`;
            } else {
                if (weight > 1000) {
                    weight /= 1000;
                    unit = 'kg';
                }

                content = `<strong>Stock total :</strong> ${weight} ${unit} (${amount} €)`;
            }
        }

        $(`<button type="button" class="btn btn-rounded btn-outline-${style} disabled">`)
            .css('box-shadow', 'none')
            .html(content)
            .insertBefore('.btn[data-path]:first')
            .parent()
            .addClass('d-flex align-items-center justify-content-between');
    });
}(jQuery))
