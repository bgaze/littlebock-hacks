const site = window.location.hostname
const path = window.location.pathname;

function loadCss(file) {
    let el = document.createElement('link');
    el.setAttribute('rel', 'stylesheet');
    el.setAttribute('href', chrome.runtime.getURL(`assets/${file}.css`));
    document.body.append(el);
}

function loadJs(file) {
    let el = document.createElement('script');
    el.setAttribute('src', chrome.runtime.getURL(`assets/${file}.js`));
    document.body.append(el);
}

function loadJquery() {
    loadJs('jquery.slim.min');
}

if (site.includes('littlebock.fr')) {
    if (/^\/user\/brewery\/beer-product/.test(path)) {
        loadJquery();
        loadJs('beer-product');
    } else if (/^\/user\/brewery\/ingredient\/(fermentable|hop|yeast)/.test(path)) {
        loadJquery();
        loadJs('ingredients');
    } else if (/\/print\/?$/.test(path)) {
        loadCss('print');
        loadJquery();
        loadJs('print');
    }
}