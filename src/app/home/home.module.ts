import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HtmlHandlePipe } from '../html-handle.pipe';

// Angular material
import { DragDropModule } from '@angular/cdk/drag-drop';

import { HomePageRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HomePageRoutingModule,
    DragDropModule,
  ],
  declarations: [HomePage, HtmlHandlePipe],
})
export class HomePageModule {}
