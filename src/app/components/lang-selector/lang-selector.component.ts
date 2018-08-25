import { Component, Inject, LOCALE_ID } from '@angular/core';

/**
 * Language Selector Component
 * Little button with menu to select language at intro
 */
@Component({
  selector: 'app-lang-selector',
  templateUrl: './lang-selector.component.html',
  styleUrls: ['./lang-selector.component.less']
})
export class LangSelectorComponent {

  /**
   * Languages contained in menu
   */
  languages = [
    { code: 'en', label: 'English', href: '/'},
    { code: 'es', label: 'Español', href: '/es/'},
    { code: 'gl', label: 'Galego', href: '/gl/'}
  ];

  /**
   * Constructor
   * @param localeId {LOCALE_ID} Inject user localeId
   */
  constructor(@Inject(LOCALE_ID) protected localeId: string) {}
}
