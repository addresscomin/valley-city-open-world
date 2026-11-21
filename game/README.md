# Game source layout

This folder contains the modular game foundation. The current root `index.html` remains the existing playable prototype while modules are introduced incrementally.

- `config/`: device targets and world constants
- `core/`: boot lifecycle and scene orchestration
- `world/`: district data, world manager and streaming cells
- `player/`: on-foot controller and player state
- `vehicles/`: vehicle definitions and driving controller
- `systems/`: shared input, save, mission and navigation services
- `ui/`: screen flow and HUD interfaces

Modules are kept dependency-light and use native ES modules. Do not connect a module until its interface and browser behavior have been tested.
