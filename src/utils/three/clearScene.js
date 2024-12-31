import * as THREE from 'three';
/**
 * 清除模型，模型中有 group 和 scene,需要进行判断
 * @param myObjects:要清除的对象
 * @param  scene:当前场景
 * @returns
 */

function clearScene(myObjects, scene) {
  // 从scene中删除模型并释放内存
  if (myObjects.length > 0) {
    for (let i = 0; i < myObjects.length; i++) {
      const currObj = myObjects[i];

      // 判断类型
      if (currObj instanceof THREE.Scene) {
        const children = currObj.children;
        for (let i = 0; i < children.length; i++) {
          deleteGroup(children[i]);
        }
      } else {
        deleteGroup(currObj);
      }
      scene.remove(currObj);
    }
  }
}

// 删除group，释放内存
function deleteGroup(group) {
  // console.log(group);
  if (!group) return;
  // 删除掉所有的模型组内的mesh
  group.traverse(function (item) {
    if (item instanceof THREE.Mesh) {
      item.geometry.dispose(); // 删除几何体
      item.material.dispose(); // 删除材质
    }
  });
}
// export default {
//   clearScene
// }

function disposeChild(mesh) {
  if (mesh instanceof THREE.Mesh) {
    if (mesh.geometry?.dispose) {
      mesh.geometry.dispose(); // 删除几何体
    }
    if (mesh.material?.dispose) {
      mesh.material.dispose(); // 删除材质
    }
    if (mesh.material?.texture?.dispose) {
      mesh.material.texture.dispose();
    }
  }
  if (mesh instanceof THREE.Group) {
    mesh.clear();
  }
  if (mesh instanceof THREE.Object3D) {
    mesh.clear();
  }
}

export { clearScene, disposeChild };
