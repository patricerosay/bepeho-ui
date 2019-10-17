import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { routerTransition } from '../../router.animations';
import * as L from 'leaflet';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QviewComponent } from '../../shared/modules/qview/qview.component';
import { ISearchParams } from '../../shared/interfaces/search.interface';
export interface MyMarkerOptions extends L.MarkerOptions {
  data: any;
  jsonPayload: string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  animations: [routerTransition()]
})


export class MapComponent implements OnInit {
  private mediaroot = '/media/';
  private searchTimer = null;
  public data: any[] = [];
  public theMap: L.Map;
  public mbUrl = ('Mediaman-Assistant' === document.title)
    ? 'http://' + window.location.hostname + ':8088/tile/{z}/{x}/{y}.png' :
    'http://{s}.tile.osm.org/{z}/{x}/{y}.png';

  public traces = L.layerGroup();
  // public linePoints = [];
  searchPrms: ISearchParams = new ISearchParams();

  workloadMap = {};

  iconLove = L.icon({
    iconUrl: 'assets/images/love-icon.png',
    shadowSize: [50, 64],
    iconAnchor: [25, 80],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76]
  });

  iconDetect = L.icon({
    iconUrl: 'assets/images/detection-icon.png',
    shadowSize: [50, 64],
    iconAnchor: [25, 80],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76]
  });
  constructor(public http: HttpClient, private modalService: NgbModal) {
  }


  ngOnInit() {
    this.theMap = L.map('map');

    L.tileLayer(this.mbUrl, {
      attribution: 'Map'
    }).addTo(this.theMap);

    this.searchPrms.type = 'autorecord';

    this.loadData(this);

    L.control.layers({}, {
      'Traces': this.traces
    }).addTo(this.theMap);

  }
  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }
    console.log(value);

    return value;
  }

  public getLatLon(o: any) {
    const res = new L.LatLng(0.0, 0.0);
    const s = o['nmea_s_boatpos'];
    if (s) {
      const a = s.split(',');
      res.lat = a[0];
      res.lng = a[1];
    }
    if (  0 === parseFloat(res.lat[0]) && 0 === parseFloat(res.lng[1])) {
        const s2 = o['nmea_loc_boatspatialpos'];
        if ( undefined !== s2 && '00.0000,00.0000' !== s2) {

          const a = s2.split(',');
          res.lat = a[0];
          res.lng = a[1];
            }
      }
    return res;
  }
  public computePayload(group: any[]) {
    const segments = [];
    const segment = {
      id: group[0].id,
      videos: [],
      audios: []
    };
    group.sort(function(a, b) {
      // videos on top of audios
      if (a.mime < b.mime) {
        return 1;
      }
      if (a.mime > b.mime) {
        return 0;
      }
      if (a.Channel > b.Channel) {
        return 1;
      }
      if (a.Channel < b.Channel) {
        return -1;
      }
      // a doit être égale à b
      return 0;
    });
    for (let g = 0; g < group.length; g++) {
      if (group[g].mime === 'video/mp4') {
        const video = {
          id: group[g].id,
          channel: group[g].Channel,
          src: group[g].filename_p_file,
          img: group[g].filename_i_file
        };
        segment.videos.push(video);
      } else {
        const audio = {
          id: group[g].id,
          channel: group[g].Channel,
          src: group[g].filename_m_file
        };
        segment.audios.push(audio);
      }
    }
    segments.push(segment);
    return segments;

  }

  serialize(obj: any) {
    const params: URLSearchParams = new URLSearchParams();
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const element = obj[key];

        params.set(key, element);
      }
    }

    return params;
  }
  public Reset() {
    this.searchPrms = new ISearchParams;
    this.searchPrms.type = 'autorecord';
    this.loadData(this);

  }
  public onSearchOnLastMinutes(from: string, to: string) {
    this.searchPrms.start_time = [from, to];
    this.loadData(this);
  }
  public onSearchOnHeelAngle(event) {
    this.searchPrms.nmea_d_heel_d = event.value;
    this.loadData(this);
  }

  public onSearchLimit(event) {
    this.searchPrms.count = event.value;
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }
    const self: MapComponent = this;
    this.searchTimer = setTimeout(this.loadData, 1000, self);
  }
  public loadData( _self: MapComponent) {
    const self = _self;
    self.traces.clearLayers();

    let linePoints = [];
    const params: URLSearchParams = self.serialize(self.searchPrms);
    self.http.get('/recorder/search?' + params).toPromise().then(data => {
      if (!self.data) {

        // this.layout.title = " No records where found";
        return;
      }

      self.data = data as any[];
      const groups = self.data['groups'] as any[];
      groups.forEach(function(group) {
        const firstSegment = group[0];
        // let autodetectionReport = firstSegment.end_time;
        const latLon: L.LatLngExpression = self.getLatLon(firstSegment);
        linePoints.push(latLon);

        const payload = {
          segments: self.computePayload(group)
        };
        let imgUrl;
        if (payload.segments && payload.segments[0]['videos'] && 0 < payload.segments[0]['videos'].length) {
          imgUrl = self.mediaroot + payload.segments[0]['videos'][0].img;



          const jsonPayload = JSON.stringify(payload);
          const markerOptions: MyMarkerOptions = {
            data: firstSegment,
            jsonPayload: jsonPayload,
            icon: self.iconDetect,
            title: firstSegment.end_time
          };
          const marker = new L.Marker(latLon, markerOptions
          ).addTo(self.traces);
          // marker.options.payload = jsonPayload;
          // marker.options.data= firstSegment;
          marker.on('click', function(e) {

            const modalRef = who.modalService.open(QviewComponent,
              { size: 'lg', backdropClass: 'light-blue-backdrop', centered: true });
            modalRef.componentInstance.json = e.target.options.jsonPayload;
            modalRef.componentInstance.data = e.target.options.data;

          });
        }
      });

      if (self.theMap && self.theMap !== undefined) {
        self.theMap.removeLayer(self.traces);
      }



      // self.control.panTo(center);
      L.polyline(linePoints, { color: 'red' }).addTo(self.theMap);
      self.theMap.setZoom(5);
      let center = new L.LatLng(0.0, 0.0);

      if (groups.length) {
        center = self.getLatLon(groups[groups.length - 1][0]);
      }

      self.theMap.setView(center, 8);
      self.theMap.addLayer(self.traces);

    });

    const who = self;

    clearTimeout(self.searchTimer);

  }

}
