import { HotToastModule } from '@ngneat/hot-toast';
import { MaterialModule } from './../../material/material/material.module';
import { AdminRoutingModule } from './admin-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeAdminComponent } from './pages/home-admin/home-admin.component';
import { NewMunicipioComponent } from './pages/home-admin/components/new-municipio/new-municipio.component';



@NgModule({
  declarations: [
    HomeAdminComponent,
    NewMunicipioComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    HotToastModule.forRoot(),
  ]
})
export class AdminModule { }
