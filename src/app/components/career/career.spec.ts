import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslationObject, provideTranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import PT from '../../i18n/pt.json';
import { Career } from './career';

class StaticTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of(PT as TranslationObject);
  }
}

describe('Career', () => {
  let component: Career;
  let fixture: ComponentFixture<Career>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Career],
      providers: [
        provideTranslateService({
          lang: 'pt',
          loader: () => new StaticTranslateLoader(),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Career);
    component = fixture.componentInstance as Career;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const titleText = compiled.querySelector('.experience__title-text')?.textContent?.trim();
    expect(titleText).toBe('Carreira');
  });

  it('should render both experience groups (work and education)', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const groupLabels = compiled.querySelectorAll('.experience__group-label span');
    expect(groupLabels.length).toBe(2);
    expect(groupLabels[0]?.textContent?.trim()).toBe('Carreira Profissional');
    expect(groupLabels[1]?.textContent?.trim()).toBe('Formação Acadêmica');
  });

  it('should render the jobs and their details correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const workGroup = compiled.querySelectorAll('.experience__group')[0];
    const jobNodes = workGroup.querySelectorAll('.experience__node');
    expect(jobNodes.length).toBe(2);

    const firstJobRole = jobNodes[0].querySelector('.experience__role')?.textContent?.trim();
    const firstJobCompany = jobNodes[0].querySelector('.experience__company')?.textContent?.trim();
    expect(firstJobRole).toBe('Desenvolvedor Frontend');
    expect(firstJobCompany).toBe('IBM Brasil');

    const firstJobBullets = jobNodes[0].querySelectorAll('.experience__bullets li');
    expect(firstJobBullets.length).toBe(5);
  });

  it('should render education entries and their details correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const educationGroup = compiled.querySelectorAll('.experience__group')[1];
    const eduNodes = educationGroup.querySelectorAll('.experience__node');
    expect(eduNodes.length).toBe(2);

    const firstEduDegree = eduNodes[0].querySelector('.experience__role')?.textContent?.trim();
    const firstEduInstitution = eduNodes[0].querySelector('.experience__company')?.textContent?.trim();
    expect(firstEduDegree).toBe('Bacharelado em Ciência da Computação');
    expect(firstEduInstitution).toBe('Universidade FUMEC');

    const firstEduBullets = eduNodes[0].querySelectorAll('.experience__bullets li');
    expect(firstEduBullets.length).toBe(3);
  });

  it('should generate numeric arrays correctly with toBullets helper', () => {
    expect((component as unknown as Career & { toBullets: (count: number) => number[] }).toBullets(3)).toEqual([0, 1, 2]);
    expect((component as unknown as Career & { toBullets: (count: number) => number[] }).toBullets(0)).toEqual([]);
  });
});
