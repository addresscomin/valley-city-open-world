import * as THREE from "three";

/**
 * Builds original, fictionalized district geometry from cell metadata.
 * Geometry is intentionally low-poly and is a greybox, not final art.
 */
export class DistrictSceneBuilder {
  constructor(scene) {
    this.scene = scene;
    this.shared = {
      ground: new THREE.MeshStandardMaterial({ color: 0xb79d70, roughness: 1 }),
      groundMarina: new THREE.MeshStandardMaterial({ color: 0xb7a784, roughness: 1 }),
      groundHighway: new THREE.MeshStandardMaterial({ color: 0xa99a7e, roughness: 1 }),
      groundDesert: new THREE.MeshStandardMaterial({ color: 0xc4a875, roughness: 1 }),
      duneA: new THREE.MeshStandardMaterial({ color: 0xb99b69, roughness: 1 }),
      duneB: new THREE.MeshStandardMaterial({ color: 0xd0b47d, roughness: 1 }),
      water: new THREE.MeshStandardMaterial({ color: 0x3f8790, roughness: .32, metalness: .18 }),
      road: new THREE.MeshStandardMaterial({ color: 0x343a3e, roughness: 1 }),
      sidewalk: new THREE.MeshStandardMaterial({ color: 0x858783, roughness: 1 }),
      lane: new THREE.MeshStandardMaterial({ color: 0xe6d8b4, roughness: 1 }),
      glass: new THREE.MeshStandardMaterial({ color: 0x668b94, roughness: .45, metalness: .12 }),
      palm: new THREE.MeshStandardMaterial({ color: 0x426b48, roughness: 1 }),
      trunk: new THREE.MeshStandardMaterial({ color: 0x765b3c, roughness: 1 }),
      colors: [0xb9aa92, 0x9aaeb0, 0xc6b99f, 0x879b9d, 0xd0c7b6].map(color => new THREE.MeshStandardMaterial({ color, roughness: .86 }))
    };
  }

  build(cell) {
    const group = new THREE.Group();
    group.name = `district:${cell.id}`;
    const size = cell.size || 250;
    const half = size / 2;
    const originX = cell.origin[0];
    const originZ = cell.origin[1];
    const colliders = [];
    const addBox = (x,y,z,w,h,d,material,solid = false) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), material);
      mesh.position.set(x,y,z);
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      group.add(mesh);
      if (solid) colliders.push({ minX:x-w/2, maxX:x+w/2, minZ:z-d/2, maxZ:z+d/2 });
      return mesh;
    };

    const groundMaterial = cell.districtId === "desert" ? this.shared.groundDesert : cell.districtId === "marina" ? this.shared.groundMarina : cell.districtId === "highway" ? this.shared.groundHighway : this.shared.ground;
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(size,size), groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(originX + half, -.12, originZ + half);
    group.add(ground);

    // Perimeter roads keep adjacent district cells connected.
    addBox(originX + half, .01, originZ, size, .08, 10, this.shared.road);
    addBox(originX + half, .01, originZ + size, size, .08, 10, this.shared.road);
    addBox(originX, .01, originZ + half, 10, .08, size, this.shared.road);
    addBox(originX + size, .01, originZ + half, 10, .08, size, this.shared.road);

    // A clear central boulevard plus two cross streets.
    for (const offset of [-65, 0, 65]) {
      addBox(originX + half, .015, originZ + offset + half, size, .08, 13, this.shared.road);
      addBox(originX + offset + half, .02, originZ + half, 13, .08, size, this.shared.road);
      addBox(originX + half, .06, originZ + offset + half, size, .04, .22, this.shared.lane);
      addBox(originX + offset + half, .06, originZ + half, .22, .04, size, this.shared.lane);
    }

    if (cell.districtId === "marina") {
      const water = new THREE.Mesh(new THREE.PlaneGeometry(size, 34), this.shared.water);
      water.rotation.x = -Math.PI / 2;
      water.position.set(originX + half, -.015, originZ + size - 18);
      group.add(water);
      colliders.push({ minX:originX, maxX:originX+size, minZ:originZ+size-35, maxZ:originZ+size });
      addBox(originX + half, .12, originZ + size - 39, size, .24, 7, this.shared.sidewalk);
    }
    if (cell.districtId === "highway") {
      addBox(originX + half, .08, originZ + half, size, .16, 25, this.shared.road);
      addBox(originX + half, .62, originZ + half - 14, size, 1.1, .7, this.shared.sidewalk, true);
      addBox(originX + half, .62, originZ + half + 14, size, 1.1, .7, this.shared.sidewalk, true);
    }

    // Sidewalk strips on the boulevard edges.
    for (const side of [-1,1]) {
      addBox(originX + half, .08, originZ + half + side*8.5, size, .18, 2.2, this.shared.sidewalk);
      addBox(originX + half + side*8.5, .08, originZ + half, 2.2, .18, size, this.shared.sidewalk);
    }

    // Deterministic building blocks leave road corridors clear.
    let seed = 9187;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const blocks = [-95,-32,32,95];
    blocks.forEach((bx, ix) => blocks.forEach((bz, iz) => {
      if (Math.abs(bx) < 40 && Math.abs(bz) < 40) return;
      if (cell.districtId === "desert" && (Math.abs(bx) < 90 || Math.abs(bz) < 90)) return;
      const width = 17 + random()*12;
      const depth = 17 + random()*12;
      const height = cell.districtId === "marina" ? 24 + random()*48 : cell.districtId === "highway" ? 18 + random()*42 : 12 + random()*40;
      const x = originX + half + bx;
      const z = originZ + half + bz;
      addBox(x, height/2, z, width, height, depth, this.shared.colors[Math.floor(random()*this.shared.colors.length)], true);
      // Repeated facade bands give the greybox a readable city scale.
      for (let y=4; y<height-2; y+=6) {
        addBox(x, y, z + depth/2 + .04, width*.82, .18, .08, this.shared.glass);
        addBox(x + width/2 + .04, y, z, .08, .18, depth*.82, this.shared.glass);
      }
      addBox(x, height+.25, z, width+.5, .5, depth+.5, this.shared.sidewalk);
    }));

    // Small landmark plaza and a stepped, original skyline silhouette.
    const plazaX = originX + half;
    const plazaZ = originZ + half - 78;
    addBox(plazaX, .12, plazaZ, 35, .2, 35, this.shared.sidewalk);
    for (let i=0; i<7; i++) {
      const w = 12 - i*1.25;
      const h = 8;
      addBox(plazaX, i*h + h/2 + .25, plazaZ, w, h, w, i%2 ? this.shared.glass : this.shared.colors[2], true);
    }
    const spire = new THREE.Mesh(new THREE.ConeGeometry(.65, 18, 6), this.shared.glass);
    spire.position.set(plazaX, 75, plazaZ);
    group.add(spire);

    if (cell.districtId === "desert") {
      for (let i=0; i<8; i++) {
        const dune = new THREE.Mesh(new THREE.ConeGeometry(18 + random()*18, 12 + random()*16, 5), i%2 ? this.shared.duneA : this.shared.duneB);
        dune.position.set(originX + 18 + random()*(size-36), 4, originZ + 18 + random()*(size-36));
        group.add(dune);
      }
    }

    // Palm-like low-poly street greenery along the main avenue.
    for (let i=-4; i<=4; i++) {
      for (const side of [-1,1]) {
        const x = originX + half + i*24;
        const z = originZ + half + side*12;
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.25,.38,4,5), this.shared.trunk);
        trunk.position.set(x,2,z);
        group.add(trunk);
        const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(2.1,0), this.shared.palm);
        crown.position.set(x,4.5,z);
        group.add(crown);
      }
    }
    this.scene.add(group);
    return { group, cellId: cell.id, colliders };
  }

  dispose(resource) {
    if (!resource?.group) return;
    this.scene.remove(resource.group);
    resource.group.traverse(object => {
      if (object.geometry && !object.geometry.userData.shared) object.geometry.dispose();
    });
  }
}
