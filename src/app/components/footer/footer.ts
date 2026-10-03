import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Modal } from '../../shared/components/modal/modal';

@Component({
  imports: [TranslatePipe, Modal],
  selector: 'app-footer',
  styleUrl: './footer.scss',
  templateUrl: './footer.html',
})
export class Footer {
  readonly year = new Date().getFullYear();
  protected privacyOpen = false;

  protected openPrivacy(): void {
    this.privacyOpen = true;
  }

  protected closePrivacy(): void {
    this.privacyOpen = false;
  }
}
