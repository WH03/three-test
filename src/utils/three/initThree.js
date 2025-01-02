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




    //屏幕自适应
    window.addEventListener("resize", () => {
      const { width, height } = this.container.getBoundingClientRect();
      // console.log(`output->offsetHeight###`, offsetHeight)
      //调整屏幕大小
      this.camera.aspect = width / height //摄像机宽高比例
      this.camera.updateProjectionMatrix() //相机更新矩阵，将3d内容投射到2d面上转换
      this.renderer.setSize(width, height)
      // this.effectComposer.setSize(offsetWidth * 2, offsetHeight * 2)
      // this.glowComposer.setSize(offsetWidth, offsetHeight)
    });

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
    const { width, height } = this.container.getBoundingClientRect();

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 2000);
    this.camera.position.set(position.x, position.y, position.z);
    this.camera.updateProjectionMatrix();
    this.scene.add(this.camera)
  }

  // 创建渲染器
  initRender() {
    const { width, height } = this.container.getBoundingClientRect();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }) //设置抗锯齿
    //设置屏幕像素比
    this.renderer.setPixelRatio(window.devicePixelRatio)
    //渲染的尺寸大小
    this.renderer.setSize(width, height)
    this.renderer.setClearColor('#add8e6');
    this.container.appendChild(this.renderer.domElement);

  }


  // 更新渲染器
  update() {
    this.renderer.render(this.scene, this.camera);
  }

  sceneAnimation() {
    this.renderAnimation = requestAnimationFrame(() => this.sceneAnimation());
    this.update()
    this.controls.update();
    return this.renderAnimation
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
  loadPCDModel(pcdFile, scaleX, scaleY, scaleZ, rotationX, rotationY, rotationZ, positionX, positionY, positionZ) {
    const pcdLoader = new PCDLoader();
    pcdLoader.load(pcdFile, (obj) => {
      obj.geometry.center();
      obj.name = 'pcd';
      obj.scale.set(scaleX, scaleY, scaleZ);
      obj.rotation.set(rotationX, rotationY, rotationZ);

      obj.position.set(positionX, positionY, positionZ);
      this.scene.add(obj);
    });
  }

  // 导入GLTF文件:模型路径，缩放比例，旋转角度，位置;加载draco压缩文件
  loadGLTFModel(gltfModel, scaleX, scaleY, scaleZ, rotationX, rotationY, rotationZ, positionX, positionY, positionZ) {
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(`draco/gltf/`);
    dracoLoader.setDecoderConfig({ type: "js" });
    dracoLoader.preload();
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.load(gltfModel, (obj) => {
      obj.scene.scale.set(scaleX, scaleY, scaleZ);
      obj.scene.rotation.set(rotationX, rotationY, rotationZ);
      obj.scene.position.set(positionX, positionY, positionZ);
      this.scene.add(obj.scene);
    });
  }





}
