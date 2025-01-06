import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; //轨道控制器
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";//DRACOLoader模块
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; //GLTF模块
import { PCDLoader } from 'three/addons/loaders/PCDLoader.js';//PCDLoader模块
export default class initThree {
  constructor(domSelector) {
    this.camera = null;
    this.scene = null;
    this.container = document.querySelector(domSelector);
    this.renderer = null;
    this.controls = null;
    this.renderAnimation = null;
    // 初始尺寸
    const { width, height } = this.container.getBoundingClientRect();
    this.width = width;
    this.height = height;


    // 屏幕自适应
    window.addEventListener("resize", this.onResize.bind(this));

    // document.addEventListener('pointermove', onPointerMove);

    this.init();

  }

  init() {
    //初始化场景
    this.initScene()
    //初始化相机
    this.initCamera()
    //初始化渲染器
    this.initRender()
    this.initControls()//控制器
    this.initAmbientLight()//环境光
    this.initDirectionalLight()//平行光
    this.update()//更新
    this.initAxesHelper()//辅助坐标轴

    this.sceneAnimation()//场景动画
  }



  // 创建场景
  initScene() {
    this.scene = new THREE.Scene()
  }

  // 创建相机
  initCamera(position = { x: 10, y: 10, z: 10 }) {
    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.01, 2000);
    this.camera.position.set(position.x, position.y, position.z);
    this.scene.add(this.camera);
  }

  // 创建渲染器
  initRender() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor('#add8e6');
    this.container.appendChild(this.renderer.domElement);
  }



  // 更新渲染器
  update() {
    this.renderer.render(this.scene, this.camera);
  }

  // 动画更新
  sceneAnimation() {
    // console.log(`output->111`)
    this.renderAnimation = requestAnimationFrame(this.sceneAnimation.bind(this));
    this.update();
    this.controls.update();
  }

  // 屏幕尺寸变化时更新
  onResize() {
    const { width, height } = this.container.getBoundingClientRect();
    if (width !== this.width || height !== this.height) {
      this.width = width;
      this.height = height;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  }

  //添加环境光
  initAmbientLight(intensity = 1, color = 0xffffff) {
    // 环境光
    let ambientLight = new THREE.AmbientLight(color, intensity);
    this.scene.add(ambientLight);
    return ambientLight; //可以在外部修改一下他的位置等属性
  }

  //添加平行光
  initDirectionalLight(intensity = 1, color = 0xffffff) {
    let directionalLight = new THREE.DirectionalLight({ intensity, color });
    directionalLight.position.set(100, 100, 0);
    this.scene.add(directionalLight);
    return directionalLight; //可以在外部修改一下他的位置等属性
  }
  //辅助坐标轴
  initAxesHelper() {
    let axesHelper = new THREE.AxesHelper(1000);
    this.scene.add(axesHelper);
  }
  // 创建控制器
  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
  }

  // 导入PCD文件
  loadPCDModel(pcdFile, scale, rotation, position) {
    const pcdLoader = new PCDLoader();
    pcdLoader.load(pcdFile, (obj) => {
      obj.geometry.center();
      obj.name = 'pcd';
      obj.scale.set(scale.x, scale.y, scale.z);
      obj.rotation.set(rotation.x, rotation.y, rotation.z);
      obj.position.set(position.x, position.y, position.z);
      this.scene.add(obj);
    });
  }

  // 导入GLTF文件:模型路径，缩放比例，旋转角度，位置;加载draco压缩文件
  loadGLTFModel(gltfModel, scale, rotation, position) {
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(`draco/gltf/`);
    dracoLoader.setDecoderConfig({ type: "js" });
    dracoLoader.preload();
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.load(gltfModel, (obj) => {


      obj.scene.scale.set(scale.x, scale.y, scale.z);
      obj.scene.rotation.set(rotation.x, rotation.y, rotation.z);
      obj.scene.position.set(position.x, position.y, position.z);
      this.scene.add(obj.scene);
    });
  }

  // 导入精灵模型
  loadSpriteModel(color = '#69f', scale, rotation, position) {
    let sprite = new THREE.Sprite(new THREE.SpriteMaterial({ color: color }));
    sprite.scale.set(scale.x, scale.y, scale.z);
    sprite.rotation.set(rotation.x, rotation.y, rotation.z);
    sprite.position.set(position.x, position.y, position.z);
    this.scene.add(sprite);
    return sprite
  }
  // 加载基础立方体
  loadCubeModel(color = '#69f', width, height, depth, scale, rotation, position) {
    let geometry = new THREE.BoxGeometry(width, height, depth);
    let material = new THREE.MeshBasicMaterial({ color: color });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(scale.x, scale.y, scale.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    mesh.position.set(position.x, position.y, position.z);
    this.scene.add(mesh);
    return mesh
  }



  // 初始化射线
  initRaycaster(eventName, models) {

    this.raycaster = new THREE.Raycaster();
    this.container.addEventListener(eventName, this.rayEventFn.bind(this, models), false);
  }

  rayEventFn(models, event) {
    const { width, height, top, left } = this.container.getBoundingClientRect();
    const mouse = {
      x: ((event.clientX - left) / width) * 2 - 1,
      y: -((event.clientY - top) / height) * 2 + 1,
    };

    this.raycaster.setFromCamera(mouse, this.camera);
    // const intersects = this.raycaster.intersectObjects(models, true)[0];
    // intersects.object.material.color.set('#f00');


    const intersects = this.raycaster.intersectObjects(models, true);
    if (intersects.length > 0) {
      const selectedObject = intersects[0].object;
      // 更新当前被点击的模型，并改变颜色
      selectedObject.material.color.set('#69f'); // 设置新的颜色

    }




  }



  // 释放资源
  dispose() {
    if (this.renderAnimation) {
      cancelAnimationFrame(this.renderAnimation);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.camera) {
      this.camera.clear();
    }
  }

  // 点击事件
  // initRaycaster(callback, models = this.scene.children, eventName = "click") {
  //   this.raycaster = new THREE.Raycaster();
  //   this.rayFn = this.rayEventFn.bind(this, models, callback);
  //   // 绑定点击事件
  //   this.el.addEventListener(eventName, this.rayFn);
  // }





}
