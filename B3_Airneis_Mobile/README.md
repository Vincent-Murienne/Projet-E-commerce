# Mise en place du projet mobile Android

## Pré-requis

- **Android Studio**
  - [Lien vers le téléchargement d'Android Studio](https://developer.android.com/studio?hl=fr)

## Installation

1. **Ouvrir le projet**
   - Ouvrez le dossier `B3_Airneis_Mobile` au sein d'Android Studio.

2. **Charger le projet**
   - Patientez le temps qu'Android Studio lise tous les fichiers du projet et télécharge les dépendances de Gradle.

3. **Créer un appareil virtuel**
   - Créez un appareil virtuel pour émuler l'application.
   - Nous vous conseillons d'utiliser le Pixel 7.
   - Pour l'image du système, choisissez une version de l'API entre 28 et 34 (34 étant la version recommandée, soit UpsideDownCake).

4. **Lancer l'application**
   - Une fois l'appareil installé, lancez l'application. Elle devrait automatiquement se lancer dans votre appareil virtuel.

5. **VolleyError**
   - Si vous avez ouvert le projet Android avant de lancer le back-end, il se peut que vous rencontriez une erreur de Volley qui n'arrive pas à accéder au back-end. Pour résoudre cela, il vous suffit simplement de relancer Android Studio. Si l'erreur persiste, fermer tout Android Studio, Visual Studio Code ou si vous avez lancé le serveur PHP depuis un simple terminal le terminal en question. Puis relancer le serveur PHP et seulement après, Android Studio.

## Back-end

- Vous devrez aussi lancer le back-end pour que l'application fonctionne entièrement. Pour cela, veuillez vous référer au fichier README présent dans le dossier `Back-end`.

