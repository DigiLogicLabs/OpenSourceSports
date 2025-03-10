# OpenSourceSports (OSS)

A collaborative platform for standardized sports rules and regulations, featuring both official and custom sports through a modern web interface and GitHub version control.

## About OSS

OpenSourceSports provides a structured, version-controlled repository of sports rules with an accompanying web platform at opensourcesports.io. We combine GitHub's robust tracking capabilities with a user-friendly interface to make sports rules accessible and maintainable.

**Official Sports**: Professionally regulated sports with established governing bodies (FIFA, NBA, UFC, NFL, NHL). Rules are strictly maintained according to official standards and regulatory requirements.

**Custom Sports**: Community-created sports and variations, developed through collaborative effort and real-world testing. These represent innovation in gameplay and community-driven rule development.

## Repository Structure Guidelines

### Core Structure

The repository follows a two-branch structure for Official and Custom sports:

```
OpenSourceSports/
├── Official/
│   ├── metadata.json
│   ├── [Category]/
│   │   ├── metadata.json
│   │   ├── [Sport]/
│   │   │   ├── metadata.json
│   │   │   ├── [Organization]_[RuleType].html
│   │   │   └── archive/
│   │   │       └── [Organization]_[RuleType]_[Year].html
└── Custom/
    ├── metadata.json
    ├── [Category]/
    │   ├── metadata.json
    │   └── [Sport]/
    │       ├── metadata.json
    │       └── [SportName]_[RuleType].html
```

### Metadata Files

Each directory should contain a `metadata.json` file with information about its contents:

**Root metadata.json example:**
```json
{
  "repository_name": "OpenSourceSports",
  "description": "A collaborative platform for standardized sports rules and regulations",
  "maintainers": ["username1", "username2"],
  "last_updated": "2024-02-26"
}
```

**Category metadata.json example:**
```json
{
  "name": "Combat Sports",
  "description": "Sports that involve one-on-one combat",
  "type": "OFFICIAL",
  "maintainers": ["username1", "username2"],
  "created_at": "2023-06-15T00:00:00Z"
}
```

**Sport metadata.json example:**
```json
{
  "name": "Boxing",
  "category": "Combat Sports",
  "type": "OFFICIAL",
  "description": "A combat sport in which two people compete using only their fists.",
  "governing_bodies": ["WBA", "WBC", "IBF", "WBO"],
  "tags": ["olympic", "professional", "amateur"],
  "created_at": "2023-06-15T00:00:00Z",
  "created_by": "admin"
}
```

## Naming Conventions

### Directory Names

- **Categories**: Use Title Case with spaces (e.g., "Combat Sports", "Team Sports")
- **Sport Names**: Use Title Case with spaces (e.g., "Boxing", "Soccer")
- **Special Characters**: Avoid special characters except hyphens for complex names (e.g., "End-Zone-Exchange")

### File Names

#### Official Sports Files

Pattern: `[Organization]_[RuleType]_[OptionalYear].html`

Examples:
- `WBA_Official_Rulebook.html` (current rules)
- `NFL_Official_Rulebook_2024.html` (specific year version)
- `FIFA_Laws_of_Game.html` (type-specific rules)
- `IIHF_Competition_Rules.html` (competition-specific rules)

Rule Types include:
- `Official_Rulebook`: Primary rulebook for the sport
- `Competition_Rules`: Rules specific to competitions
- `Officials_Manual`: Guidelines for referees/officials
- `Safety_Protocol`: Safety-related rules and guidelines

#### Custom Sports Files

Pattern: `[SportName]_[RuleType].html`

Examples:
- `End_Zone_Exchange_Game_Rules.html` (basic rules)
- `Thumb_Wrestling_Tournament_Rules.html` (tournament format)
- `Beerpong_Variant_College.html` (specific variant)

Rule Types include:
- `Game_Rules`: Basic rules for playing the sport
- `Tournament_Rules`: Rules for tournament formats
- `Variant_[VariantName]`: Specific variations of the sport

### Archive Structure

For Official sports, archived versions should be stored in an `archive` subdirectory:

```
Official/
└── Team Sports/
    └── Football/
        ├── NFL_Official_Rulebook.html (current version)
        └── archive/
            ├── NFL_Official_Rulebook_2023.html
            ├── NFL_Official_Rulebook_2022.html
```

## HTML Content Structure

Every rule file should follow this basic structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sport Name - Rule Type</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <!--
  METADATA
  {
    "sport": "Sport Name",
    "category": "Sport Category",
    "type": "OFFICIAL/CUSTOM",
    "governingBody": "Organization Name",
    "version": "1.0",
    "lastUpdated": "2024-02-26",
    "author": "Author Name",
    "tags": ["tag1", "tag2"]
  }
  -->
  
  <header>
    <h1>Sport Name - Official Rulebook</h1>
    <p class="governing-body">Governing Body: Organization Name</p>
    <p class="last-updated">Last Updated: February 26, 2024</p>
  </header>
  
  <main>
    <!-- Rule content sections -->
    <section id="section-1">
      <h2>Section 1: Introduction</h2>
      <p>Content goes here...</p>
    </section>
  </main>
  
  <footer>
    <p>© 2024 OpenSourceSports</p>
  </footer>
</body>
</html>
```

### Required Metadata

The HTML metadata section is required and should be placed in an HTML comment at the top of the `<body>` tag. This metadata is used by the sync system to properly categorize and index the content.

```html
<!--
METADATA
{
  "sport": "Boxing",
  "category": "Combat Sports",
  "type": "OFFICIAL",
  "governingBody": "WBA",
  "version": "1.0",
  "lastUpdated": "2024-02-26",
  "author": "admin",
  "tags": ["professional", "championship", "sanctioned"]
}
-->
```

### Required Sections

Each HTML file should include these standard sections:

1. **Introduction**: Overview and basic information
2. **Equipment**: Required equipment and specifications
3. **Playing Area**: Field/court/ring dimensions and setup
4. **Players/Officials**: Number of players, roles, officials
5. **Rules of Play**: Core rules and mechanics
6. **Scoring**: How points are awarded
7. **Violations/Penalties**: Rules infractions and consequences
8. **Safety Considerations**: Safety guidelines and precautions

## Repository Management & Contribution Flow

### Source of Truth

This repository serves as the **official source of truth** for all OpenSourceSports rules and regulations. To maintain consistency and quality:

- **No Direct PRs**: Do not fork this repository or create pull requests directly against it unless explicitly authorized by the OpenSourceSports team.
- **No Direct Edits**: Direct edits to this repository are restricted to authorized maintainers only.

### Official Submission Process

All submissions and updates must be made through the **opensourcesports.io application**:

1. **Web Platform Submission**:
   - Create an account on [opensourcesports.io](https://opensourcesports.io)
   - Use the dedicated submission interface
   - Complete all required fields and sections
   - Submit for review through the platform

2. **Technical Implementation**:
   - The opensourcesports.io app (React/Supabase) interacts with this repository via GitHub webhooks and tokens
   - All submissions are validated, formatted, and standardized before being committed
   - Changes are tracked and attributed to the submitting user
   - Versioning is handled automatically by the system

3. **Manual Interventions**:
   - In rare cases, the OpenSourceSports team may make direct updates to address critical issues
   - These interventions follow strict internal protocols and approval processes

## Versioning System

### Official Sports

Version tracking for official sports follows the annual rulebook updates:

1. **Current Version**: Always stored in the main rule file (e.g., `NFL_Official_Rulebook.html`)
2. **Historical Versions**: Stored in the archive directory with year suffix
3. **Mid-Year Updates**: Handled via version field in metadata (e.g., "2024.2")

### Custom Sports

Version tracking for custom sports:

1. **Semantic Versioning**: Use `major.minor.patch` format
   - Major: Significant rule changes that affect gameplay
   - Minor: Clarifications or minor adjustments
   - Patch: Typo corrections or formatting changes
2. **Version History**: Tracked via commit history

## Commit Message Standards

All commits must follow this format:
```
[type]: <scope> - description

[optional body]

[metadata]
```

### Types

- `[OFFICIAL]`: Official sport rule updates
- `[CUSTOM]`: New custom sport or rule changes
- `[UPDATE]`: General repository updates
- `[REVIEW]`: Review process related changes
- `[ADMIN]`: Administrative changes

### Scopes

- Sport name (e.g., `NFL`, `FIFA`, `PowerSlap`)
- Category (e.g., `Combat`, `Team`, `Ball Games`)
- System area (e.g., `template`, `docs`, `structure`)

### Metadata Section

For rule updates, include these fields in the commit message body:

```
Version: 2024.1
Author: username
Reference: URL or document reference
Governing Body: Organization name
Change Summary: Brief list of major changes
```

### Examples

Official rule update:
```
[OFFICIAL]: NFL - Update 2024 rulebook with new targeting rules

Updates the NFL rulebook with the new targeting rules approved by the Competition Committee.

Version: 2024.1
Author: admin
Reference: NFL Competition Committee Report 2024
Governing Body: NFL
Change Summary:
- Modified Rule 12, Section 2, Article 8 (Targeting)
- Added new language on player safety
- Updated referee signal illustrations
```

Custom sport addition:
```
[CUSTOM]: Ball Games - Add End Zone Exchange sport

Created new custom sport "End Zone Exchange" with complete ruleset.

Version: 1.0.0
Author: username
Category: Ball Games
Players: 6-10 per team
Equipment: Football, cones
```

## Template System

The repository includes standard templates for creating new rule documents:

1. **official-template.html**: For regulated sports rulebooks
2. **custom-template.html**: For community sports rules
3. **tournament-template.html**: For competition formats

Templates are located in the `Templates/` directory at the repository root.

## Localization Guidelines

### File Naming for Translations

- Official sports: `[Organization]_[RuleType]_[LANG].html`
- Custom sports: `[SportName]_[RuleType]_[LANG].html`
- Language codes should use ISO 639-1 format (e.g., `en`, `es`, `fr`)

### Metadata for Translations

Include additional fields in the metadata section:

```json
{
  "language": "es",
  "translator": "username",
  "originalVersion": "1.2.0",
  "translationDate": "2024-02-26"
}
```

## Technical Implementation

### Sync Process

The repository is synchronized with the OpenSourceSports database through:

1. **Manual Sync**: Run via command `pnpm run sync:sports`
2. **Webhook Sync**: Automatic updates when changes are pushed to main

The sync process:
1. Scans the repository structure
2. Parses metadata files and HTML metadata
3. Creates or updates database records for categories, sports, and rules
4. Tracks versions and creates audit logs

### Parsing Logic

The system parses repository content using these rules:

1. **Path Analysis**: Extracts category, sport, and file type information from the file path
2. **Metadata Extraction**: Reads metadata.json files and HTML metadata comments
3. **Content Processing**: Processes HTML content for rules and sections
4. **Version Tracking**: Compares content to detect changes and update versions

## Contributing Guidelines

1. **Getting Started**:
   - Create an account on [opensourcesports.io](https://opensourcesports.io)
   - Familiarize yourself with the platform interface
   - Read the documentation and existing rules
   - Understand the submission standards

2. **Code of Conduct**:
   - Be respectful and inclusive
   - Provide constructive feedback
   - Follow the established guidelines
   - Collaborate positively

3. **Submission Process**:
   - Use the opensourcesports.io platform for all submissions
   - Follow the guided submission process
   - Provide complete and accurate information
   - Respond to review feedback through the platform

## Community Resources

- **Documentation**: Complete guides at docs.opensourcesports.io
- **Issue Tracker**: Report bugs and request features on GitHub
- **Discussions**: Join conversations in the GitHub Discussions
- **Discord**: Real-time community chat at discord.gg/opensourcesports
- **Contribution Guide**: Detailed guide at CONTRIBUTING.md

## License

This project is licensed under the MIT License, which permits:
- Commercial use
- Modification
- Distribution
- Private use
- Sublicensing

Requirements:
- License and copyright notice inclusion
- No liability or warranty

For full license terms, see the LICENSE file.

### Important Licensing Note

While this repository uses the MIT license (allowing anyone to take the source and use it for their own purposes), the **official OpenSourceSports repository** is specifically managed through our application workflow. The license allows you to:

- Create your own fork for personal or commercial use
- Develop your own sports rules platform based on our structure
- Incorporate our standards into your own projects

However, contributions to the official OpenSourceSports repository must follow our established submission process through the opensourcesports.io platform.

---

Join us in building the world's most comprehensive and accessible sports rule repository! Visit [opensourcesports.io](https://opensourcesports.io) to get started with our streamlined submission process.
