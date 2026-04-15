import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
    title: 'Home'
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services').then(m => m.Services),
    title: 'Services'
  },
  {
    path: 'services/3d-animation',
    loadComponent: () => import('./services/3d-animation/3d-animation').then(m => m.Animation3D)
  },
  {
    path: 'services/2d-animation',
    loadComponent: () => import('./services/2d-animation/2d-animation').then(m => m.Animation2D)
  },
  {
    path: 'services/pre-production',
    loadComponent: () => import('./services/pre-production/pre-production').then(m => m.PreProduction)
  },
  {
    path: 'services/infographics',
    loadComponent: () => import('./services/infographics/infographics').then(m => m.Infographics)
  },
  {
    path: 'services/motion-graphics',
    loadComponent: () => import('./services/motion-graphics/motion-graphics').then(m => m.MotionGraphics)
  },
  {
    path: 'services/corporate',
    loadComponent: () => import('./services/corporate/corporate').then(m => m.Corporate)
  },
  {
    path: 'services/graphic-design',
    loadComponent: () => import('./services/graphic-design/graphic-design').then(m => m.GraphicsDesign)
  },
  {
    path: 'services/live-and-corporate-shoot',
    loadComponent: () => import('./services/live-shoot/live-shoot').then(m => m.LiveShoot)
  },
  {
    path: 'services/industrial-photography',
    loadComponent: () => import('./services/industrial-photography/industrial-photography').then(m => m.IndustrialPhotography)
  },
];
