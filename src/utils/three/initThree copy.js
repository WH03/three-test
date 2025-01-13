import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; //轨道控制器
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";//DRACOLoader模块
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; //GLTF模块
import { PCDLoader } from 'three/addons/loaders/PCDLoader.js';//PCDLoader模块
class baseScene {
  constructor(domSelector) {
    this.camera = null;
    this.scene = null;
    this.container = document.querySelector(domSelector);
    this.renderer = null;
    this.controls = null;
    this.renderAnimation = null;
    this.currentModel = null
    this.modelsArr = [];//模型数组

    this.pathIndex = 1000//小车的运动轨迹点索引

    // 初始尺寸
    const { width, height } = this.container.getBoundingClientRect();
    this.width = width;
    this.height = height;
    this.sphereMesh = null
    this.clickPoints = []

    this.progress = 0; // 物体运动时在运动路径的初始位置，范围0~1
    this.velocity = 0.001; // 影响运动速率的一个值，范围0~1，需要和渲染频率结合计算才能得到真正的速率
    this.gltfModel = null;

    // 屏幕自适应
    window.addEventListener("resize", () => this.onResize());

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

    // this.sceneAnimation()//场景动画
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
    // this.renderer.setClearColor('#add8e6');
    this.renderer.setClearColor('#708090');
    this.container.appendChild(this.renderer.domElement);
  }



  // 更新渲染器
  update() {
    this.renderer.render(this.scene, this.camera);
  }

  // 动画更新
  // sceneAnimation() {
  //   // console.log(`output->111`)
  //   this.renderAnimation = requestAnimationFrame(this.sceneAnimation.bind(this));
  //   this.update();
  //   this.controls.update();

  //   const delta = this.clock.getDelta();

  //   if (this.mixer) {
  //     this.mixer.update(delta);
  //   }
  //   this.modelMove();
  // }


  sceneAnimation(callback) {
    callback();
    // this.frameId = requestAnimationFrame(() => this.sceneAnimation(callback));
    this.frameId = requestAnimationFrame(() => this.sceneAnimation(callback));
  }



  modelMove() {
    //参考路径的索引在1001~0中往复减少以实现小车循环行驶
    if (this.pathIndex === 0) {
      this.pathIndex = 1001;
    }
    this.pathIndex -= 1;
    if (this.robot) {// 判断agv加载完成后，开始不断更新agv的位置
      const sphereCurveIndex = this.pathIndex / 1000; // //取相参考径上当前点的坐标，取值0~1
      const positionVec = this.curveLine.getPointAt(sphereCurveIndex);//获取曲线上位置的点，传值为0-1的小数表示整个线段的位置
      this.robot.position.set(positionVec.x, positionVec.y, positionVec.z);//设置新的agv位置
      const tangent = this.curveLine.getTangentAt(sphereCurveIndex); // 返回一个点t在曲线上位置向量的法线向量（getTangentAt是返回曲线上某个点的切线）
      const lookAtVec = tangent.add(positionVec);// 位置向量和切线向量相加即为所需朝向的点向量
      this.robot.lookAt(lookAtVec);//设置agv的模型朝向为切线的方向
    }
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
  loadPCDModel(pcdFile, scale, rotation) {
    const pcdLoader = new PCDLoader();
    pcdLoader.load(pcdFile, (obj) => {
      // console.log(`output->obj`, obj)
      obj.geometry.center();
      obj.name = 'pcd';
      obj.scale.set(scale.x, scale.y, scale.z);
      obj.rotation.set(rotation.x, rotation.y, rotation.z);
      // obj.position.set(position.x, position.y, position.z);
      this.scene.add(obj);
      // this.modelsArr.push(obj)
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

      // console.log(`output->obj.scene`, obj.scene)
      obj.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          this.modelsArr.push(child)
        }
      });

      obj.scene.scale.set(scale.x, scale.y, scale.z);
      obj.scene.rotation.set(rotation.x, rotation.y, rotation.z);
      obj.scene.position.set(position.x, position.y, position.z);
      this.scene.add(obj.scene);
      this.gltfModel = obj.scene
    });
  }

  // 导入精灵模型
  loadSpriteModel(color, scale, rotation, position) {
    let sprite = new THREE.Sprite(new THREE.SpriteMaterial({ color: color }));
    sprite.scale.set(scale.x, scale.y, scale.z);
    sprite.rotation.set(rotation.x, rotation.y, rotation.z);
    sprite.position.set(position.x, position.y, position.z);
    this.scene.add(sprite);
    this.modelsArr.push(sprite)
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
    this.modelsArr.push(mesh)
    return mesh
  }

  //创建球
  addSphere(position, visible) {
    const sphereGeometry = new THREE.SphereGeometry(0.2);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    this.sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.sphereMesh.position.set(position.x, position.y, position.z);
    this.sphereMesh.visible = visible;
    this.scene.add(this.sphereMesh);
    return this.sphereMesh
  }

  // 创建线
  addLine(points) {
    const material = new THREE.LineBasicMaterial({
      color: 0x0000ff
    });

    // const points = [];
    // points.push(new THREE.Vector3(- 10, 0, 0));
    // points.push(new THREE.Vector3(0, 10, 0));
    // points.push(new THREE.Vector3(10, 0, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const line = new THREE.Line(geometry, material);
    this.scene.add(line);
  }


  addCurveLine(points) {
    this.curveLine = new THREE.CatmullRomCurve3(
      points,
      // [
      //   new THREE.Vector3(-3, 4, 2),
      //   new THREE.Vector3(3, 4, 2),
      //   new THREE.Vector3(3, 4, -2),
      // ]
    );

    this.curveLine.curveType = "catmullrom";
    // this.curveLine.closed = true; //设置是否闭环
    this.curveLine.tension = 0.5; //设置线的张力，0为无弧度折线

    //参考路径上取1000个点
    const pathPoints = this.curveLine.getPoints(points.length);
    // console.log(`output->pathPoints`, pathPoints)
    //绘制一条路径参考线与上面的线重合，方便查看小车的行动轨迹
    const geometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
    const material = new THREE.LineBasicMaterial({ color: '#0ff' });//设置线条的颜色和宽度
    const curveObject = new THREE.Line(geometry, material);
    this.scene.add(curveObject);



    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(`draco/gltf/`);
    dracoLoader.setDecoderConfig({ type: "js" });
    dracoLoader.preload();
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.load("/models/gltf/Soldier.glb", (gltf) => {
      // gltfLoader.load("/models/gltf/RobotExpressive/RobotExpressive.glb", (gltf) => {

      this.robot = gltf.scene;
      console.log(`output-> gltf.scene`, gltf.scene)
      // this.robot.scale.set(0.1, 0.1, 0.1)
      // this.robot.rotation.set(Math.PI, Math.PI, Math.PI)
      this.robot.position.set(pathPoints[0].x, pathPoints[0].y, pathPoints[0].z)   // 模型位置
      this.scene.add(this.robot)   // 加入场景

      this.mixer = new THREE.AnimationMixer(this.robot);
      // console.log(`output->gltf`, gltf)
      this.mixer.clipAction(gltf.animations[3]).play();
      // this.mixer.clipAction(gltf.animations[0]).play();
    })
  }





  // // 鼠标事件
  // initRaycaster(eventName, models) {
  //   this.raycaster = new THREE.Raycaster();
  //   this.container.addEventListener(eventName, this.rayEventFn.bind(this, models), false);
  // }

  // rayEventFn(models, event) {
  //   const { width, height, top, left } = this.container.getBoundingClientRect();
  //   const mouse = {
  //     x: ((event.clientX - left) / width) * 2 - 1,
  //     y: -((event.clientY - top) / height) * 2 + 1,
  //   };
  //   this.raycaster.setFromCamera(mouse, this.camera);// 设置射线

  //   // let intersects = this.raycaster.intersectObjects(models, true)[0];// 射线与模型相交
  //   let intersect = this.raycaster.intersectObjects(models, true)[0];// 射线与模型相交
  //   this.changeSelect(intersect)
  // }

  // // 修改颜色
  // changeSelect(intersectObject) {
  //   // 若之前已有模型被选择，且不等于当前所选择的模型，取消之前选择的的高亮,还原为原来的颜色
  //   if (this.currentModel && this.currentModel !== intersectObject) {
  //     this.currentModel.object.material = this.currentModel.object._orgMaterial;
  //   }

  //   if (intersectObject) {//若当前所选对象不为空：
  //     if (intersectObject !== this.currentModel) {//若当前所选对象不等于上一次所选对象：
  //       this.currentModel = intersectObject;  //获取选中模型
  //       let curObject = this.currentModel.object
  //       let _orgMaterial = this.currentModel.object.material; // 存一下原来的材质 
  //       curObject._orgMaterial = _orgMaterial

  //       curObject.currentHex = curObject.material.emissive.getHex();
  //       curObject.material = _orgMaterial.clone();
  //       curObject.material.emissive.setHex('0x00FF00');//  将模型高亮。
  //     }
  //   } else  {
  //     this.currentModel = null//置空当前所选
  //   }
  // }

  // 鼠标事件
  initRaycaster(eventName, models) {
    this.raycaster = new THREE.Raycaster();
    // this.addLine()
    // this.addSphere({ x: 0, y: 0, z: 0 }, false)
    this.container.addEventListener(eventName, (event) => this.rayEventFn(models, event), false);
  }

  // 处理射线事件
  rayEventFn(models, event) {
    event.preventDefault();  // 阻止默认表单提交行为
    const { width, height, top, left } = this.container.getBoundingClientRect();
    const mouse = {
      x: ((event.clientX - left) / width) * 2 - 1,
      y: -((event.clientY - top) / height) * 2 + 1,
    };
    this.raycaster.setFromCamera(mouse, this.camera); // 设置射线

    const intersect = this.raycaster.intersectObjects(models, true)[0]; // 射线与模型相交
    // this.changeSelect(intersect); // 修改高亮
    if (intersect) {
      // this.changeSelect(intersect);
      // console.log("交叉点坐标intersect.point:", intersect.point);
      // console.log("交叉对象intersect.object:", intersect.object);
      // console.log("射线原点和交叉点距离intersect.distance:", intersect.distance);
      // this.addSphere()
      // this.sphereMesh.visible = true;
      // this.sphereMesh.position.copy(intersect.point);
      this.addSphere(intersect.point, true);//添加圆点
      this.clickPoints.push(intersect.point)//保存原点
      this.addLine(this.clickPoints)//画线
    } else {
      // this.sphereMesh.visible = false;
    }
    return this.clickPoints
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



  // 释放资源
  // dispose() {
  //   if (this.renderAnimation) {
  //     cancelAnimationFrame(this.renderAnimation);
  //   }
  //   if (this.renderer) {
  //     this.renderer.dispose();
  //   }
  //   if (this.camera) {
  //     this.camera.clear();
  //   }
  // }


}


export { baseScene }