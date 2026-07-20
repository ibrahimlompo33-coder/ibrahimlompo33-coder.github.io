# Portfolio — LOMPO Ibrahim

Site vitrine statique (HTML/CSS/JS vanilla, sans dépendance de build).

## Avant publication : 3 remplacements à faire

1. **`index.html`** — remplacer les deux occurrences de
   `VOTRE-USERNAME` par votre identifiant GitHub réel, dans les liens de la
   carte projet "SaaS Ouaga".
2. **`index.html`** et **`js/app.js`** — remplacer
   `VOTRE_ID_FORMSPREE` par l'identifiant obtenu sur
   [formspree.io](https://formspree.io) (gratuit, aucune carte requise) pour
   que le formulaire de contact envoie réellement les messages. Sans cette
   étape, le formulaire affichera un message d'erreur à la soumission.

## Publication sur GitHub Pages

Pour un site personnel (`https://VOTRE-USERNAME.github.io`), le dépôt doit
s'appeler exactement `VOTRE-USERNAME.github.io`.

```bash
git init
git add .
git commit -m "Publication initiale du portfolio"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/VOTRE-USERNAME.github.io.git
git push -u origin main
```

Puis **Settings → Pages** : source = branche `main`, dossier `/(root)`
(déjà correct par défaut pour un dépôt `<username>.github.io`, aucune
configuration manuelle supplémentaire n'est nécessaire).

## Notes de nettoyage effectuées

- `node_modules/` (leaflet, mapbox-gl) retiré : aucune des deux librairies
  n'était chargée par `index.html` — dépendances mortes issues de
  `package.json`, qui a été retiré pour la même raison. Le site ne nécessite
  aucun build.
- `assets/images/profile.webp.png` était en réalité un PNG de 2,2 Mo, mal
  nommé (l'attribut `src` du HTML référence `profile.webp`, un fichier qui
  n'existait pas sur disque → l'image ne s'affichait pas). Remplacé par un
  véritable WebP compressé (~63 Ko, redimensionné à la taille d'affichage
  réelle de 300×300).
- Formulaire de contact connecté à Formspree (voir ci-dessus) : il ne faisait
  auparavant que simuler un succès côté client, sans transmettre aucune
  donnée.
