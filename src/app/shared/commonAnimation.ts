import { Injectable } from "@angular/core";

declare var THREE: any

@Injectable({
  providedIn: 'root'
})

export class commonAnimationService {
  initThreeBackground(canvasId: any) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof THREE === 'undefined') return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, canvas.parentElement ? canvas.parentElement.offsetHeight : window.innerHeight);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / (canvas.parentElement ? canvas.parentElement.offsetHeight : window.innerHeight), 0.1, 200);
    camera.position.set(0, 0, 30);
    const shapes: any = [];
    const geometries = [
      new THREE.TetrahedronGeometry(1.2),
      new THREE.OctahedronGeometry(1),
      new THREE.IcosahedronGeometry(.8),
      new THREE.TorusGeometry(.8, .3, 8, 16),
      new THREE.BoxGeometry(1.2, 1.2, 1.2),
    ];
    const matBlue = new THREE.MeshPhongMaterial({ color: 0x2E6DC6, transparent: true, opacity: .18 });
    const matAmber = new THREE.MeshPhongMaterial({ color: 0xF5A623, transparent: true, opacity: .15 });
    const matLight = new THREE.MeshPhongMaterial({ color: 0xd6e8f8, transparent: true, opacity: .12, wireframe: true });
    for (let i = 0; i < 28; i++) {
      const geo = geometries[Math.floor(Math.random() * geometries.length)];
      const mat = i % 3 === 0 ? matAmber.clone() : (i % 3 === 1 ? matBlue.clone() : matLight.clone());
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set((Math.random() - .5) * 60, (Math.random() - .5) * 40, (Math.random() - .5) * 20 - 5);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const s = .4 + Math.random() * 1.2;
      mesh.scale.set(s, s, s);
      mesh.userData = { rx: (Math.random() - .5) * .008, ry: (Math.random() - .5) * .012, oy: mesh.position.y };
      scene.add(mesh); shapes.push(mesh);
    }
    // particles
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(120 * 3);
    for (let i = 0; i < 120; i++) { pPos[i * 3] = (Math.random() - .5) * 80; pPos[i * 3 + 1] = (Math.random() - .5) * 60; pPos[i * 3 + 2] = (Math.random() - .5) * 30 - 10; }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x2E6DC6, size: .22, transparent: true, opacity: .35 })));
    scene.add(new THREE.AmbientLight(0xd6e8f8, 1.2));
    const dl = new THREE.DirectionalLight(0xF5A623, 1.5); dl.position.set(10, 10, 10); scene.add(dl);
    const pl = new THREE.PointLight(0x2E6DC6, 2, 60); pl.position.set(-10, 5, 10); scene.add(pl);
    let t = 0, mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', e => { mouseX = (e.clientX / window.innerWidth - .5) * 2; mouseY = (e.clientY / window.innerHeight - .5) * 2; });
    function animate() {
      requestAnimationFrame(animate); t += .008;
      shapes.forEach((m: any, i: any) => { m.rotation.x += m.userData.rx; m.rotation.y += m.userData.ry; m.position.y = m.userData.oy + Math.sin(t + i) * 1.2; });
      camera.position.x += (mouseX * 3 - camera.position.x) * .04;
      camera.position.y += (-mouseY * 2 - camera.position.y) * .04;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    }
    animate();
    window.addEventListener('resize', () => {
      const h = canvas.parentElement ? canvas.parentElement.offsetHeight : window.innerHeight;
      camera.aspect = window.innerWidth / h;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, h);
    });
  }
}
