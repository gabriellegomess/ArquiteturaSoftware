import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'findLanguageFromKey',
})
export default class FindLanguageFromKeyPipe implements PipeTransform {
  private languages: { [key: string]: { name: string; rtl?: boolean } } = {
    'pt-br': { name: 'Português (Brasil)' },
    en: { name: 'English' },
    fr: { name: 'Français' },
    it: { name: 'Italiano' },
    ru: { name: 'Русский' },
    es: { name: 'Español' },
    sv: { name: 'Svenska' },
    ua: { name: 'Українська' },
    // jhipster-needle-i18n-language-key-pipe - JHipster will add/remove languages in this object
  };

  transform(lang: string): string {
    return this.languages[lang].name;
  }
}
