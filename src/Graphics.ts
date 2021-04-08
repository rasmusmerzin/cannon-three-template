import { Scene, PerspectiveCamera, WebGLRenderer, Mesh } from "three";
import { Body } from "cannon";

export default class Graphics {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  bodies: Map<Body, Mesh>;

  constructor() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(120);
    this.renderer = new WebGLRenderer();
    this.bodies = new Map();
  }

  updateAspectRatio() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  mount(parent: HTMLElement) {
    this.updateAspectRatio();
    window.onresize = this.updateAspectRatio.bind(this);
    parent.appendChild(this.renderer.domElement);
  }

  bindBodyMesh(body: Body, mesh: Mesh) {
    this.bodies.set(body, mesh);
    this.scene.add(mesh);
  }

  unbindBody(body: Body) {
    const mesh = this.bodies.get(body);
    if (mesh) {
      this.bodies.delete(body);
      this.scene.remove(mesh);
    }
  }

  update() {
    this.bodies.forEach((mesh, body) =>
      mesh.position.set(body.position.x, body.position.y, body.position.z)
    );
  }

  animate() {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate.bind(this));
  }
}
