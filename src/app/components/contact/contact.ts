import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faEnvelope,
  faPaperPlane,
  faUser,
  faMessage,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { ShadowButton } from '../../shared/components/shadow-button/shadow-button';

@Component({
  imports: [FormsModule, TranslatePipe, FaIconComponent, ShadowButton],
  selector: 'app-contact',
  styleUrl: './contact.scss',
  templateUrl: './contact.html',
})
export class Contact {
  protected readonly faEnvelope = faEnvelope;
  protected readonly faPaperPlane = faPaperPlane;
  protected readonly faUser = faUser;
  protected readonly faMessage = faMessage;
  protected readonly faCheck = faCheck;
  protected readonly faLinkedin = faLinkedin;
  protected readonly faGithub = faGithub;
  protected readonly faInstagram = faInstagram;
  protected readonly faWhatsapp = faWhatsapp;

  protected name = '';
  protected email = '';
  protected message = '';
  protected sent = signal(false);

  protected onSubmit(): void {
    if (!this.name.trim() || !this.email.trim() || !this.message.trim()) {
      return;
    }

    const subject = encodeURIComponent(`Contato pelo Portfólio - ${this.name}`);
    const body = encodeURIComponent(
      `Nome: ${this.name}\nEmail: ${this.email}\n\nMensagem:\n${this.message}`,
    );
    window.open(`mailto:caiossouzasilva@gmail.com?subject=${subject}&body=${body}`, '_blank');

    this.sent.set(true);
    setTimeout(() => {
      this.name = '';
      this.email = '';
      this.message = '';
      this.sent.set(false);
    }, 4000);
  }
}
