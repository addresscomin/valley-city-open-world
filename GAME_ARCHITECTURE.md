# VALLEY CITY — Complete Game Architecture

## 1. Product definition
VALLEY CITY is an original third-person, mobile-first open-world exploration and driving game set in a Dubai-inspired fictionalized city. Android landscape is the first target; desktop support follows. The game uses original characters, missions, vehicles, UI and assets.

## 2. Core design pillars
- Seamless-feeling city exploration with districts streamed around the player.
- Third-person character movement and camera.
- Separate on-foot and vehicle control schemes.
- City navigation, map markers, garages and discoverable locations.
- Mission framework for safe activities: deliveries, sightseeing, driving tests, time trials and exploration.
- Scalable visuals with quality settings for low-memory phones.
- Save/load for player position, unlocked districts, owned vehicles and mission progress.

## 3. Main game flow
Boot → loading screen → main menu → new game / continue → world load → free roam → enter activity / garage / mission → results and rewards → save → free roam.

## 4. Screen and UI inventory
1. Splash and loading screen
2. Main menu
3. New game / continue
4. In-game HUD
5. Pause menu
6. World map and waypoint panel
7. Mission briefing and results
8. Garage and vehicle selection
9. Player profile / progress
10. Settings: graphics, audio, controls, language
11. Save/load feedback and error messages

## 5. World structure
The city is divided into independently loadable districts:
- Downtown: signature skyline, central boulevard, plaza and landmark zone.
- Marina: waterfront, promenade, bridges and high-rise blocks.
- Sheikh Zayed corridor: highway, interchanges and commercial skyline.
- Desert outskirts: dunes, service roads and small settlement.
Each district contains smaller streaming cells. Nearby cells load at high detail; mid-distance cells use simplified meshes; far cells use skyline silhouettes. Unused cells release their resources.

## 6. 3D scene hierarchy
GameRoot
- Systems: input, audio, save, mission, navigation, settings
- World: lighting, sky, environment, district streamer, road network, props
- Player: character model, animator, movement controller, camera rig
- Vehicles: vehicle registry, physics adapter, vehicle controller, garage
- NPC: pedestrian manager and traffic manager (later milestone)
- UI: HUD, minimap, menus, prompts, touch controls
- Debug: frame-time and memory diagnostics (development only)

## 7. Runtime systems
- Game bootstrap and scene lifecycle
- Landscape/responsive screen manager
- Input abstraction (touch + keyboard + gamepad-ready)
- Character movement and animation state machine
- Follow camera with collision-aware distance
- Vehicle entry/exit and driving controller
- World coordinates, district/cell streaming and LOD
- Road graph and waypoint navigation
- Mission state machine and activity triggers
- Garage and vehicle data registry
- Save data versioning
- Audio mixer and ambience zones
- Graphics quality and performance profiles

## 8. Asset structure
- Environment: terrain, roads, sidewalks, buildings, landmarks, vegetation, street furniture
- Character: base mesh, skeleton, idle/walk/run animations, clothing variants
- Vehicles: body meshes, wheels, materials, lights, collision proxies, audio
- UI: icons, map markers, fonts, panels
- Audio: ambience, footsteps, engines, UI and music
All third-party assets must have suitable commercial/game redistribution rights and attribution where required.

## 9. Mobile performance strategy
Initial device target is Android with 4 GB RAM:
- Stream only nearby district cells.
- Use low-poly collision meshes separate from render meshes.
- Use LODs, instancing and shared materials.
- Limit real-time lights and shadow casters.
- Use compressed textures and sensible texture sizes.
- Cap render resolution and expose Low / Medium / High profiles.
- Pool frequently reused objects and dispose unloaded assets.
- Measure frame time and memory before increasing scene density.

## 10. Technical baseline
The existing browser prototype uses Three.js. Keep it as the immediate playable baseline while architecture modules are introduced and tested. Do not silently claim that a browser prototype is equivalent to a finished native AAA game. A later native Android/PC engine decision should be made only after a representative district benchmark.

## 11. Build order
A. Architecture and folder structure  
B. Landscape shell, loading/menu/pause/settings screens  
C. World coordinate system, road graph and district/cell definitions  
D. Character controller, animation states and follow camera  
E. Vehicle controller, garage and touch driving controls  
F. HUD, minimap, waypoint and mission framework  
G. First complete greybox district with collision and navigation  
H. Replace greybox meshes with licensed, optimized 3D assets  
I. Lighting, materials, weather and audio polish  
J. Traffic, pedestrians, ambient activities and save progression  
K. Android performance testing and packaging  
L. Desktop input, graphics and packaging pass

## 12. Definition of done for the structure phase
- Every major game system has a named module and clear responsibility.
- World districts and streaming-cell data have a defined format.
- Touch and keyboard input share one input interface.
- On-foot and driving states are separated.
- UI screens and game flow are documented.
- Asset naming, scale, LOD and licensing rules are documented.
- Existing playable prototype remains available during the transition.

## Current status
The repository contains an early playable Three.js prototype. This architecture is the structural blueprint and module scaffold; it does not mean all systems listed above are already implemented or connected. The next phase is to wire modules into the game one system at a time, then build the first complete greybox district before high-detail art.
