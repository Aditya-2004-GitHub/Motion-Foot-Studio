import { Component } from "@angular/core";
import { commonAnimationService } from "../../shared/commonAnimation";

@Component({
  selector: 'app-industrial-photography',
  templateUrl: './industrial-photography.html',
  styleUrl: '../service.css',
  imports: []
})

export class IndustrialPhotography{
  constructor(
    private animation: commonAnimationService
  ) { }

  ngAfterViewInit(): void {
    this.animation.initThreeBackground('svc-hero-canvas');

    gsap.registerPlugin(ScrollTrigger);
    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => {
        ScrollTrigger.create({ trigger: el, start: 'top 85%', onEnter: () => el.classList.add('visible') });
      });
      document.querySelectorAll('.reveal-left,.reveal-right,.reveal-scale,.reveal-top,.reveal-bottom,.d1,.d2,.d3,.d4,.d5').forEach(el => {
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
      ScrollTrigger.refresh();
    }, 100);

  }
}
