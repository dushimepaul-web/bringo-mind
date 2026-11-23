<!-- Fichier généré par API/outils/generer_documentation.py : ne pas modifier à la main, relancer le script. -->

# Module Système

Routes techniques déclarées dans [app/main.py](../../app/main.py) · documentation générée le 19/11/2026 17:30.

**1 API** dans ce module. Conventions communes (enveloppe, jeton, pagination, langue, erreurs) : [../CONVENTIONS.md](../CONVENTIONS.md).

| État | Nombre |
|---|---|
| Terminée et opérationnelle | 1 |
| Terminée, sans test automatisé (à vérifier) | 0 |
| Terminée, en attente de configuration | 0 |
| Partiellement développée | 0 |
| Nécessite des corrections | 0 |

## Sommaire

**Supervision**

| ID | Méthode | Chemin | Nom | État | Testée |
|---|---|---|---|---|---|
| [API-SYS-001](#api-sys-001--état-de-santé-de-lapi) | GET | `/health` | État de santé de l'API | Terminée et opérationnelle | oui |

## Sous-module : Supervision

### API-SYS-001 — État de santé de l'API

| Élément | Valeur |
|---|---|
| Module | Système (`app/main.py`) |
| Sous-module | Supervision |
| Méthode | `GET` |
| Chemin | `/health` |
| Fonction | `health` — [app/main.py:93](../../app/main.py#L93) |
| Contrat OpenAPI | oui |
| État | **Terminée et opérationnelle** |
| Tests automatisés | oui, appelée par 1 test(s) (test_api_sans_test_auparavant) |
| Utilisée par l'interface web | non (supervision) |

**Description** (commentaire et docstring du code). Route de supervision (utilisee par deploy/healthcheck.sh) Supervision : l'API repond et la base de données est joignable

**Authentification et autorisations.**

- **Route publique** : aucun jeton d'accès exigé.
- Contrôle propre à cette route : Route de supervision, sans donnée personnelle.

**Paramètres.** Aucun paramètre de chemin, de requête ou d'en-tête déclaré.

**Validations.**

- Aucune donnée d'entrée à valider.

**Règles métier et traitements** (docstrings et commentaires du code, route puis fonctions de service appelées).

- Requete : test de connexion a la base de donnees
- Base injoignable : service degrade (503)
- E-22 : etat du worker (rappels, sauvegardes, purges) pour une surveillance externe ; reponse inchangee (200)

**Réponse en cas de succès.**

- Réponse directe hors enveloppe possible (JSONResponse) : fichier, flux, redirection ou réponse sans contenu selon le cas (voir le code).
- Code HTTP **200**.

**Codes HTTP possibles.**

| Code | Signification | Motifs relevés dans le code | Observé dans les tests (nombre de réponses) |
|---|---|---|---|
| `200` | Succès | succès | oui (1) |

Toute réponse d'erreur suit l'enveloppe commune `{statusCode, httpStatus, message, result}` ; 500 « Erreur interne du serveur » en cas d'erreur inattendue (journalisée, aucun détail exposé). Les motifs relevés dans le code couvrent la route et les fonctions qu'elle appelle (3 niveaux) : un motif d'une fonction partagée peut ne pas concerner tous les cas de cette route.

---
