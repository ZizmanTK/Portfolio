import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/ui/navbar/navbar.component';
import { ButtonComponent } from './components/ui/button/button.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { AboutPageComponent } from './components/pages/about-page/about-page.component';
import { CardComponent } from './components/ui/card/card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InfiniteScrollerComponent } from './components/features/infinite-scroller/infinite-scroller.component';
import { ClampLinesDirective } from './directives/clamp-lines.directive';
import { FooterComponent } from './components/ui/footer/footer.component';
import { ProjectsPageComponent } from './components/pages/projects-page/projects-page.component';
import { ProjectCardComponent } from './components/ui/project-card/project-card.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ButtonComponent,
    HomePageComponent,
    AboutPageComponent,
    CardComponent,
    InfiniteScrollerComponent,
    ClampLinesDirective,
    FooterComponent,
    ProjectsPageComponent,
    ProjectCardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
