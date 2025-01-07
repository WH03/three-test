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
    this.intersected = null
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
  loadSpriteModel(color, scale, rotation, position) {
    let sprite = new THREE.Sprite(new THREE.SpriteMaterial({ color: color }));
    sprite.scale.set(scale.x, scale.y, scale.z);
    sprite.rotation.set(rotation.x, rotation.y, rotation.z);
    sprite.position.set(position.x, position.y, position.z);
    this.scene.add(sprite);
    return sprite
  }


  // 加载基础立方体
  loadCubeModel(color, width, height, depth, scale, rotation, position) {
    let geometry = new THREE.BoxGeometry(width, height, depth);
    // let material = new THREE.MeshBasicMaterial({ color: color });
    let material = new THREE.MeshLambertMaterial({ color: color });

    let mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(scale.x, scale.y, scale.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    mesh.position.set(position.x, position.y, position.z);
    this.scene.add(mesh);
    return mesh
  }



  // 鼠标事件
  initRaycaster(eventName, models) {
    this.raycaster = new THREE.Raycaster();
    this.container.addEventListener(eventName, this.rayEventFn.bind(this, models), false);
  }

  // rayEventFn(models, event) {
  //   let selectedObjectColor, selectedObject, originalColor;//记录当前选择的颜色
  //   const { width, height, top, left } = this.container.getBoundingClientRect();
  //   const mouse = {
  //     x: ((event.clientX - left) / width) * 2 - 1,
  //     y: -((event.clientY - top) / height) * 2 + 1,
  //   };

  //   this.raycaster.setFromCamera(mouse, this.camera);
  //   let intersects = this.raycaster.intersectObjects(models, true);
  //   if (intersects.length > 0) {
  //     selectedObject = intersects[0].object;
  //     selectedObjectColor = selectedObject.material.color.getHexString();//记录当前选择的颜色
  //     // 更新当前被点击的模型，并改变颜色
  //     selectedObject.material.color.set('#69f'); // 设置新的颜色
  //   } else {//没有选中任何模型
  //     console.log(`output->没有选中任何模型selectedObjectColor：`, selectedObjectColor)
  //   }

  // }


  rayEventFn(models, event) {
    const { width, height, top, left } = this.container.getBoundingClientRect();
    const mouse = {
      x: ((event.clientX - left) / width) * 2 - 1,
      y: -((event.clientY - top) / height) * 2 + 1,
    };
    this.raycaster.setFromCamera(mouse, this.camera);// 设置射线

    let intersects = this.raycaster.intersectObjects(models, true);// 射线与模型相交

    if (intersects.length > 0) {// 如果射线与模型相交
      if (this.intersected != intersects[0].object) {// 如果射线与上一次相交的模型不同
        // 如果上一次相交的模型存在
        if (this.intersected) {
          this.intersected.material.color.setHex(this.intersected.currentHex);
        }
        // 记录当前相交的模型
        this.intersected = intersects[0].object;
        // 记录当前相交的模型的颜色
        this.intersected.currentHex = this.intersected.material.color.getHex();
        // 将当前相交的模型的颜色设置为红色
        this.intersected.material.color.setHex(0xff0000);

      }
    } else {// 如果射线与模型不相交
      // 如果上一次相交的模型存在, 将上一次相交的模型的颜色设置为之前记录的颜色
      if (this.intersected) {
        this.intersected.material.color.setHex(this.intersected.currentHex);
      }
      // 将上一次相交的模型设置为 null
      this.intersected = null;
    }
  }

  // 执行
  // const _intersectObjects = raycaster.intersectObjects(this.modelsArr, true)
  // this.intersectObject = _intersectObjects[0];
  // this.changeSelect(this.intersectObject)

  // 修改颜色
  changeSelect(intersectObject) {
    // 若之前已有模型被选择，且不等于当前所选择的模型，取消之前选择的的高亮,还原为原来的颜色
    if (this.currentModel && this.currentModel !== intersectObject) {
      this.currentModel.object.material = this.currentModel.object._orgMaterial;
    }

    if (intersectObject) {//若当前所选对象不为空：
      if (intersectObject !== this.currentModel) {//若当前所选对象不等于上一次所选对象：
        this.currentModel = intersectObject;  //获取选中模型
        let curObject = this.currentModel.object
        let _orgMaterial = this.currentModel.object.material; // 存一下原来的材质 
        curObject._orgMaterial = _orgMaterial

        curObject.currentHex = curObject.material.emissive.getHex();
        curObject.material = _orgMaterial.clone();
        curObject.material.emissive.setHex('0x0000FF00');//  将模型高亮。
      }
    } else if (this.currentModel) {//
      this.currentModel = null//置空当前所选
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



}
