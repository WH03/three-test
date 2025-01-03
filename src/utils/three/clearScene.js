// import * as THREE from 'three';

// /**
//  * 清除模型，模型中有 group 和 scene, 需要进行判断
//  * @param myObjects: 要清除的对象
//  * @param scene: 当前场景
//  * @returns
//  */
// function clearScene(myObjects, scene) {
//   // 从 scene 中删除模型并释放内存
//   if (myObjects.length > 0) {
//     const processed = new Set(); // 使用 Set 来去重，避免重复处理

//     for (let i = 0; i < myObjects.length; i++) {
//       const currObj = myObjects[i];

//       // 判断类型
//       if (!processed.has(currObj)) {
//         processed.add(currObj); // 标记该对象为已处理
//         // 判断是否是场景或组对象
//         if (currObj instanceof THREE.Scene) {
//           const children = currObj.children;
//           for (let j = 0; j < children.length; j++) {
//             deleteGroup(children[j], processed); // 递归清理场景中的对象
//           }
//         } else {
//           deleteGroup(currObj, processed);
//         }
//         scene.remove(currObj);
//       }
//     }
//   }
// }

// // 删除 group 中的 mesh，并释放内存
// function deleteGroup(group, processed) {
//   if (!group) return;

//   // 如果已经处理过该对象，避免无限递归
//   if (processed.has(group)) return;
//   processed.add(group);

//   // 删除所有的 mesh 对象
//   group.traverse(function (item) {
//     if (item instanceof THREE.Mesh) {
//       item.geometry.dispose(); // 删除几何体
//       item.material.dispose(); // 删除材质
//     }
//   });

//   // 递归处理子对象
//   if (group instanceof THREE.Group || group instanceof THREE.Scene) {
//     group.children.forEach(child => deleteGroup(child, processed));
//   }
// }

// function disposeChild(mesh) {
//   if (mesh instanceof THREE.Mesh) {
//     if (mesh.geometry?.dispose) {
//       mesh.geometry.dispose(); // 删除几何体
//     }
//     if (mesh.material?.dispose) {
//       mesh.material.dispose(); // 删除材质
//     }
//     if (mesh.material?.texture?.dispose) {
//       mesh.material.texture.dispose(); // 删除纹理
//     }
//   }
//   if (mesh instanceof THREE.Group) {
//     mesh.clear();
//   }
//   if (mesh instanceof THREE.Object3D) {
//     mesh.clear();
//   }
// }

// export { clearScene, disposeChild };
import * as THREE from 'three';

/**
 * 清除模型，模型中有 group 和 scene 需要进行判断
 * @param myObjects: 要清除的对象数组
 * @param scene: 当前场景
 * @param camera: 当前相机
 * @param renderer: 当前渲染器
 */
function clearScene(myObjects, scene, camera, renderer) {
  // 从 scene 中删除模型并释放内存
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

      // 从 scene 中删除对象
      scene.remove(currObj);
    }
  }

  // 销毁渲染器
  if (renderer) {
    renderer.dispose();
    console.log("Renderer disposed");
  }

  // 销毁相机
  if (camera) {
    if (camera instanceof THREE.PerspectiveCamera) {
      // 释放相关的相机资源
      camera.clear();
      console.log("Camera disposed");
    }
  }
}

/**
 * 删除group内的所有对象并释放内存
 * @param group: 要清除的模型组
 */
function deleteGroup(group) {
  if (!group) return;
  
  // 删除掉所有的模型组内的 mesh
  group.traverse(function (item) {
    if (item instanceof THREE.Mesh) {
      item.geometry.dispose(); // 删除几何体
      item.material.dispose(); // 删除材质
    }
  });
}

/**
 * 释放 mesh 的内存
 * @param mesh: 要销毁的 mesh
 */
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
