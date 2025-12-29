# NextOne - Frontend

![CI/CD Staging Status](https://github.com/WildCodeSchool/2411-wns-vert-groupe-4-nextone-front/actions/workflows/frontend-deploy-staging.yml/badge.svg?branch=staging)
![Security Scan](https://img.shields.io/badge/S%C3%A9curit%C3%A9-OWASP%20ZAP-brightgreen)
![Accessibility Scan](https://img.shields.io/badge/Accessibilit%C3%A9-WCAG%202.1%20AA-blue)

NextOne est une application de gestion de file d’attente développée dans le cadre de la formation de la Wild Code School.
Ce projet a été réalisé en collaboration avec quatre développeurs en alternance afin de mettre en pratique
l’ensemble des compétences acquises tout au long de l’année.

---

## 🌟 Points forts de NextOne

- **🕒 Gain de temps** : plus de longues attentes, chaque visiteur sait exactement quand c’est son tour.
- **⚙️ Organisation optimisée** : les opérateurs gèrent les files facilement grâce à une vision claire et actualisée.
- **📡 Communication en temps réel** : les subscriptions assurent une synchronisation instantanée entre toutes les interfaces.
- **💡 Expérience moderne et accessible** : solution adaptable à différents types de structures (mairies, banques, hôpitaux, etc.).

---

## 🖥️ Composants principaux

- **Borne d’accueil** : utilisée par les visiteurs, elle permet de prendre un ticket après avoir rempli un formulaire.
- **Écran d’affichage des tickets** : permet aux visiteurs de visualiser les tickets en cours d’appel.
- **Dashboard administrateur** :
  - Pour l’opérateur : gestion des tickets et création de nouveaux tickets.
  - Pour l’administrateur : vue complète du système, gestion des opérateurs et services, consultation des statistiques, en plus des fonctionnalités opérateurs.

---

## ⚛️ Technologies utilisées

- **React + TypeScript + Vite** : pour construire des interfaces utilisateur dynamiques, modernes et réactives.
- **Vitest** : pour un testing et un maintient durable de l'application.
- **Shadcn/UI & Tailwind CSS** : composants réutilisables et style cohérent pour un développement rapide.
- **Context API** : gestion efficace de l’état de l’application.

---

## 🎨 Conception de l’interface

L’objectif de l’interface est d’offrir une expérience claire, cohérente et agréable.

### Charte graphique

- **Couleurs principales** :
  - Vert profond (#1F2511) : modernité
  - Vert citron (#B5E303) : énergie et dynamisme
- **Typographie** : Archivo, lisible et contemporaine, pour renforcer la clarté visuelle.
- **Logo** : une flèche stylisée orientée vers la droite, représentant le mouvement, la fluidité et la progression, valeurs clés de la gestion de file d’attente.

---

## ⚡ Setup du projet

### Sans Docker

1. **Installation des dépendances**

npm install

2. **Fichier d'environnement**

VITE_API_URL= l'url de l'API

3. **Démarrer le projet**

npm run dev

### Avec Docker
docker-compose up (lancement du back et front en même temps)
