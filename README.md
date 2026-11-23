# Lebenslauf | Professionelle CV-Webanwendung

**Lebenslauf** ist eine moderne und dynamische Webanwendung zur Erstellung und Verwaltung von Lebensläufen (CVs). Ziel dieses Projekts ist es, eine flüssige und schnelle Benutzererfahrung zu bieten, mit der Sie Ihren beruflichen Werdegang, Ihre Ausbildung und Ihre Fähigkeiten optimal verwalten und präsentieren können.

## 🚀 Hauptfunktionen

- **Vollständige CV-Verwaltung (CRUD):** Erstellen, Anzeigen, Bearbeiten und Löschen von Berufserfahrungen, Ausbildungen und Fähigkeiten.
- **Hohe Performance:** Integriertes Caching-System (Redis) für sofortige API-Antworten und zur Entlastung der Datenbank.
- **Modernes Design:** Saubere, responsive und benutzerfreundliche Oberfläche mit Next.js und Tailwind CSS.
- **Skalierbare Architektur:** Modulares Design, das eine einfache Erweiterung der verschiedenen Lebenslauf-Bereiche ermöglicht.

## 🛠️ Verwendete Technologien

- **Frontend:** `Next.js` (React Framework)
- **Styling:** `Tailwind CSS`
- **Primäre Datenbank:** `CouchDB`
- **Caching-System:** `Redis` (zur Optimierung und Geschwindigkeitssteigerung)

## ⚙️ Voraussetzungen

Bevor Sie beginnen, stellen Sie bitte sicher, dass Folgendes installiert ist:

- `Node.js` (Version 18 oder höher)
- `Docker` (für die Ausführung der Container von CouchDB und Redis)

## 🚀 Schnellstart & Installation

Führen Sie die folgenden Befehle aus, um das Projekt auf Ihrem System zu starten:

```bash
# 1. Repository klonen
git clone https://github.com/Farah5613/team-farah-naz-mirzaie.git

# 2. In das Projektverzeichnis wechseln
cd team-farah-naz-mirzaie

# 3. Abhängigkeiten installieren
npm install

# 4. Datenbank und Caching-System starten (mit Docker)
docker compose up -d

# 5. Entwicklungsserver starten
npm run dev
```

📚 Technische Dokumentation

Für detaillierte Informationen zur Implementierung und Funktionsweise des Caching-Layers lesen Sie bitte die Datei REDIS_SETUP.md.
