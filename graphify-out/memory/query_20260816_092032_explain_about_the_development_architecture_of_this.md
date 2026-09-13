---
type: "query"
date: "2026-08-16T09:20:32.988504+00:00"
question: "explain about the development architecture of this project"
contributor: "graphify"
outcome: "useful"
source_nodes: ["App()", "Scene()", "DeveloperCore()", "AiAssistant()", "TtsService", "handler()", "initSmoothScroll()"]
---

# Q: explain about the development architecture of this project

## Answer

The project is a modern full-stack developer portfolio application built on Vite and React 18, featuring a 3D WebGL Canvas layer (Three.js/Fiber), dynamic GSAP and Lenis smooth scrolling animations, an interactive AI Assistant powered by an API proxy route (api/chat.js) with OpenCode/NVIDIA NIM LLM integration, and a Web Audio Text-to-Speech service (api/tts.js). Data is centralized in src/data/portfolio.js, and design assets model microservices, Azure serverless cloud, and neural network inference pipelines.

## Outcome

- Signal: useful

## Source Nodes

- App()
- Scene()
- DeveloperCore()
- AiAssistant()
- TtsService
- handler()
- initSmoothScroll()