import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SequenceModule } from '../../../shared';

import { VideoListRoutingModule } from './video-list-routing.module';
import { VideoListComponent } from './video-list.component';
import { PageHeaderModule } from '../../../shared';
import { HttpClientModule } from '@angular/common/http';
import { QviewModule } from '../../../shared/modules/qview/qview.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
@NgModule({
    imports: [TranslateModule,
        CommonModule, VideoListRoutingModule, PageHeaderModule,
        HttpClientModule,

         MatButtonToggleModule,

         MatExpansionModule,

         MatMenuModule,

         MatPaginatorModule,
       
         MatTableModule,
      
         SequenceModule,

    NgbModule,
        QviewModule,],
    declarations: [VideoListComponent],
    entryComponents: [VideoListComponent]

})
export class VideoListModule {}
