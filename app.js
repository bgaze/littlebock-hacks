const pages = [
    {
        pattern: /^\/user\/brewery\/beer-product/,
        assets: ['beer-product.js']
    },
    {
        pattern: /^\/user\/brewery\/(ingredient|consumable)\//,
        assets: ['ingredients.js']
    },
    {
        pattern: /\/print\/?$/,
        assets: ['print.css', 'print.js']
    },
    {
        pattern: /\/user\/brewery\/recipe\/(\d+\/edit|new)\/?$/,
        assets: ['recipe.js']
    },
    {
        pattern: /\/user\/brewery\/brew-session\/\d+\/brew-session-recipe\/\d+\/edit\/?$/,
        assets: ['recipe.js']
    }
];

function makeStylesheet(file) {
    let el = document.createElement('link');
    el.setAttribute('rel', 'stylesheet');
    el.setAttribute('href', chrome.runtime.getURL(`assets/${file}`));
    return el;
}

function makeScript(file) {
    let el = document.createElement('script');
    el.setAttribute('src', chrome.runtime.getURL(`assets/${file}`));
    return el;
}

if (window.location.hostname.includes('littlebock.fr')) {
    let page = pages.find(page => page.pattern.test(window.location.pathname));

    if (page) {
        page.assets
            .filter(file => /\.css$/.test(file))
            .forEach(file => document.head.append(makeStylesheet(file)));

        let scripts = page.assets.filter(file => /\.js$/.test(file));

        if (scripts.length) {
            let jquery = makeScript('jquery.min.js');

            jquery.addEventListener('load', () => {
                scripts.forEach((file) => document.body.append(makeScript(file)));
            });

            document.body.append(jquery);
        }
    }
}