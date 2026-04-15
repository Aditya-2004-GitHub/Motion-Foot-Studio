import { AfterViewInit, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './core/navbar/navbar';
import { Footer } from './core/footer/footer';
import gsap from 'gsap';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  protected readonly title = signal('motion-foot-studio');

  ngAfterViewInit() {
    const cursor = document.getElementById('cursor') as HTMLElement;
    const follower = document.getElementById('cursor-follower') as HTMLElement;

    let mx = 0, my = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      gsap.set(cursor, { x: mx, y: my, duration: 0 });
    });

    const followCursor = () => {
      fx += (mx - fx) * .12;
      fy += (my - fy) * .12;

      gsap.set(follower, { x: fx, y: fy });
      requestAnimationFrame(followCursor);
    };

    followCursor();

    const hoverElements = document.querySelectorAll(
      'a, button, .service-card, .portfolio-item, .team-card'
    );

    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        follower.classList.add('active');
      });

      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        follower.classList.remove('active');
      });
    });

    /* SMOOTH ANCHOR SCROLL (Home Page) */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        const target = href ? document.querySelector(href) : null;
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // close mobile menu
          const menu = document.getElementById('navMenu');
          if (menu && menu.classList.contains('show')) {
            menu.classList.remove('show');
          }
        }
      });
    });
  }

  // ngAfterViewInit() {
  // }
}
