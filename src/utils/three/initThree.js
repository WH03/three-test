import * as THREE from "three";
export default class initThree {
  constructor(canvas) {
    //场景
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      canvas.offsetWidth / canvas.offsetHeight,
      1,
      1000000
    );
    this.camera.position.set(0, 0, 250);
    // this.camera.lookAt(0,0,0)
    this.camera.updateProjectionMatrix();
    //将场景中的物体
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    // this.renderer.setSize(canvas.innerWidth, canvas.innerHeight);
    //设置像素比,将他设置为设备像素比
    this.renderer.setPixelRatio(canvas.devicePixelRatio);
    this.renderer.setClearColor("#add8e6");

    this.renderer.shadowMap.enabled = true;

    // window.addEventListener("resize", () => {
    //   this.camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    //   this.camera.updateProjectionMatrix();
    //   this.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    // });
  }
  update() {
    this.renderer.render(this.scene, this.camera);
  }
  //自适应
  // resize(canvas) {
  //   // this.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  //   // this.camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
  //   this.camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
  //   this.camera.updateProjectionMatrix();
  //   this.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  // }
  //添加环境光
  addAmbientLight(intensity = 1, color = 0xffffff) {
    // 环境光
    let light = new THREE.AmbientLight(color, intensity);
    this.scene.add(light);
    return light; //可以在外部修改一下他的位置等属性
  }
  //添加平行光
  addDirLight(intensity = 1, color = 0xffffff) {
    let light = new THREE.DirectionalLight({ intensity, color });
    this.scene.add(light);
    return light; //可以在外部修改一下他的位置等属性
  }

  initAxesHelper() {
    let axesHelper = new THREE.AxesHelper(100);
    this.scene.add(axesHelper);
  }
}
