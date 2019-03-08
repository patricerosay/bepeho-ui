import {ChangeDetectionStrategy, Component, ViewEncapsulation, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { routerTransition } from '../../router.animations';
@Component({
    selector: 'app-map',
    templateUrl: './video-records.component.html',
    styleUrls: ['./video-records.component.scss'],
    animations: [routerTransition()],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class VideoRecordsComponent implements OnInit {
    records = []; //Array.from({length: 100000}).map((_, i) => `Item #${i}`);

    isloading=true;
  
   
    constructor(public http: HttpClient) { }

    ngOnInit() {
        // Déclaration de la carte avec les coordonnées du centre et le niveau de zoom.
           this.loadData();
    }
  

   
    public computePayload(group: any[]) {
        var segments = [];
        var segment = {
            id: group[0].id,
            videos: [],
            audios: []
        };
        group.sort(function (a, b) {
            // videos on top of audios
            if (a.mime < b.mime)
                return 1;
            if (a.mime > b.mime)
                return 0;
            if (a.Channel > b.Channel)
                return 1;
            if (a.Channel < b.Channel)
                return -1;
            // a doit être égale à b
            return 0;
        });
        for (var g = 0; g < group.length; g++) {
            if (group[g].mime == 'video/mp4') {
                var video = {
                    id: group[g].id,
                    src: "/media/" + group[g].filename_p_file,
                    img: "/media/" + group[g].filename_i_file
                };
                segment.videos.push(video);
            } else {
                var audio = {
                    id: group[g].id,
                    src: "/media/" + group[g].filename_m_file
                }
                segment.audios.push(audio);
            }
        }
        segments.push(segment);
        return segments;

    }

    public loadData() {


        var self = this;
        this.http.get('/recorder/search').toPromise().then(data => {
            if (!data) {
                // this.layout.title = " No records where found";
                return;
            }
            self.records=data as any[];
          self.isloading=false;
        });
    }
}
