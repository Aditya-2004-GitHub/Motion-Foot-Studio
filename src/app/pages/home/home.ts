import { Component, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';

declare var gsap: any;
declare var ScrollTrigger: any;
declare var THREE: any;

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class Home implements AfterViewInit {

    ngAfterViewInit() {
        this.initThree();
        this.initHeroAnimations();
    }

    initThree() {
        const mount = document.getElementById('hero-3d-scene');
        if (!mount) return;

        // Remove existing canvas if navigating back
        const canvas = document.getElementById('three-canvas') as HTMLCanvasElement;
        if (!canvas) return;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
        camera.position.set(0, 0, 30);

        const shapes: any[] = [];
        const geometries = [
            new THREE.TetrahedronGeometry(1.2),
            new THREE.OctahedronGeometry(1),
            new THREE.IcosahedronGeometry(.8),
            new THREE.TorusGeometry(.8, .3, 8, 16),
            new THREE.BoxGeometry(1.2, 1.2, 1.2),
        ];
        const matBlue = new THREE.MeshPhongMaterial({ color: 0x2E6DC6, transparent: true, opacity: .18, wireframe: false });
        const matAmber = new THREE.MeshPhongMaterial({ color: 0xF5A623, transparent: true, opacity: .15, wireframe: false });
        const matLight = new THREE.MeshPhongMaterial({ color: 0xd6e8f8, transparent: true, opacity: .12, wireframe: true });

        for (let i = 0; i < 28; i++) {
            const geo = geometries[Math.floor(Math.random() * geometries.length)];
            const mat = i % 3 === 0 ? matAmber : (i % 3 === 1 ? matBlue : matLight);
            const mesh = new THREE.Mesh(geo, mat.clone());
            mesh.position.set((Math.random() - .5) * 60, (Math.random() - .5) * 40, (Math.random() - .5) * 20 - 5);
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            const s = .4 + Math.random() * 1.2;
            mesh.scale.set(s, s, s);
            mesh.userData = { rx: (Math.random() - .5) * .008, ry: (Math.random() - .5) * .012, fy: (Math.random() - .5) * .006, oy: mesh.position.y };
            scene.add(mesh);
            shapes.push(mesh);
        }

        const particleGeo = new THREE.BufferGeometry();
        const pCount = 120;
        const positions = new Float32Array(pCount * 3);
        for (let i = 0; i < pCount; i++) { positions[i * 3] = (Math.random() - .5) * 80; positions[i * 3 + 1] = (Math.random() - .5) * 60; positions[i * 3 + 2] = (Math.random() - .5) * 30 - 10; }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({ color: 0x2E6DC6, size: .22, transparent: true, opacity: .35 });
        scene.add(new THREE.Points(particleGeo, particleMat));

        scene.add(new THREE.AmbientLight(0xd6e8f8, 1.2));
        const dLight = new THREE.DirectionalLight(0xF5A623, 1.5);
        dLight.position.set(10, 10, 10);
        scene.add(dLight);
        const pLight = new THREE.PointLight(0x2E6DC6, 2, 60);
        pLight.position.set(-10, 5, 10);
        scene.add(pLight);

        let t = 0;
        let mouseX = 0, mouseY = 0;
        const onMouseMove = (e: MouseEvent) => { mouseX = (e.clientX / window.innerWidth - .5) * 2; mouseY = (e.clientY / window.innerHeight - .5) * 2; };
        document.addEventListener('mousemove', onMouseMove);

        const animate = () => {
            requestAnimationFrame(animate);
            t += 0.008;
            shapes.forEach((m, i) => {
                m.rotation.x += m.userData.rx;
                m.rotation.y += m.userData.ry;
                m.position.y = m.userData.oy + Math.sin(t + i) * 1.2;
            });
            camera.position.x += (mouseX * 3 - camera.position.x) * 0.04;
            camera.position.y += (-mouseY * 2 - camera.position.y) * 0.04;
            camera.lookAt(scene.position);
            renderer.render(scene, camera);
        };
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    initHeroAnimations() {
        gsap.registerPlugin(ScrollTrigger);
        setTimeout(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.from('#hero-tag', { opacity: 0, y: 30, duration: .7 })
              .from('#hero-title', { opacity: 0, y: 50, duration: .9 }, '-=.3')
              .from('#hero-sub', { opacity: 0, y: 30, duration: .7 }, '-=.5')
              .from('#hero-btns', { opacity: 0, y: 20, duration: .6 }, '-=.4')
              .from('#hero-stats .stat-item', { opacity: 0, y: 20, stagger: .12, duration: .5 }, '-=.3');

            document.querySelectorAll('[data-count]').forEach(el => {
                const targetEl = el as HTMLElement;
                const target = +(targetEl.dataset['count'] || 0);
                gsap.to({ val: 0 }, { val: target, duration: 2, ease: 'power2.out', delay: 1.5, onUpdate: function(this: any) { targetEl.textContent = Math.floor(this.targets()[0].val).toString(); }, onComplete: () => { targetEl.textContent = target + '+'; } });
            });

            document.querySelectorAll('.reveal').forEach((el) => {
                ScrollTrigger.create({ trigger: el, start: 'top 85%', onEnter: () => el.classList.add('visible') });
            });
            document.querySelectorAll('.reveal-left,.reveal-right,.reveal-scale').forEach(el => {
                ScrollTrigger.create({ trigger: el, start: 'top 85%', onEnter: () => el.classList.add('visible') });
            });

            document.querySelectorAll('.service-card').forEach(card => {
                card.addEventListener('mousemove', (e: any) => {
                    const r = card.getBoundingClientRect();
                    const x = (e.clientX - r.left) / r.width - .5;
                    const y = (e.clientY - r.top) / r.height - .5;
                    gsap.to(card, { rotateY: x * 12, rotateX: -y * 8, duration: .4, ease: 'power2.out', transformPerspective: 800 });
                });
                card.addEventListener('mouseleave', () => { gsap.to(card, { rotateY: 0, rotateX: 0, duration: .5, ease: 'elastic.out(1,.7)' }); });
            });

            // Make sure ScrollTrigger refreshes after DOM updates
            ScrollTrigger.refresh();
        }, 100);
    }
}
