import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; //轨道控制器
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";//DRACOLoader模块
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; //GLTF模块
import { PCDLoader } from 'three/addons/loaders/PCDLoader.js';//PCDLoader模块
import Stats from 'three/addons/libs/stats.module.js';
import TWEEN from "three/examples/jsm/libs/tween.module.js";

export default class baseScene {
  constructor(domSelector) {
    this.container = document.querySelector(domSelector);
    const { width, height } = this.container.getBoundingClientRect();
    // 初始尺寸
    this.width = width;
    this.height = height;
    this.camera = null;
    this.scene = null;
    this.renderer = null;
    this.controls = null;
    this.renderAnimation = null;
    this.currentModel = null
    this.modelsArr = [];//模型数组
    this.mixer = null
    this.pathIndex = 1000//小车的运动轨迹点索引

    this.sphereMesh = null
    this.clickPoints = []



    this.gltfModel = null;
    // 屏幕自适应
    window.addEventListener("resize", () => this.onResize());
    this.init();
  }

  init() {
    this.initScene()    //初始化场景
    this.initCamera()//初始化相机
    this.initRender()//创建渲染器
    this.initControls()//控制器
    this.initAmbientLight()//环境光
    this.initDirectionalLight()//平行光
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
    this.renderer.setClearColor('#708090');
    this.container.appendChild(this.renderer.domElement);
  }

  // 更新渲染器
  update() {
    this.renderer.render(this.scene, this.camera);
  }

  // 动画帧
  sceneAnimation(callback) {
    this.update();
    callback();//回调
    this.frameId = requestAnimationFrame(() => this.sceneAnimation(callback));
    this.controls.update();

    this.stats?.update();
    this.tween?.update();

  }

  addStats() {
    this.stats = new Stats();
    // this.stats.setMode(0)
    // 设置监视器位置
    this.stats.domElement.style.position = 'absolute'
    this.stats.domElement.style.left = '95%'
    this.stats.domElement.style.top = '0px'
    this.container.appendChild(this.stats.domElement);
  }


  flyTo(newPos, newTarget, callBack) {
    this.tween = new TWEEN.Tween({
      x1: this.camera.position.x, // 相机x
      y1: this.camera.position.y,  // 相机y
      z1: this.camera.position.z, // 相机z
      x2: this.controls.target.x, // 控制点的中心点x
      y2: this.controls.target.y, // 控制点的中心点y
      z2: this.controls.target.z // 控制点的中心点z
    })
    this.tween.to({
      x1: newPos.x,
      y1: newPos.y,
      z1: newPos.z,
      // x2: newTarget?.x || 0,
      // y2: newTarget?.y || 0,
      // z2: newTarget?.z || 0
    }, 2000)
    this.tween.onUpdate(object => {
      this.camera.position.x = object.x1
      this.camera.position.y = object.y1
      this.camera.position.z = object.z1
      // this.controls.target.x = object.x2
      // this.controls.target.y = object.y2
      // this.controls.target.z = object.z2
      // this.controls.update()
    })
    this.tween.onComplete(() => {
      // this.controls.enabled = true
      // this.controls.update();
      callBack && callBack()
    })
    this.tween.easing(TWEEN.Easing.Cubic.InOut)
    this.tween.start()
  }

  // 加载环境贴图
  loadEnvMap(cubeMaps) {
    this.envLoader = new THREE.CubeTextureLoader().load(cubeMaps)
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

  // 鼠标事件
  initRaycaster(eventType, callback) {
    this.raycaster = new THREE.Raycaster();
    this.container.addEventListener(eventType, (event) => this.rayEventFn(callback, event), false);
  }

  // 处理射线事件
  rayEventFn(callback, event) {
    event.preventDefault();  // 阻止默认表单提交行为
    const { width, height, top, left } = this.container.getBoundingClientRect();
    const mouse = {
      x: ((event.clientX - left) / width) * 2 - 1,
      y: -((event.clientY - top) / height) * 2 + 1,
    };
    this.raycaster.setFromCamera(mouse, this.camera); // 设置射线

    const intersect = this.raycaster.intersectObjects(this.scene.children, true)[0]; // 射线与模型相交
    // this.changeSelect(intersect); // 修改高亮
    if (intersect) {
      // this.changeSelect(intersect);
      // console.log("交叉点坐标intersect.point:", intersect.point);
      // console.log("交叉对象intersect.object:", intersect.object);
      // console.log("射线原点和交叉点距离intersect.distance:", intersect.distance);
      // this.addSphere()
      // this.sphereMesh.visible = true;
      // this.sphereMesh.position.copy(intersect.point);
      // this.addSphere(intersect.point, true);//添加圆点
      // this.clickPoints.push(intersect.point)//保存原点
      // this.addLine(this.clickPoints)//画线
      callback(intersect)
    }

    // else {
    //   // this.sphereMesh.visible = false;
    // }
    // return this.clickPoints
  }







  // 修改颜色
  changeSelect(intersectObject) {
    if (this.currentModel && this.currentModel !== intersectObject) {
      // 取消之前选择的模型的高亮，恢复原材质
      this.resetModelMaterial(this.currentModel.object);
    }

    if (intersectObject) {
      // 若选中的对象与当前选中的对象不同，进行高亮
      if (intersectObject !== this.currentModel) {
        this.currentModel = intersectObject;
        const curObject = this.currentModel.object;
        this.highlightModelMaterial(curObject); // 高亮选中的模型
      }
    } else {
      // 取消当前选择
      this.currentModel = null;
    }
  }

  // 恢复原材质
  resetModelMaterial(object) {
    if (object._orgMaterial) {
      object.material = object._orgMaterial; // 恢复原材质
      delete object._orgMaterial; // 删除缓存的原材质
    }
  }

  // 高亮选中模型
  highlightModelMaterial(object) {
    if (!object._orgMaterial) {
      // 缓存原材质
      object._orgMaterial = object.material;
    }
    // 进行高亮显示
    object.currentHex = object.material.emissive.getHex();// 获取原材质的高亮颜色
    object.material = object._orgMaterial.clone();// 克隆材质
    object.material.emissive.setHex(0x00FF00); // 高亮颜色，绿色
  }



  clearScene(myObjects) {
    // 从 scene 中删除模型并释放内存
    if (myObjects.length > 0) {
      for (let i = 0; i < myObjects.length; i++) {
        const currObj = myObjects[i];

        // 判断类型
        if (currObj instanceof THREE.Scene) {
          const children = currObj.children;
          for (let i = 0; i < children.length; i++) {
            this.deleteGroup(children[i]);
          }
        } else {
          this.deleteGroup(currObj);
        }

        // 从 scene 中删除对象
        this.scene.remove(currObj);
      }
    }
    if (this.renderAnimation) {
      cancelAnimationFrame(this.renderAnimation);
    }
    this.controls && this.controls.dispose();
    // 销毁相机
    if (this.camera) {
      if (this.camera instanceof THREE.PerspectiveCamera || this.camera instanceof THREE.OrthographicCamera) {
        // 释放相关的相机资源
        this.camera.clear();
      }
    }
    // 销毁帧率监测
    if (this.stats) {
      this.container.removeChild(this.stats.domElement);
      this.stats = null;
    }
    // 销毁渲染器
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      this.renderer.setAnimationLoop(null);
      this.renderer.domElement = null;
      this.renderer.content = null;
      console.log('清空资源', this.renderer.info);
      // this.renderer = null;
    }




    window.removeEventListener("resize", () => this.onResize());
  }

  /**
   * 删除group内的所有对象并释放内存
   * @param group: 要清除的模型组
   */
  deleteGroup(group) {
    if (!group) return;
    // 删除掉所有的模型组内的 mesh
    group.traverse(function (item) {
      if (item instanceof THREE.Mesh) {
        item.geometry.dispose(); // 删除几何体
        item.material.dispose(); // 删除材质
      }
    });
  }


}

