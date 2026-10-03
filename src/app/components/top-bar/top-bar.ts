import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ShadowButton } from '../../shared/components/shadow-button/shadow-button';

@Component({
  imports: [TranslatePipe, ShadowButton],
  selector: 'app-top-bar',
  styleUrl: './top-bar.scss',
  templateUrl: './top-bar.html',
})
export class TopBar {}
