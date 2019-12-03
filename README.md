## Prerequisites

- Avoir npm installé
- Avoir NodeJS installé
- Avoir Mysql installé

## Installation

- Tout le `code` requit pour démarrer

### Clone

- Cloner le repo sur votre machine local en utilisant `https://github.com/ryugan/memory`

### Setup

> Lancer une installation npm

```shell
$ npm install
```

> Configurer le serveur

- Éditer le fichier `config.json`
- Dans `development`, éditer avec votre configuration MySQL les lignes `db_user`, `password`, `host`, `port`

> Démarrer le serveur

```shell
$ npm start
```

## FAQ

- **Comment installer la base de données ?**
    - Pas de problème ! Elle s'installe automatiquement s'il y a besoin.

- **Mon user de base de données n'a pas les droits sur la base memory.scores**
    - Adapter la commande suivante avec votre propre user
    `GRANT ALL PRIVILEGES ON memory.* TO 'dbuser'@'localhost';
    FLUSH PRIVILEGES;`

- **Comment effacer les scores ?**
    - Lance MySQL et exécute la commande suivante `DELETE FROM memory.scores;`.
    - Sinon j'accepte les chèques et les virements paypal

- **Comment faire ? J'ai perdu, j'ai dit ne pas vouloir continuer à jouer et finalement j'ai changé d'avis... mais le jeu est bloqué !**
    - Il n'y a pas de mal à changer d'avis ! Place-toi sur le site et tape sur `F5`
    - Sinon tu peux aussi changer le nombre de cartes
