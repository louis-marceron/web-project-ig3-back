# Modèle d'API avec Express

Ceci est un modèle d'API pour le projet web en IG3 à Polytech Montpellier (2022 - 2023). Le serveur utilise Node JS avec le framework Express.

## Table des matières

- [Les technologies utilisées](#les-technologies-utilisées)
- [La structure des fichiers](#la-structure-des-fichiers)
- [Déploiement de l'application sur Dokku](#installation-et-exécution-de-lapplication)
- [Travail à apporter](#travail-à-apporter)
- [Test de l'API](#test-de-lapi)

## Les technologies utilisées

**Node.js :** environnement d'exécution JavaScript qui permet d'exécuter du JavaScript en dehors d'un navigateur web.
Pour exécuter un fichier JavaScript, tapez `node mon_fichier.js`
comme vous le feriez en Python avec la commande `python mon_fichier.py`.

**NPM (Node Package Manager) :** gestionnaire de paquets (librairies) pour Node.js. Il est utilisé pour les intaller avec leurs dépendances (comme pip en Python). Lorsque vous initialisez un projet Node.js avec `npm init`, un fichier package.json est créé. Il garde la trace des métadonnées de votre projet, des paquets et de leurs dépendances. Utilisez `npm install` pour installer les paquets et leurs dépendances.

Les outils suivants sont des librairies installées à l'aide de NPM :

**express :** framework qui simplifie le processus de gestion des requêtes et réponses HTTP.

**nodemon :** module qui redémarre automatiquement le serveur lorsque le code est modifié. Il n'est utilisé qu'en local, dans un environnement de développement.

**dotenv :** outil qui charge les variables d'environnement depuis le fichier .env. Les variables d'environnement sont des variables accessibles depuis n'importe où dans votre projet, qui stockent des informations sensibles telles que les informations d'identification de la base de données.
⚠️ Le fichier .env ne doit jamais être envoyé sur un repository Git distant pour des raisons de sécurité.

**helmet :** middleware qui aide à sécuriser vos applications Express en définissant divers en-têtes HTTP.

**sequelize :** ORM (Object Relational Mapping) qui permet de gérer les bases de données relationnelles. Il permet de créer des modèles qui correspondent aux tables de la base de données sous forme d'objet JSON, et de créer des requêtes SQL à partir de ces modèles.

## La structure des fichiers

**controllers/ :** Contient le code responsable de la gestion des entrées utilisateur, de l'interaction avec les modèles et du renvoi des réponses appropriées.

**middleware/ :** Contient des fonctions exécutées entre la requête et la réponse pour des tâches telles que l'authentification, la gestion des erreurs et la validation des requêtes.

**models/ :** Contient la logique pour interagir avec la base de données.

**routes/ :** Contient les définitions des routes et leurs contrôleurs associés. Séparer les routes permet de gérer, mettre à jour et tester plus facilement les points de terminaison individuels.

**app.js :** Initialise l'application, configure les middlewares et les routes. Ce fichier sert de point central pour configurer votre application.

**index.js :** Le point d'entrée de l'application, responsable du démarrage du serveur et de l'écoute des requêtes entrantes.

## Installation et exécution de l'application

### Prérequis

Installez Node.js : https://nodejs.org/

Si vous comptez utiliser Github, vous pouvez créer un repository à partir de ce modèle en cliquant sur le bouton "Use this template" en haut à droite de la page.

### Exécution en local

1.  Accédez à la racine du projet et installez les paquets et leurs dépendances :

        npm install

2. Installez postgresql sur votre machine

3. Créez une base de données avec le nom de votre choix

4. Créez un fichier .env à la racine du projet et ajoutez-y les informations de connexion à la base de données :

        DATABASE_URL=postgres://<username>:<password>@localhost:5432/<database_name>

4.  Démarrez l'application :

        npm run dev

5.  Ouvrez votre navigateur et accédez à http://localhost:3000 (ou le port spécifié dans le .env) pour accéder à l'application.

### Déploiement sur Dokku

Le guide donné par Polytech : https://docs.google.com/document/d/1XUHSBpwVw_dUV-9H2Ou-Ve_Gat0HmM0y3o8NaIOx1H4/edit
1. Envoyez votre clef ssh publique à Luca pour qu'il la dépose sur Dokku.
2. Créez l'application en remplaçant `mon-application` par le nom de votre application :

        ssh dokku@cluster-ig3.igpolytech.fr apps:create mon-application
                
   ⚠️ Pour que la connexion ssh puisse marcher, il faut qu'il y ait dans votre ordinateur la clef ssh privée correspondant à la clef publique que vous avez envoyé à Luca.
   
3. Passez votre site un https :

        ssh dokku@cluster-ig3.igpolytech.fr letsencrypt:enable mon-application
	
4. Ajoutez les variables d'environnement sur Dokku. C'est là qu'on mettra les identifiants de connexion à la BD. Pour l'instant, on va indiquer que l'on est dans un environnement de production (environnement où l'application est déployée et mise à disposition aux utilisateurs) :

        ssh dokku@cluster-ig3.igpolytech.fr config:set mon-application NODE_ENV=production

5. Créez une base de données pour votre application en remplaçant `ma-bd` par le nom de votre base de données:

        ssh dokku@cluster-ig3.igpolytech.fr postgres:create ma-bd

6. Reliez la base de données à votre application :

        ssh dokku@cluster-ig3.igpolytech.fr postgres:link ma-bd mon-application

7. Sur votre projet Git en local, ajouter une remote vers le serveur Dokku :

        git remote add dokku dokku@cluster-ig3.igpolytech.fr:mon-application

8. Poussez votre code sur le serveur avec cette commande : 
	`git push dokku`

9. Pour tester l'api, vous pouvez ajouter des données à la base de données. Pour cela connectez vous à la base de données avec la commande suivante :
`ssh dokku@cluster-ig3.igpolytech.fr postgres:connect ma-bd`, puis ajoutez des données à la base de données avec les commandes suivantes :
        
        INSERT INTO books (title, author)
        VALUES ('1984', 'George Orwell');

        INSERT INTO Book (title, author)
        VALUES ('Le Petit Prince', 'Antoine de Saint-Exupery');

        INSERT INTO Book (title, author)
        VALUES ('Les Miserables', 'Victor Hugo');

10. Vous pouvez enfin tester l'api en utilisant l'adresse suivante : `http://mon-application.cluster-ig3.igpolytech.fr/books` 

## Travail à apporter

1. Pour des raisons de sécurité, il faut faire passer le serveur http en serveur https afin de sécuriser l'échange de requêtes. (WIP)

2. Afin de gérer des utilisateurs dans notre api, nous vous proposons les articles suivants: - [Authentification utilisateurs (OpenClassrooms)](https://openclassrooms.com/fr/courses/6390246-passez-au-full-stack-avec-node-js-express-et-mongodb/6466459-optimisez-la-structure-du-back-end) - [Forgot password functionality (Medium)](https://cinquewebdev.medium.com/how-to-implement-forgot-password-functionality-with-jwt-authentication-e1381263026c)
   Attention: ces ressources peuvent comporter des erreurs ou ne pas utiliser les mêmes librairies que vous

## Test de l'API

Une fois les routes de notre API configurées dans notre backend, il nous faut les tester. Pour cela vous pouvez utilier soit [Insomnia](https://insomnia.rest/), soit [Postman](https://www.postman.com/).

1. L'adresse du serveur est: http://localhost:3000/

2. La route permettant d'effectuer des requètes REST sur les livres de la base de données est : "/books"

3. Nous utiliserons donc l'URL "http://localhost:3000/books" afin de travailler avec les livres de notre base de données

4. Tester l'API avec les méthodes (CRUD entre parenthèses) GET (Read), POST (Create), PUT (Update), DELETE (Delete). Le serveur accepte les requètes sous format FORM URL ENCODED et JSON) - GET prend ou pas un argument dans l'URL - POST ne prend pas d'arguments dans l'URL mais nécessite des données envoyées dans le body de la requête - PUT prend un argument dans l'URL et nécessite des données dans le body de la requête - DELETE prend un argument dans l'URL

| Method |         Argument          |       Header       |        Body        |
| :----: | :-----------------------: | :----------------: | :----------------: |
|  GET   | :white_check_mark: OR :x: | :white_check_mark: |        :x:         |
|  POST  |            :x:            | :white_check_mark: | :white_check_mark: |
|  PUT   |    :white_check_mark:     | :white_check_mark: | :white_check_mark: |
| DELETE |    :white_check_mark:     | :white_check_mark: |        :x:         |
