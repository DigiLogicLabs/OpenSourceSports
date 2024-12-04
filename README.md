# OpenSourceSports (OSS)

A collaborative platform for standardized sports rules and regulations, featuring both official and custom sports through a modern web interface and GitHub version control.

### About OSS

OSS provides a structured, version-controlled repository of sports rules with an accompanying web platform at opensourcesports.io. We combine GitHub's robust tracking capabilities with a user-friendly interface to make sports rules accessible and maintainable.

**Official Sports**: Professionally regulated sports with established governing bodies (FIFA, NBA, UFC, NFL, NHL). Rules are strictly maintained according to official standards and regulatory requirements.

**Custom Sports**: Community-created sports and variations, developed through collaborative effort and real-world testing. These represent innovation in gameplay and community-driven rule development.

### Rule Submission Process

#### Official Sports
Official rule changes follow a strict review process:
- Changes require review by designated maintainers
- Pull requests must include:
  - Reference to official source
  - Regulatory body verification
  - Impact assessment
  - Compliance check

#### Custom Sports
Submit through our user-friendly web interface:
- Interactive rule creation wizard
- Dynamic template with guided sections
- Live preview functionality
- Automatic repository structure generation
- No technical knowledge required
- Instant preview and publishing
- Community voting and feedback system

### File Organization Standards

#### Official Sports Structure
```
Official/
├── Combat Sports/
│   ├── Boxing/
│   │   ├── WBA_Official_Rulebook.html
│   │   ├── WBC_Official_Rulebook.html
│   │   └── Unified_Boxing_Rules.html
│   └── MMA/
│       ├── UFC_Unified_Rulebook.html
│       └── Athletic_Commission_Standards.html
└── Team Sports/
    ├── Football/
    │   └── NFL_Official_Rulebook.html
    └── Soccer/
        ├── FIFA_Laws_of_Game.html
        └── FIFA_Competition_Rules.html
```

#### Custom Sports Structure
Automatically organized based on submission metadata:
```
Custom/
├── [Category]/
│   └── [Sport Name]/
│       └── Game_Rules.html
```

### Naming Conventions

#### Official Sports
- Main rules: `Organization_Official_Rulebook.html`
- Competition rules: `Organization_Competition_Rules.html`
- Supporting documents: `Category_Protocol.html`
- Use underscores for spacing

#### Custom Sports
- System-generated naming based on web submission
- Consistent format: `Game_Rules.html`
- Optional variations: `Game_Rules_Variant.html`
- Tournament formats: `Game_Tournament_Rules.html`

### Web Platform Features

- Interactive rule browsing with category filtering
- Version comparison and change tracking
- Community discussion and proposals
- Mobile-responsive design
- User authentication and contribution tracking
- Rule creation wizard for custom sports
- Live preview system
- Automatic formatting and organization
- Version control without Git knowledge
- Community voting and feedback system

### Quality Standards

1. **Official Sports Requirements**:
   - Accurate reflection of governing body rules
   - Proper citation of sources
   - Complete regulation coverage
   - Regular updates tracking official changes

2. **Custom Sports Requirements**:
   - Clear setup instructions
   - Equipment specifications
   - Player counts and roles
   - Scoring system
   - Safety considerations
   - Optional variations

3. **Technical Standards**:
   - Valid HTML5
   - Semantic markup for accessibility
   - Required metadata sections
   - Responsive design principles
   - Dark/light theme compatibility

### Localization

- Primary language: English
- Official sports: `Organization_Official_Rulebook_LANG.html`
- Custom sports: `Game_Rules_LANG.html`
- Language code in metadata

### HTML Templates

- `official-sport-template.html`: For regulated sports
- `custom-sport-template.html`: For community sports
- `tournament-template.html`: For competition formats
- Dynamic web-based template system for custom sports

### Community Guidelines

1. **Respectful Communication**
   - Constructive feedback
   - Inclusive language
   - Clear documentation

2. **Support Channels**
   - GitHub Issues for bugs
   - Discussions for ideas
   - Discord community
   - Web platform feedback system

### Commit Message Standards

Commits must follow this format:
```
[type]: <scope> - description

[optional body]
```

Types:
- `[OFFICIAL]`: Official sport rule updates
- `[CUSTOM]`: New custom sport or rule changes
- `[UPDATE]`: General repository updates
- `[REVIEW]`: Review process related changes
- `[ADMIN]`: Administrative changes

Scopes:
- Sport name (e.g., `NFL`, `FIFA`, `PowerSlap`)
- Category (e.g., `Combat`, `Team`, `Ball Games`)
- System area (e.g., `template`, `docs`, `structure`)

Examples:
```
[OFFICIAL]: NFL - Update 2024 rulebook with new targeting rules

Reference: NFL Competition Committee Report 2024
Section: Player Safety
Link: official-source-url
```

```
[CUSTOM]: Ball Games - Add End Zone Exchange sport

Created via web interface
Category: Ball Games
Author: username
```

These commit messages enable:
- Automated changelog generation
- Rule version tracking
- Category-based filtering
- API event triggers
- Automated testing workflows

### License

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

---

Join us in building the world's most comprehensive and accessible sports rule repository! Visit opensourcesports.io to get started.