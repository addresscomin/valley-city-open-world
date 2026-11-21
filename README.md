# VALLEY CITY: OPEN WORLD

An original, mobile-first 3D exploration and driving game prototype.

## Play
- Original prototype: https://addresscomin.github.io/valley-city-open-world/
- Modular greybox build: https://addresscomin.github.io/valley-city-open-world/game.html

The modular build is a separate page so the original prototype remains available while systems are tested.

## Current build
- Lightweight Three.js scene with a mountain-valley environment
- Procedural town blocks, roads, trees and distant ridges
- Third-person player movement
- Enter/exit a drivable city car near the green garage marker
- Touch controls for phones and keyboard controls for desktop
- Boost and speed HUD
- Responsive rendering capped for lower-memory phones

## Controls
- Desktop: WASD / arrow keys to move; E to enter or exit the car; Space / BOOST to boost.
- Phone: use the on-screen direction pad to walk. Move close to the green marker and tap ENTER VEHICLE; dedicated LEFT / GAS / BRAKE / RIGHT controls appear while driving.

## Run locally
Serve this folder with any static HTTP server. The Three.js module is loaded from jsDelivr, so an internet connection is needed.

## Modular greybox build
Open [game.html](game.html) for the new modular build. It connects the game lifecycle, scene manager, district streamer, procedural Downtown greybox builder, player controller, follow camera, vehicle controller, touch/keyboard input and UI state. It includes a basic on-foot mode, a drivable city vehicle, a garage marker, pause screen and landscape guidance.

This is an early low-poly greybox, not realistic final art. The other scaffold modules for missions, navigation, save data and performance sampling are not yet wired into gameplay.

## World direction
The selected setting is an original Dubai-inspired open world. The world will be built district by district to keep the Android version within memory limits. See [DUBAI_WORLD_PLAN.md](DUBAI_WORLD_PLAN.md) for the districts, technical approach, milestones and map-data licensing notes.

## Roadmap
This is the first playable foundation, not a finished open-world game. Dubai districts, real-world map integration, missions, traffic, pedestrians, vehicle selection, sound, save data, settings and Android packaging are not complete yet.

## Performance
Designed to keep geometry simple and pixel ratio capped for entry-level Android devices. Close other heavy apps for smoother play. Landscape mode is recommended.

## License
All game code and world design in this repository are original project material. Third-party engine: Three.js (MIT).
