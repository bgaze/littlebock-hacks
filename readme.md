# Littlebock Hacks

Cette extension pour Google Chrome ou Chromium permet d'effectuer les modifications suivantes dans l'interface de Littlebock :

- **Impression d'une recette :** modification de la mise en page pour être plus compacte et tenir plus facilement sur une seule page ([voir un exemple](https://raw.githubusercontent.com/bgaze/littlebock-hacks/main/assets/recipe.pdf)).
- **Stocks > Matières premières :** 
  - affichage du stock total et de son coût total dans les onglets "Céréales et sucres", "Houblons" et "Levures".
  - affichage du coût total du stock dans l'onglet "Divers".
- **Stocks > Consommables :** affichage du coût total du stock.
- **Stocks > Bières conditionnées :** affichage du stock total en litres et en nombre de bouteilles.
- **Edition d'une recette :**
  - Réorganisation des sections : "A propos", "Levures" et "Empâtage" avant la sélection des ingrédients.
  - Affichage d'un résumé des volumes de la recette.
  - Calcul et affichage du Relative Bitterness Ratio (RBR)  
_Un lien redirige vers un référentiel des RBR par style._
  - Affichage du poids total pour les fermentescibles et les houblons.
  - Ajustement du poids total des fermentescibles.  
_La valeur saisie est dispatchée dans les céréales en conservant les proportions de la recette._
  - Ajustement du poids des houblons pour atteindre un IBU cible.  
_Le poids de chaque houblon est ajusté pour atteindre la valeur saisie en conservant les proportions de la recette._
- **Suivi d'un brassin :** réorganisation des blocs et agrandissement du graphique.

**Attention :**

C'est une extension que j'ai créée pour mes propres besoins, et selon mes propres préférences.  
Toute [remarque / demande d'amélioration](https://github.com/bgaze/littlebock-hacks/issues) est la bienvenue cependant, si elles seront toutes examinées, je ne m'engage en aucun cas à les satisfaire.

L'extension ne fonctionne que dans Google Chrome ou Chromium et aucun support ne sera apporté pour d'autres navigateurs.

Aucune publication dans le Chrome Web Store ne sera effectuée.

**Installation :**

1. Télécharger l'archive de l'extension : [télécharger](https://github.com/bgaze/littlebock-hacks/archive/refs/heads/main.zip)
2. Extraire l'archive dans un répertoire adéquat.
3. Dans Chrome, afficher le gestionnaire d'extensions (**Menu > Extensions > Gérer les extensions**).
4. En haut à droite, activer le **Mode développeur**.
5. Cliquer sur **Charger l'extension non empaquetée** et sélectionner le répertoire précédemment créé.

L'extension est désormais active.  
Si des pages de Littlebock sont ouvertes dans votre navigateur, il faudra les recharger pour voir les effets de l'extension.