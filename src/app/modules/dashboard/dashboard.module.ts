import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { Dashboard01Component } from './dashboard01/dashboard01.component';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [Dashboard01Component],
  imports: [CommonModule, DashboardRoutingModule, MaterialModule],
})
export class DashboardModule {}
