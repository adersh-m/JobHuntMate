import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-illustration',
  standalone: true,
  template: `
    <img
      [src]="'/' + imageName"
      [alt]="alt || 'JobHuntMate Illustration'"
      class="w-full h-full object-cover object-center max-h-screen md:max-h-none md:h-full md:w-full md:rounded-none rounded-b-2xl shadow-lg transition-all duration-300"
      style="max-width:100%;height:100%;min-height:0;"
      loading="eager"
    />
  `
})
export class AuthIllustrationComponent {
  @Input() imageName: string = 'brand-image.png';
  @Input() alt?: string;
}
