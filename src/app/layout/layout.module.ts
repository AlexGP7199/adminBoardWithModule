import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { ContentSiteComponent } from './content-site/content-site.component';



@NgModule({
  declarations: [
    HeaderComponent,
    SideMenuComponent,
    ContentSiteComponent
  ],
  imports: [
    CommonModule
  ], exports : [
    HeaderComponent,
    SideMenuComponent,
    ContentSiteComponent
  ]
})
export class LayoutModule { }
