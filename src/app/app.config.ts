import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { firstValueFrom } from 'rxjs';
import { routes } from './app.routes';

const SUPPORTED_LANGS = ['pt', 'en'] as const;
type SupportedLang = (typeof SUPPORTED_LANGS)[number];
const DEFAULT_LANG: SupportedLang = 'pt';

function detectLang(): SupportedLang {
  const browserLang = navigator.language?.split('-')[0];
  return (SUPPORTED_LANGS as readonly string[]).includes(browserLang)
    ? (browserLang as SupportedLang)
    : DEFAULT_LANG;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideTranslateService({ lang: DEFAULT_LANG }),
    provideTranslateHttpLoader({ prefix: './i18n/', suffix: '.json' }),
    provideAppInitializer(() => {
      const translate = inject(TranslateService);
      return firstValueFrom(translate.use(detectLang()));
    }),
  ],
};
