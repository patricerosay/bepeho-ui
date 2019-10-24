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
  public isLoading = true;
  public error: object = null;
  private mediaroot = '/media/';
  private searchTimer = null;
  public data: any[] = [];
  public theMap: L.Map;
  public totalResults = 0;
  public pageSize = 0;
  public displayed = 0;
  public errCount = 0;
  public layers = {
    Local: L.tileLayer(
      'http://' + window.location.hostname + '/tile/{z}/{x}/{y}.png'
    ),
    'Online OpenStreetMap': L.tileLayer(
      'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
    )
  };

  public traces = L.layerGroup();
  public events = L.layerGroup();

  searchPrms: ISearchParams = new ISearchParams();

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
  constructor(public http: HttpClient, private modalService: NgbModal) {}

  ngOnInit() {
    this.theMap = L.map('map');

    this.searchPrms.type = 'autorecord';

    this.loadData(this);

    L.control
      .layers(this.layers, {
        Traces: this.traces,
        Events: this.events
      })
      .addTo(this.theMap);
  }
  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }
    console.log(value);

    return value;
  }

  public getLatLon(o: any) {
    // console.log(o);
    let res = null;
    const s = o['nmea_s_boatpos'];
    if (s) {
      const a = s.split(',');
      res = new L.LatLng(a[0], a[1]);
    }
    const lat = null !== res ? Math.abs(parseFloat(res.lat)) : null;
    const lon = null !== res ? Math.abs(parseFloat(res.lng)) : null;

    if (!lat && !lon) {
      const s2 = o['nmea_loc_boatspatialpos'];
      if (undefined !== s2 && '00.0000,00.0000' !== s2) {
        const a = s2.split(',');
        if (null === a) {
          console.log(o);
        }
        res = new L.LatLng(a[0], a[1]);
      }
    }
    // if (null === res) {
    //   console.log('null position' + o);
    // }
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
    this.searchPrms = new ISearchParams();
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
  public onDetectionLevel(event) {
    this.searchPrms.anomaly_score_d = event.value / 10;
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }
    const self: MapComponent = this;
    this.searchTimer = setTimeout(this.loadData, 1000, self);
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
  public loadData(_self: MapComponent) {
    const self = _self;
    self.traces.clearLayers();
    self.events.clearLayers();
    const linePoints = [];

    const params: URLSearchParams = self.serialize(self.searchPrms);
    self.http
      .get('/recorder/search?' + params)
      .toPromise()
      .then(
        data => {
          if (self.data) {
            self.data = data as any[];
            self.totalResults = self.data['groupCount'];
            self.pageSize = self.data['groups'].length;
            const groups = self.data['groups'] as any[];
            self.displayed = 0;
            self.errCount = 0;
            let linePointsCounter = 0;
            let lastTime = null;
            groups.forEach(function(group) {
              const firstSegment = group[0];

              const latLon: L.LatLngExpression = self.getLatLon(firstSegment);
              if (null !== latLon) {
                const payload = {
                  segments: self.computePayload(group)
                };

                if (
                  payload.segments &&
                  payload.segments[0]['videos'] &&
                  0 < payload.segments[0]['videos'].length
                ) {
                  if (!lastTime) {
                    linePoints[linePointsCounter] = new Array();
                    linePoints[linePointsCounter].push(latLon);
                    lastTime = firstSegment['start_time_data'];
                  } else {
                    if (lastTime - firstSegment['start_time_data'] >= 3600) {
                      lastTime = firstSegment['start_time_data'];
                      linePointsCounter++;
                      linePoints[linePointsCounter] = new Array();
                      linePoints[linePointsCounter].push(latLon);
                    } else {
                      linePoints[linePointsCounter].push(latLon);
                    }
                  }
                  // linePoints.push(latLon);
                  const jsonPayload = JSON.stringify(payload);

                  let marker = null;
                  if (undefined !== firstSegment['anomaly_score_d']) {
                    const markerOptions: MyMarkerOptions = {
                      data: firstSegment,
                      jsonPayload: jsonPayload,
                      icon: self.iconDetect,
                      title: firstSegment.anomaly_score_d
                    };
                    self.displayed++;
                    marker = new L.Marker(latLon, markerOptions).addTo(
                      self.events
                    );
                  } else {
                    const markerOptions: MyMarkerOptions = {
                      data: firstSegment,
                      jsonPayload: jsonPayload,
                      icon: self.iconLove,
                      title: firstSegment.end_time
                    };
                    self.displayed++;
                    marker = new L.Marker(latLon, markerOptions).addTo(
                      self.traces
                    );
                  }

                  marker.on('click', function(e) {
                    const modalRef = who.modalService.open(QviewComponent, {
                      size: 'lg',
                      backdropClass: 'light-blue-backdrop',
                      centered: true
                    });
                    modalRef.componentInstance.json =
                      e.target.options.jsonPayload;
                    modalRef.componentInstance.data = e.target.options.data;
                  });
                } else {
                  self.errCount++;
                }
              } else {
                self.errCount++;
              }
            });

            if (self.theMap && self.theMap !== undefined) {
              self.theMap.removeLayer(self.traces);
              self.theMap.removeLayer(self.events);
            }

            L.polyline(linePoints, { color: 'red' }).addTo(self.theMap);
            self.theMap.setZoom(5);
            let center = new L.LatLng(0.0, 0.0);

            if (groups.length) {
              center = self.getLatLon(groups[groups.length - 1][0]);
            }

            self.theMap.setView(center, 8);
            self.theMap.addLayer(self.layers.Local);
            self.theMap.addLayer(self.traces);
            self.theMap.addLayer(self.events);
          }
        },
        err => this.logError(err)
      )
      .catch(function(e) {
        this.logError(e);
      })
      .finally(function() {
        self.isLoading = false;
      });

    const who = self;

    clearTimeout(self.searchTimer);
  }
  logError(error: object): void {
    this.error = error;
  }
}
