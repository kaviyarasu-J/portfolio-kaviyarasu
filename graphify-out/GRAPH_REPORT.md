# Graph Report - portfolio-codex  (2026-08-16)

## Corpus Check
- 36 files · ~240,072 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 200 nodes · 224 edges · 22 communities (19 shown, 3 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- React Portfolio View Layout
- Navigation & Portfolio Data
- Production Runtime Dependencies
- Build & Style DevDependencies
- OpenCode Model & Context Config
- Chat API & Navigation Routing
- Microservices Architecture & Data Streams
- Azure Cloud & Serverless Infrastructure
- Project Zenith Visual IDE Architecture
- AI Assistant & Speech Synthesis
- Web App Shell & Documentation
- Neural Network Architecture & AI Models
- Technical Visual Assets & Infographics
- Three.js 3D Canvas & Scene Core
- Hero Animations & Smooth Scrolling
- Graphify Knowledge Graph Framework
- Personal Profile & Portrait Asset

## God Nodes (most connected - your core abstractions)
1. `Microservices Cluster` - 10 edges
2. `Project Zenith Visual IDE & UI Builder` - 7 edges
3. `Tech Visual Sheet Asset` - 7 edges
4. `profile` - 6 edges
5. `TtsService` - 6 edges
6. `Distributed Serverless Infrastructure` - 6 edges
7. `AI Neural Network Architecture Visualization` - 6 edges
8. `nvidia-nim` - 5 edges
9. `Azure Scalable Cloud Platform` - 5 edges
10. `handler()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Portfolio Overview` --semantically_similar_to--> `HTML Profile Metadata`  [INFERRED] [semantically similar]
  README.md → index.html
- `Graphify Rules` --conceptually_related_to--> `Graphify Workflow`  [INFERRED]
  .agents/rules/graphify.md → .agents/workflows/graphify.md
- `Hero()` --calls--> `splitText()`  [EXTRACTED]
  src/sections/Hero.jsx → src/utils/animation.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Portfolio Bootstrap and Configuration** — readme_portfolio_overview, readme_tech_stack, readme_local_development, readme_contact_configuration [EXTRACTED 1.00]
- **Portfolio Web Entry Structure** — index_html_meta_profile, index_html_root_container, index_html_entry_script [EXTRACTED 1.00]
- **Azure Scalable Cloud Architecture Core** — src_assets_manifesto_3_scalable_compute, src_assets_manifesto_3_serverless_functions, src_assets_manifesto_3_distributed_nodes, src_assets_manifesto_3_azure_services, src_assets_manifesto_3_edge_network [EXTRACTED 1.00]
- **Neural Network End-to-End Inference Pipeline** — src_assets_manifesto_4_input_data_streams, src_assets_manifesto_4_neural_network_model, src_assets_manifesto_4_prediction_results, src_assets_manifesto_4_intelligent_system [INFERRED 0.95]

## Communities (22 total, 3 thin omitted)

### Community 0 - "React Portfolio View Layout"
Cohesion: 0.09
Nodes (7): App(), differentiators, fallingTech, manifesto, projectReel, useLenis(), visualPositions

### Community 1 - "Navigation & Portfolio Data"
Cohesion: 0.13
Nodes (9): links, certifications, education, experience, featuredProjects, profile, projects, skills (+1 more)

### Community 2 - "Production Runtime Dependencies"
Cohesion: 0.10
Nodes (21): @emailjs/browser, gsap, lenis, lucide-react, dependencies, @emailjs/browser, gsap, lenis (+13 more)

### Community 3 - "Build & Style DevDependencies"
Cohesion: 0.11
Nodes (17): autoprefixer, devDependencies, autoprefixer, postcss, tailwindcss, vite, tailwindcss, name (+9 more)

### Community 4 - "OpenCode Model & Context Config"
Cohesion: 0.12
Nodes (16): context, output, model, z-ai/glm-5.2, models, name, npm, options (+8 more)

### Community 5 - "Chat API & Navigation Routing"
Cohesion: 0.20
Nodes (11): buildPrompt(), detectNavigation(), extractAnswer(), handler(), NAVIGATION_MAP, __dirname, __filename, server (+3 more)

### Community 6 - "Microservices Architecture & Data Streams"
Cohesion: 0.14
Nodes (14): API Gateway, User Auth Service, Distributed Cache Layer, CI/CD & Automated Workflows, Data Streams (Kafka / Async Messages), Databases (PostgreSQL & NoSQL), Inventory Service, Kubernetes Orchestration (+6 more)

### Community 7 - "Azure Cloud & Serverless Infrastructure"
Cohesion: 0.25
Nodes (11): Auto-Scaling, Azure Scalable Cloud Platform, Azure Services, Distributed Nodes, Distributed Serverless Infrastructure, Edge Network, Global Reach, Low Latency (+3 more)

### Community 8 - "Project Zenith Visual IDE Architecture"
Cohesion: 0.28
Nodes (8): Active Users & Traffic Analytics Widgets, Run Build, Commit Changes & Deploy Pipeline, Vue / Template Code Editor Panels, Component Library Canvas (Navbar, Header, Card, Grid), DOM Structure Hierarchy Inspector, Dark Mode Glassmorphic Neon-Green Design System, Project Tasks & Workflow Checklist, Project Zenith Visual IDE & UI Builder

### Community 9 - "AI Assistant & Speech Synthesis"
Cohesion: 0.28
Nodes (3): AiAssistant(), SUGGESTED_QUESTIONS, TtsService

### Community 10 - "Web App Shell & Documentation"
Cohesion: 0.29
Nodes (7): Vite Main Entry Script, HTML Profile Metadata, HTML Root Mount Element, EmailJS Contact Configuration, Local Development Setup, Portfolio Overview, Portfolio Tech Stack

### Community 11 - "Neural Network Architecture & AI Models"
Cohesion: 0.52
Nodes (7): AI Neural Network Architecture Visualization, Feature Extraction, Input Data Streams, Intelligent System & Actionable Insights, Neural Network Model, Pattern Recognition & Algorithm Layers, Prediction Results & Output Layer

### Community 12 - "Technical Visual Assets & Infographics"
Cohesion: 0.29
Nodes (7): Tech Visual Sheet Asset, Artificial Intelligence & Neural Network Visual, Analytics & Metrics Dashboard Visual, Cloud Infrastructure & Distributed Node Visual, Cybersecurity & Shield Access Visual, Database Storage & Data Stream Visual, Software Architecture & Code Engine Visual

### Community 15 - "Graphify Knowledge Graph Framework"
Cohesion: 0.67
Nodes (3): Graphify Rules, Graphify Knowledge Graph Guidelines, Graphify Workflow

## Knowledge Gaps
- **71 isolated node(s):** `NAVIGATION_MAP`, `__filename`, `__dirname`, `server`, `$schema` (+66 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Production Runtime Dependencies` to `Build & Style DevDependencies`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `Tech Visual Sheet Asset` connect `Technical Visual Assets & Infographics` to `React Portfolio View Layout`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `NAVIGATION_MAP`, `__filename`, `__dirname` to the rest of the system?**
  _71 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `React Portfolio View Layout` be split into smaller, more focused modules?**
  _Cohesion score 0.09486166007905138 - nodes in this community are weakly interconnected._
- **Should `Navigation & Portfolio Data` be split into smaller, more focused modules?**
  _Cohesion score 0.12554112554112554 - nodes in this community are weakly interconnected._
- **Should `Production Runtime Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `Build & Style DevDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._