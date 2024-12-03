const pages = [
    {
        pattern: /^\/user\/brewery\/beer-product/,
        scripts: ['beer-product.js']
    },
    {
        pattern: /^\/user\/brewery\/(ingredient|consumable)\//,
        scripts: ['ingredients.js']
    },
    {
        pattern: /\/print\/?$/,
        scripts: ['print.js'],
        styles: ['print.css']
    },
    {
        pattern: /\/user\/brewery\/recipe\/(\d+\/edit|new)\/?$/,
        scripts: ['recipe.js']
    },
    {
        pattern: /\/user\/brewery\/brew-session\/\d+\/brew-session-recipe\/\d+\/edit\/?$/,
        scripts: ['recipe.js']
    },
    {
        pattern: /\/user\/brewery\/brew-session\/\d+\/fermentation\/?$/,
        scripts: ['fermentation.js']
    }
];

function importAsset(file, callback) {
    let el, url = chrome.runtime.getURL(`assets/${file}`);

    if (/\.css$/.test(file)) {
        el = document.createElement('link');
        el.setAttribute('rel', 'stylesheet');
        el.setAttribute('href', url);
    } else if (/\.js$/.test(file)) {
        el = document.createElement('script');
        el.setAttribute('src', url);
    } else {
        throw `Invalid asset: ${file}`;
    }

    if (typeof callback === 'function') {
        el.addEventListener('load', callback);
    }

    (document.head || document.documentElement).append(el);
}

if (window.location.hostname.includes('littlebock.fr')) {
    let page = pages.find(page => page.pattern.test(window.location.pathname));

    if (page) {
        if (page.styles) {
            page.styles.forEach(file => importAsset(file));
        }

        if (page.scripts) {
            importAsset('jquery.min.js', function () {
                page.scripts.forEach(file => importAsset(file));
            });
        }
    }
}