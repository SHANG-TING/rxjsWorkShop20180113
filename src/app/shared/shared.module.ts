import { MyMaterialModule } from './my-material/my-material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MyMaterialModule
  ],
  declarations: []
})
export class SharedModule { }
