
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; //GLTF模块
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";//DRACOLoader模块
import { PCDLoader } from 'three/addons/loaders/PCDLoader.js';//PCDLoader模块

/* 加载模型 */
class LoadModel {
    constructor(baseThree) {//加载模型
        this.baseThree = baseThree
        this.loaderGLTF = new GLTFLoader() // 加载gltf模型
        // this.loaderFBX = new FBXLoader() // 加载fbx模型
        this.dracoLoader = new DRACOLoader() // 加载draco模型(加载基于Google Draco压缩格式的3D模型的类)
        this.dracoLoader.setDecoderPath(`draco/gltf/`); // 设置draco模型解码器路径
        this.loaderGLTF.setDRACOLoader(this.dracoLoader) // 设置draco模型加载器

        this.pathIndex = 1000//小车的运动轨迹点索引
        // this.sphereMesh = null
    }

    // 加载模型
    /* 
        modelUrl:模型路径
        callback:加载完成后的回调
        progress:加载进度
    */
    loadGLTFModel(modelUrl, callback, progress) {
        this.loaderGLTF.load(modelUrl, (model) => {
            this.baseThree.scene.add(model.scene);
            callback(model);
        }, xhr => {
            progress?.(xhr.loaded / xhr.total)
        }, error => {
            console.error('模型渲染报错：', error)
        });
    }

    // 播放动画
    startAnimation(model, i) {
        if (model.animations.length < 1) {
            return
        }
        this.baseThree.mixer = new THREE.AnimationMixer(model.scene);
        this.baseThree.mixer.clipAction(model.animations[i]).play();
    }

    // 导入PCD文件
    loadPCDModel(modelUrl, callback, progress) {
        const pcdLoader = new PCDLoader();
        pcdLoader.load(modelUrl, (model) => {
            callback(model);
            this.baseThree.scene.add(model);

        }, (xhr) => {
            progress?.(xhr.loaded / xhr.total)
        });
    }



    //创建球
    loadSphere(position, visible) {
        const sphereGeometry = new THREE.SphereGeometry(0.2);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

        this.sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.sphereMesh.position.set(position.x, position.y, position.z);
        this.sphereMesh.visible = visible;
        this.baseThree.scene.add(this.sphereMesh);
        return this.sphereMesh
    }

    // 创建线
    loadLine(points) {
        const material = new THREE.LineBasicMaterial({
            color: 0x0000ff
        });
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        this.baseThree.scene.add(line);
    }





    addCurveLine(points) {
        this.curveLine = new THREE.CatmullRomCurve3(
            points,
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
        this.baseThree.scene.add(curveObject);



        const gltfLoader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(`draco/gltf/`);
        dracoLoader.setDecoderConfig({ type: "js" });
        dracoLoader.preload();
        gltfLoader.setDRACOLoader(dracoLoader);
        gltfLoader.load("/models/gltf/Soldier.glb", (gltf) => {
            this.robot = gltf.scene;
            console.log(`output-> gltf.scene`, gltf.scene)
            // this.robot.scale.set(0.1, 0.1, 0.1)
            // this.robot.rotation.set(Math.PI, Math.PI, Math.PI)
            // model.scene.position.set(pointList[0].x, pointList[0].y, pointList[0].z)   // 模型位置
            this.robot.position.set(pathPoints[0].x, pathPoints[0].y, pathPoints[0].z)   // 模型位置
            this.baseThree.scene.add(this.robot)   // 加入场景

            this.baseThree.mixer = new THREE.AnimationMixer(this.robot);
            // console.log(`output->gltf`, gltf)
            this.baseThree.mixer.clipAction(gltf.animations[3]).play();
            // this.mixer.clipAction(gltf.animations[0]).play();
        })



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
}



export { LoadModel };