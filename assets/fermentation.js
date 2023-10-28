$(document).ready(function () {
    const $graph = $('#fermentation_log_chart');
    const $blocks = $graph.parents('.row').eq(1).find('> div');

    $blocks.attr('class', 'col-12').find('.card-box').addClass('p-2');
    $blocks.eq(0).addClass('order-2');
    $blocks.eq(1).addClass('order-1').find('.col-6').addClass('col-sm-3');

    $graph.height(400).width('100%');

    window.dispatchEvent(new Event('resize'));
});