# 3D Asset Pipeline

## World scale
- Use meters as the authoring unit.
- Keep the player near 1.7–1.9 m tall for scale checks.
- Place pivots at ground contact for buildings, props and vehicles.
- Use separate render meshes and simplified collision meshes.

## Asset groups
- `environment/terrain`
- `environment/roads`
- `environment/buildings`
- `environment/landmarks`
- `environment/props`
- `characters/player`
- `vehicles/cars`
- `ui/icons`
- `audio/ambience`, `audio/vehicles`, `audio/ui`

## Naming
Use lowercase snake_case and stable IDs, for example:
- `bld_downtown_tower_001`
- `road_downtown_main_001`
- `veh_city_sedan_001`
- `prop_palm_tree_001`

## LOD and mobile budgets
Every large environment asset should define high, medium and far representations where practical. Use instancing for repeated props. Avoid unique high-resolution materials for every building. Keep collision meshes simple.

## Licensing
Only use original or properly licensed assets. Record source, license, author, attribution requirement and allowed redistribution in an asset register before adding third-party content to the public repository.
