import Graphics from "./Graphics";
import { World, Vec3, Sphere, Box, Body } from "cannon";
import { SphereGeometry, BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import { OrbitControls } from "three-controls";

const world = new World();
world.gravity.set(0, -10, 0);

const graphics = new Graphics();
graphics.camera.position.z = 10;
graphics.mount(document.body);
graphics.animate();

new OrbitControls(
  // @ts-ignore
  graphics.camera,
  graphics.renderer.domElement
);

const newSphere = (x: number, y: number, z: number): [Body, Mesh] => {
  const body = new Body({
    shape: new Sphere(1),
    mass: 1,
  });
  body.position.set(x, y, z);
  world.addBody(body);
  const mesh = new Mesh(
    new SphereGeometry(1),
    new MeshBasicMaterial({ color: 0xff00ff })
  );
  graphics.bindBodyMesh(body, mesh);
  return [body, mesh];
};

const newBlock = (): [Body, Mesh] => {
  const body = new Body({
    shape: new Box(new Vec3(3, 0.25, 3)),
  });
  body.position.set(0, -5, 0);
  world.addBody(body);
  const mesh = new Mesh(
    new BoxGeometry(6, 0.5, 6),
    new MeshBasicMaterial({ color: 0x444444 })
  );
  graphics.bindBodyMesh(body, mesh);
  return [body, mesh];
};

newBlock();

const loopSpheres = () => {
  const spheres = [
    newSphere(-3.1, 11 + Math.random() * 3, 0)[0],
    newSphere(0, 11 + Math.random() * 3, 0)[0],
    newSphere(3.1, 11 + Math.random() * 3, 0)[0],
  ];
  setTimeout(
    () =>
      spheres.forEach((body) => {
        world.remove(body);
        graphics.unbindBody(body);
      }),
    3500
  );
  setTimeout(loopSpheres, 2000);
};
loopSpheres();

const STEP = 1.0 / 60.0;

setInterval(() => {
  world.step(STEP);
  graphics.update();
}, STEP * 1000);
