import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import vertex from "./shaders/vertex.glsl";
import fragment from "./shaders/fragment.glsl";
import vertexSun from "./shadersSun/vertex.glsl";
import fragmentSun from "./shadersSun/fragment.glsl";
import vertexAround from "./shadersAround/vertex.glsl";
import fragmentAround from "./shadersAround/fragment.glsl";

class App {
  constructor() {
    this._scene = new THREE.Scene();

    this._container = document.querySelector("div");
    this.width = this._container.offsetWidth;
    this.height = this._container.offsetHeight;
    this._renderer = new THREE.WebGLRenderer({ antialias: true });
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(this.width, this.height);
    this._renderer.setClearColor(0xeeeeee, 1);
    this._renderer.physicallyCorrectLights = true;
    this._renderer.outputEncoding = THREE.sRGBEncoding;
    this._container.appendChild(this._renderer.domElement);

    this._camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.001, 1000);
    this._camera.position.z = 2.5;

    this.controls = new OrbitControls(this._camera, this._container);

    // create scene
    this.time = 0;
    this.isPlaying = true;

    // utils
    this.addTexture();
    this._setObject();
    this.addAround();
    this.resize();
    this.render();
    this._setupResize();
    // this._setting();
  }

  //

  _setting() {
    this.settings = {
      progress: 0,
    };
    const gui = new dat.GUI();
    gui.add(this.settings, "progress", 0, 1, 0.01);
  }

  _setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this._container.offsetWidth;
    this.height = this._container.offsetHeight;
    this._renderer.setSize(this.width, this.height);
    this._camera.aspect = this.width / this.height;

    this._camera.updateProjectionMatrix();
  }

  addAround() {
    this.materialAround = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.BackSide,
      uniforms: {
        time: { type: "f", value: 0 },
        texture: { value: "none" },
        resolution: { type: "v4", value: new THREE.Vector4() },
      },
      transparent: true,
      // wireframe: true,
      vertexShader: vertexAround,
      fragmentShader: fragmentAround,
    });

    this.aroundGeo = new THREE.SphereBufferGeometry(1.2, 36, 36);

    this.sunAround = new THREE.Mesh(this.aroundGeo, this.materialAround);

    this._scene.add(this.sunAround);
  }

  addTexture() {
    this._scene1 = new THREE.Scene();

    this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
      format: THREE.RGBAFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipMapLinearFilter,
      encoding: THREE.sRGBEncoding,
    });

    this.cubeCamera = new THREE.CubeCamera(0.1, 10, this.cubeRenderTarget);

    this.materialPerlin = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        texture: { value: "none" },
        resolution: { type: "v4", value: new THREE.Vector4() },
      },
      // transparent: true,
      // wireframe: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.perlinGeo = new THREE.SphereBufferGeometry(1, 36, 36);

    this.perlin = new THREE.Mesh(this.perlinGeo, this.materialPerlin);

    this._scene1.add(this.perlin);
  }

  _setObject() {
    // for shader
    this.materialSun = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        uPerlin: { value: null },
        texture: { value: "none" },
        resolution: { type: "v4", value: new THREE.Vector4() },
      },
      // transparent: true,
      vertexShader: vertexSun,
      fragmentShader: fragmentSun,
    });

    this.geometrySun = new THREE.SphereBufferGeometry(1, 36, 36);
    this.obj = new THREE.Mesh(this.geometrySun, this.materialSun);

    this._scene.add(this.obj);
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if (!this.isPlaying) {
      this.render();
      this.isPlaying = true;
    }
  }

  render() {
    if (!this.isPlaying) return;

    this.cubeCamera.update(this._renderer, this._scene1);
    this.time += 0.05;
    this.materialSun.uniforms.uPerlin.value = this.cubeRenderTarget.texture;
    this.materialSun.uniforms.time.value = this.time;
    this.materialPerlin.uniforms.time.value = this.time;
    window.requestAnimationFrame(this.render.bind(this));
    this._renderer.render(this._scene, this._camera);
  }
}

new App();
