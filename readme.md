# Installation

Installer l'extension Chrome [Custom JavaScript for Websites 2](https://chrome.google.com/webstore/detail/custom-javascript-for-web/ddbjnfjiigjmcpcpkmhogomapikjbjdk
).

Ouvrir l'extension et pour plus de confort cliquer sur `Open in New Tab` tout en haut.

## Etape 1

Créer un nouveau script en cliquant sur `New RegExp`.  
Dans la fenêtre qui s'ouvre copier-coller `https:\/\/www\.littlebock\.fr\/.+\/print` puis valider en cliquant sur `Add`.  

> Celà permet de préciser à l'extension qu'elle ne doit modifier que les pages d'impression de Littlebock.

## Etape 2

En haut à droite, dérouler le menu intitulé `You can inject your own external scripts or predefined one` et sélectionner `jQuery 3.2.1`.

## Etape 3

**Important :** dans la zone en bas supprimer le texte en gris : `// Here You can type your custom JavaScript...`.

Copier-coller dans cette zone tout le contenu du fichier [script.js](./script.js).

Cliquez sur `Save` tout en haut à gauche pour enregistrer.

Désormais, la mise en pages des impressions de Littlebock sera automatiquement améliorée.