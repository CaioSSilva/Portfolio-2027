import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import gsap from 'gsap';
import { TranslateService } from '@ngx-translate/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faOtter } from '@fortawesome/free-solid-svg-icons';
import { toSignal } from '@angular/core/rxjs-interop';
import { LoaderService } from '../../services/loader';
import {
  ballsEnter,
  ballsExit,
  barEnter,
  barExit,
  titleEnter,
  titleExit,
} from '../../timelines/loading';
import { About } from '../about/about';
import { AboutSlider } from '../about-slider/about-slider';
import { Home } from '../home/home';
import { Projects } from '../projects/projects';
import { TopBar } from '../top-bar/top-bar';
import { Career } from '../career/career';
import { Contact } from '../contact/contact';
import { Footer } from '../footer/footer';

@Component({
  imports: [TopBar, Home, About, AboutSlider, Projects, Career, Contact, Footer, FaIconComponent],
  selector: 'app-loader',
  styleUrl: './loader.scss',
  templateUrl: './loader.html',
})
export class Loader implements AfterViewInit {
  protected readonly loader = inject(LoaderService);
  private readonly translate = inject(TranslateService);
  protected readonly faOtter = faOtter;

  private readonly loadingLabel = toSignal(this.translate.stream('loader.loading'), {
    initialValue: 'CARREGANDO',
  });
  protected readonly letters = computed(() => Array.from(this.loadingLabel()));
  protected readonly leaving = signal(false);

  @ViewChild('circleLight') private circleLight!: ElementRef<HTMLElement>;
  @ViewChild('circleDark') private circleDark!: ElementRef<HTMLElement>;
  @ViewChild('otterImg') private otterImg!: ElementRef<HTMLElement>;
  @ViewChild('barDark') private barDark!: ElementRef<HTMLElement>;
  @ViewChild('barLight') private barLight!: ElementRef<HTMLElement>;
  @ViewChild('titleLight') private titleLight!: ElementRef<HTMLElement>;
  @ViewChild('titleDark') private titleDark!: ElementRef<HTMLElement>;
  @ViewChildren('letterEl') private letterEls!: QueryList<ElementRef<HTMLElement>>;

  constructor() {
    effect(() => {
      if (this.loader.progress() >= 100 && !this.leaving()) {
        this.leaving.set(true);
        this.playExit();
      }
    });
  }

  ngAfterViewInit(): void {
    this.loader.load(this.playEnter());
  }

  private playEnter(): Promise<void> {
    const refs = this.nativeRefs();

    return new Promise((resolve) => {
      gsap
        .timeline({ onComplete: resolve })
        .add(
          ballsEnter({
            circleLight: refs.circleLight,
            circleDark: refs.circleDark,
            otterImg: refs.otterImg,
          }),
        )
        .add(barEnter({ barDark: refs.barDark, barLight: refs.barLight }), '-=0.1')
        .add(titleEnter({ titleLight: refs.titleLight, letters: refs.letters }), '-=0.1');
    });
  }

  private playExit(): void {
    const refs = this.nativeRefs();

    gsap
      .timeline({ onComplete: () => this.loader.finish(0) })
      .add(
        titleExit({
          titleLight: refs.titleLight,
          titleDark: refs.titleDark,
          letters: refs.letters,
        }),
      )
      .add(barExit({ barDark: refs.barDark, barLight: refs.barLight }), '-=0.1')
      .add(
        ballsExit({
          circleLight: refs.circleLight,
          circleDark: refs.circleDark,
          otterImg: refs.otterImg,
        }),
        '-=0.15',
      );
  }

  private nativeRefs() {
    return {
      circleLight: this.circleLight.nativeElement,
      circleDark: this.circleDark.nativeElement,
      otterImg: this.otterImg.nativeElement,
      barDark: this.barDark.nativeElement,
      barLight: this.barLight.nativeElement,
      titleLight: this.titleLight.nativeElement,
      titleDark: this.titleDark.nativeElement,
      letters: this.letterEls.map((r) => r.nativeElement),
    };
  }
}
