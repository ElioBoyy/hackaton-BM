
# Blackmotion Hackaton r/Place





## Stack technique

**Client:** React, Next, TailwindCSS

**Serveur:** Node, AdonisJS6 | Websocket

**BDD:** MySQL



## Installation

Installer avec node(v20.12.2) npm(v10.5.0):

Dand les deux fichiers du git, executer : 
`npm i`

Client :
`npm run dev`
(ou `npm build` puis `npm start`)

Serveur :

1.`cd wsserver/server.js` puis `node server.js`

2.Importez un .env, `cd npm run dev` (ou `npm run build` mais n'oubliez pas d'my mettre le fichier wsserver)


## A savoir

J'ai décidé de coder sur un front React NextJs pour sa rapidité de création. Etant pressé par le temps, j'ai préféré me focaliser sur le développement de l'API.
J'ai décidé de créer l'API en Node AdonisJS6 car c'est un framework qui fait beaucoup parler de lui aujourd'hui, je n'en avais jamais fait auparavant donc je voulais aussi me challenger, je n'avais jamais backé d'application en NodeJs non plus, je l'ai trouvé parfait pour mon utilisation.

De plus, **Blackmotion** utilise un stack nodejs alors j'ai voulu **me former dessus**.

En espérant que mon travail saura vous convaincre, merci!



# Tout le contenu ci-dessous a été rendu à 15:30, à prendre ou non en compte. Merci



# Documentation de l'API

Cette API permet de gérer mon r/Place.


## Routes - User

### Obtenir tous les utilisateurs

- **Méthode**: GET
- **URL**: `/api/users`
- **Description**: Récupère la liste de tous les utilisateurs.
- **Réponse**:
  - **Code de statut**: 200 (OK)
  - **Corps de la réponse**: Liste des utilisateurs

### Obtenir un utilisateur par ID

- **Méthode**: GET
- **URL**: `/api/users/:id`
- **Description**: Récupère les détails d'un utilisateur spécifique en fonction de son ID.
- **Paramètres**:
  - `id`: L'ID de l'utilisateur.
- **Réponse**:
  - **Code de statut**: 200 (OK) si l'utilisateur est trouvé, 404 (Not Found) sinon.
  - **Corps de la réponse**: Détails de l'utilisateur

### Vérifier si un nom d'utilisateur existe

- **Méthode**: GET
- **URL**: `/api/users/username/:username`
- **Description**: Vérifie si un nom d'utilisateur spécifique existe déjà.
- **Paramètres**:
  - `username`: Le nom d'utilisateur à vérifier.
- **Réponse**:
  - **Code de statut**: 200 (OK) avec `true` si le nom d'utilisateur existe, `false` sinon.

### Vérifier si un email existe

- **Méthode**: GET
- **URL**: `/api/users/email/:email`
- **Description**: Vérifie si un email spécifique existe déjà.
- **Paramètres**:
  - `email`: L'email à vérifier.
- **Réponse**:
  - **Code de statut**: 200 (OK) avec `true` si l'email existe, `false` sinon.

### Mettre à jour un utilisateur

- **Méthode**: PUT
- **URL**: `/api/users/:id`
- **Description**: Met à jour les informations d'un utilisateur spécifique.
- **Paramètres**:
  - `id`: L'ID de l'utilisateur à mettre à jour.
- **Corps de la requête**:
  - `username`: Le nouveau nom d'utilisateur (optionnel).
  - `email`: Le nouveau email (optionnel).
  - `password`: Le nouveau mot de passe (optionnel).
- **Réponse**:
  - **Code de statut**: 200 (OK) si la mise à jour est réussie, 400 (Bad Request) avec un message d'erreur si la validation échoue, 404 (Not Found) si l'utilisateur n'est pas trouvé.

### Supprimer un utilisateur

- **Méthode**: DELETE
- **URL**: `/api/users/:id`
- **Description**: Supprime un utilisateur spécifique.
- **Paramètres**:
  - `id`: L'ID de l'utilisateur à supprimer.
- **Réponse**:
  - **Code de statut**: 200 (OK) avec le message 'Utilisateur supprimé.' si la suppression est réussie, 404 (Not Found) si l'utilisateur n'est pas trouvé.


## Routes - Auth

### S'inscrire

- **Méthode**: POST
- **URL**: `/api/user/register`
- **Description**: Crée un nouvel utilisateur et génère un token d'accès.
- **Corps de la requête**:
  - `email`: L'email de l'utilisateur.
  - `password`: Le mot de passe de l'utilisateur.
- **Réponse**:
  - **Code de statut**: 201 (Created) avec le token d'accès et les informations de l'utilisateur si l'inscription est réussie, 400 (Bad Request) avec un message d'erreur si la validation échoue.

### Se connecter

- **Méthode**: POST
- **URL**: `/api/user/login`
- **Description**: Authentifie un utilisateur et génère un token d'accès.
- **Corps de la requête**:
  - `email`: L'email de l'utilisateur.
  - `password`: Le mot de passe de l'utilisateur.
- **Réponse**:
  - **Code de statut**: 200 (OK) avec le token d'accès et les informations de l'utilisateur si la connexion est réussie, 400 (Bad Request) avec un message d'erreur si la validation échoue.

### Se déconnecter

- **Méthode**: POST
- **URL**: `/api/user/logout`
- **Description**: Déconnecte l'utilisateur actuellement connecté.
- **Réponse**:
  - **Code de statut**: 200 (OK) avec le message 'Déconnecté' si la déconnexion est réussie, 401 (Unauthorized) avec un message d'erreur si l'utilisateur n'est pas connecté.

### Obtenir les informations de l'utilisateur connecté

- **Méthode**: GET
- **URL**: `/api/user/me`
- **Description**: Récupère les informations de l'utilisateur actuellement connecté.
- **Réponse**:
  - **Code de statut**: 200 (OK) avec les informations de l'utilisateur si l'utilisateur est connecté, 401 (Unauthorized) avec un message d'erreur si l'utilisateur n'est pas connecté.


## Routes - Bonus

### Obtenir tous les bonus

- **Méthode**: GET
- **URL**: `/api/userbonuses`
- **Description**: Récupère la liste de tous les bonus.
- **Réponse**:
  - **Code de statut**: 200 (OK)
  - **Corps de la réponse**: Liste des bonus

### Obtenir un bonus par ID

- **Méthode**: GET
- **URL**: `/api/userbonuses/:id`
- **Description**: Récupère les détails d'un bonus spécifique en fonction de son ID.
- **Paramètres**:
  - `id`: L'ID du bonus.
- **Réponse**:
  - **Code de statut**: 200 (OK) si le bonus est trouvé, 404 (Not Found) sinon.
  - **Corps de la réponse**: Détails du bonus

### Créer un bonus

- **Méthode**: POST
- **URL**: `/api/userbonuses`
- **Description**: Crée un nouveau bonus.
- **Corps de la requête**:
  - `name`: Le nom du bonus.
- **Réponse**:
  - **Code de statut**: 201 (Created) avec le bonus créé, 400 (Bad Request) avec un message d'erreur si la validation échoue.

### Supprimer un bonus

- **Méthode**: DELETE
- **URL**: `/api/userbonuses/:id`
- **Description**: Supprime un bonus spécifique.
- **Paramètres**:
  - `id`: L'ID du bonus à supprimer.
- **Réponse**:
  - **Code de statut**: 200 (OK) avec le message 'Bonus supprimé.' si la suppression est réussie, 404 (Not Found) si le bonus n'est pas trouvé.


## Routes - Grid

### Obtenir toutes les grilles

- **Méthode**: GET
- **URL**: `/api/grids`
- **Description**: Récupère la liste de toutes les grilles.
- **Réponse**:
  - **Code de statut**: 200 (OK)
  - **Corps de la réponse**: Liste des grilles

### Obtenir une grille par ID

- **Méthode**: GET
- **URL**: `/api/grids/:id`
- **Description**: Récupère les détails d'une grille spécifique en fonction de son ID.
- **Paramètres**:
  - `id`: L'ID de la grille.
- **Réponse**:
  - **Code de statut**: 200 (OK) si la grille est trouvée, 404 (Not Found) sinon.
  - **Corps de la réponse**: Détails de la grille

### Obtenir le propriétaire d'une grille par ID

- **Méthode**: GET
- **URL**: `/api/grids/user/:id`
- **Description**: Récupère le nom d'utilisateur du propriétaire d'une grille spécifique en fonction de son ID.
- **Paramètres**:
  - `id`: L'ID de la grille.
- **Réponse**:
  - **Code de statut**: 200 (OK) avec le nom d'utilisateur du propriétaire, 404 (Not Found) si la grille n'est pas trouvée.

### Obtenir une grille par URL

- **Méthode**: GET
- **URL**: `/api/grids/url/:url`
- **Description**: Récupère les détails d'une grille spécifique en fonction de son URL.
- **Paramètres**:
  - `url`: L'URL de la grille.
- **Réponse**:
  - **Code de statut**: 200 (OK) si la grille est trouvée, 404 (Not Found) sinon.
  - **Corps de la réponse**: Détails de la grille

### Créer une grille

- **Méthode**: POST
- **URL**: `/api/grids`
- **Description**: Crée une nouvelle grille.
- **Corps de la requête**:
  - `title`: Le titre de la grille.
  - `grid_duration`: La durée de la grille.
  - `user_id`: L'ID de l'utilisateur propriétaire de la grille.
- **Réponse**:
  - **Code de statut**: 201 (Created) avec la grille créée, 400 (Bad Request) avec un message d'erreur si la validation échoue.

### Mettre à jour le titre d'une grille

- **Méthode**: PUT
- **URL**: `/api/grids/:id/title`
- **Description**: Met à jour le titre d'une grille spécifique.
- **Paramètres**:
  - `id`: L'ID de la grille à mettre à jour.
- **Corps de la requête**:
  - `title`: Le nouveau titre de la grille.
- **Réponse**:
  - **Code de statut**: 200 (OK) avec la grille mise à jour, 400 (Bad Request) avec un message d'erreur si la validation échoue.

### Mettre à jour le statut d'une grille

- **Méthode**: PUT
- **URL**: `/api/grids/:id/status`
- **Description**: Met à jour le statut d'une grille spécifique.
- **Paramètres**:
  - `id`: L'ID de la grille à mettre à jour.
- **Réponse**:
  - **Code de statut**: 200 (OK) avec la grille mise à jour, 404 (Not Found) si la grille n'est pas trouvée.

### Supprimer une grille

- **Méthode**: DELETE
- **URL**: `/api/grids/:id`
- **Description**: Supprime une grille spécifique.
- **Paramètres**:
  - `id`: L'ID de la grille à supprimer.
- **Réponse**:
  - **Code de statut**: 200 (OK) avec le message 'Grille supprimée.' si la suppression est réussie, 404 (Not Found) si la grille n'est pas trouvée.


## Routes - Pixel history

### Obtenir tous les historiques de pixels

- **Méthode**: GET
- **URL**: `/api/pixelhistories`
- **Description**: Récupère la liste de tous les historiques de pixels.
- **Réponse**:
  - **Code de statut**: 200 (OK)
  - **Corps de la réponse**: Liste des historiques de pixels

### Obtenir un historique de pixel par ID

- **Méthode**: GET
- **URL**: `/api/pixelhistories/:id`
- **Description**: Récupère les détails d'un historique de pixel spécifique en fonction de son ID.
- **Paramètres**:
  - `id`: L'ID de l'historique de pixel.
- **Réponse**:
  - **Code de statut**: 200 (OK) si l'historique de pixel est trouvé, 404 (Not Found) sinon.
  - **Corps de la réponse**: Détails de l'historique de pixel

### Créer un historique de pixel

- **Méthode**: POST
- **URL**: `/api/pixelhistories`
- **Description**: Crée un nouvel historique de pixel.
- **Corps de la requête**:
  - `grid_id`: L'ID de la grille associée à l'historique de pixel.
  - `x`: La position x du pixel.
  - `y`: La position y du pixel.
  - `color`: La couleur du pixel.
- **Réponse**:
  - **Code de statut**: 201 (Created) avec l'historique de pixel créé, 400 (Bad Request) avec un message d'erreur si la validation échoue.

### Supprimer un historique de pixel

- **Méthode**: DELETE
- **URL**: `/api/pixelhistories/:id`
- **Description**: Supprime un historique de pixel spécifique.
- **Paramètres**:
  - `id`: L'ID de l'historique de pixel à supprimer.
- **Réponse**:
  - **Code de statut**: 200 (OK) avec le message 'Historique de pixel supprimé.' si la suppression est réussie, 404 (Not Found) si l'historique de pixel n'est pas trouvé.


## Routes - Pixel

### Obtenir tous les pixels

- **Méthode**: GET
- **URL**: `/api/pixels`
- **Description**: Récupère la liste de tous les pixels.
- **Réponse**:
  - **Code de statut**: 200 (OK)
  - **Corps de la réponse**: Liste des pixels

### Obtenir un pixel par ID

- **Méthode**: GET
- **URL**: `/api/pixels/:id`
- **Description**: Récupère les détails d'un pixel spécifique en fonction de son ID.
- **Paramètres**:
  - `id`: L'ID du pixel.
- **Réponse**:
  - **Code de statut**: 200 (OK) si le pixel est trouvé, 404 (Not Found) sinon.
  - **Corps de la réponse**: Détails du pixel

### Obtenir tous les pixels d'une grille

- **Méthode**: GET
- **URL**: `/api/pixels/grid/:gridId`
- **Description**: Récupère la liste de tous les pixels associés à une grille spécifique.
- **Paramètres**:
  - `gridId`: L'ID de la grille.
- **Réponse**:
  - **Code de statut**: 200 (OK) avec la liste des pixels, 404 (Not Found) si la grille n'est pas trouvée.

### Obtenir un pixel par coordonnées dans une grille

- **Méthode**: GET
- **URL**: `/api/pixels/grid/:x/:y/:gridId`
- **Description**: Récupère les détails d'un pixel spécifique dans une grille en fonction de ses coordonnées x et y.
- **Paramètres**:
  - `x`: La position x du pixel.
  - `y`: La position y du pixel.
  - `gridId`: L'ID de la grille.
- **Réponse**:
  - **Code de statut**: 200 (OK) si le pixel est trouvé, 404 (Not Found) sinon.
  - **Corps de la réponse**: Détails du pixel

### Créer un pixel

- **Méthode**: POST
- **URL**: `/api/pixels`
- **Description**: Crée un nouvel pixel.
- **Corps de la requête**:
  - `gridId`: L'ID de la grille associée au pixel.
  - `userId`: L'ID de l'utilisateur associé au pixel.
  - `x`: La position x du pixel.
  - `y`: La position y du pixel.
  - `color`: La couleur du pixel.
- **Réponse**:
  - **Code de statut**: 201 (Created) avec le pixel créé, 400 (Bad Request) avec un message d'erreur si la validation échoue.

### Supprimer un pixel

- **Méthode**: DELETE
- **URL**: `/api/pixels/:id`
- **Description**: Supprime un pixel spécifique.
- **Paramètres**:
  - `id`: L'ID du pixel à supprimer.
- **Réponse**:
  - **Code de statut**: 200 (OK) avec le message 'Pixel supprimé.' si la suppression est réussie, 404 (Not Found) si le pixel n'est pas trouvé.

### Supprimer un pixel par coordonnées dans une grille

- **Méthode**: DELETE
- **URL**: `/api/pixels/grid/:x/:y/:gridId`
- **Description**: Supprime un pixel spécifique dans une grille en fonction de ses coordonnées x et y.
- **Paramètres**:
  - `x`: La position x du pixel.
  - `y`: La position y du pixel.
  - `gridId`: L'ID de la grille.
- **Réponse**:
  - **Code de statut**: 200 (OK) avec le message 'Pixel supprimé.' si la suppression est réussie, 404 (Not Found) si le pixel n'est pas trouvé.


## Routes - User bonus

### Obtenir tous les bonus d'utilisateurs

- **Méthode**: GET
- **URL**: `/api/userbonuses`
- **Description**: Récupère la liste de tous les bonus d'utilisateurs.
- **Réponse**:
  - **Code de statut**: 200 (OK)
  - **Corps de la réponse**: Liste des bonus d'utilisateurs

### Obtenir un bonus d'utilisateur par ID

- **Méthode**: GET
- **URL**: `/api/userbonuses/:id`
- **Description**: Récupère les détails d'un bonus d'utilisateur spécifique en fonction de son ID.
- **Paramètres**:
  - `id`: L'ID du bonus d'utilisateur.
- **Réponse**:
  - **Code de statut**: 200 (OK) si le bonus d'utilisateur est trouvé, 404 (Not Found) sinon.
  - **Corps de la réponse**: Détails du bonus d'utilisateur

### Créer un bonus d'utilisateur

- **Méthode**: POST
- **URL**: `/api/userbonuses`
- **Description**: Crée un nouveau bonus d'utilisateur.
- **Corps de la requête**:
  - `userId`: L'ID de l'utilisateur associé au bonus.
  - `bonusId`: L'ID du bonus associé à l'utilisateur.
  - `gridId`: L'ID de la grille associée au bonus.
- **Réponse**:
  - **Code de statut**: 201 (Created) avec le bonus d'utilisateur créé, 400 (Bad Request) avec un message d'erreur si la validation échoue.

### Supprimer un bonus d'utilisateur

- **Méthode**: DELETE
- **URL**: `/api/userbonuses/:id`
- **Description**: Supprime un bonus d'utilisateur spécifique.
- **Paramètres**:
  - `id`: L'ID du bonus d'utilisateur à supprimer.
- **Réponse**:
  - **Code de statut**: 200 (OK) avec le message 'Bonus d'utilisateur supprimé.' si la suppression est réussie, 404 (Not Found) si le bonus d'utilisateur n'est pas trouvé.