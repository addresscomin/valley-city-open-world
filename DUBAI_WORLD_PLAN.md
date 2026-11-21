# VALLEY CITY — Dubai World Build Plan

## Creative direction
An original open-world driving and exploration game set in a Dubai-inspired city. The game will use its own characters, vehicles, missions, UI, sounds and visual identity. It will not copy GTA assets, characters, maps, missions or branding.

## World layout
Build the world as connected streaming districts rather than loading the whole city at once:

1. Downtown district — Burj Khalifa-inspired landmark, wide boulevard, plaza and dense towers.
2. Marina district — waterfront promenade, canals, high-rise skyline and bridges.
3. Sheikh Zayed Road district — multi-lane highway, interchanges and commercial towers.
4. Desert outskirts — dunes, service roads, small settlements and a driving route.

The first playable release should contain one compact district with connected roads and a recognizable skyline. Expand district by district after mobile performance is measured.

## Technical approach
- Keep the current Three.js browser build as the fast Android-playable prototype.
- Use low-poly collision geometry and simplified distant buildings; reserve detailed meshes for nearby landmarks.
- Use distance-based visibility/level of detail, capped render resolution, and limited active traffic.
- Load district assets on demand and dispose of unused geometry/materials.
- Add touch steering, acceleration, brake, camera control and an accessible pause/settings panel.
- Keep keyboard controls for desktop.
- Keep all API keys out of source control. Any browser-visible map token must be restricted to the intended website origin and usage limits.

## Real-world map integration
A later map-data milestone can evaluate Cesium OSM Buildings or another provider with suitable redistribution and attribution terms. Real-world building footprints do not automatically provide detailed interiors, high-resolution facade textures, road gameplay, or permission to package map data offline. Review provider terms before using any data in a distributable game. Google Photorealistic 3D Tiles must not be scraped, baked into downloadable assets, or redistributed outside the provider's permitted use.

## Milestones
- M0 — Existing playable foundation: movement, camera, vehicle interaction, touch controls.
- M1 — Dubai-inspired first district: landmark skyline, boulevard, waterfront/desert edge, improved road layout.
- M2 — Core driving: steering, braking, collision, checkpoints, garage and vehicle selection.
- M3 — Living city: optimized traffic, pedestrians, ambient audio and day/night cycle.
- M4 — District streaming: separate Downtown, Marina, highway and desert areas.
- M5 — Progression: exploration tasks, delivery/time-trial missions, map, save/settings.
- M6 — Android packaging and desktop performance pass.

## Device target
Initial testing target: Android phone with 4 GB RAM in a mobile browser. This is a constrained target, so the first build prioritizes stable frame rate and compact districts over maximum texture detail. A high-fidelity PC build may need a separate native engine and substantially stronger hardware.

## Current status
Only M0 is present in the repository. The Dubai world, real-world map integration, traffic, missions, save system and Android package are not complete yet.
