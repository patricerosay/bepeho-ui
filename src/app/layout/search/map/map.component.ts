import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { routerTransition } from '../../../router.animations';
import * as L from 'leaflet';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QviewComponent } from '../../../shared/modules/qview/qview.component';
import { ISearchParams } from '../../../shared/interfaces/search.interface';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

export interface MyMarkerOptions extends L.MarkerOptions {
  data: any;
  jsonPayload: string;
}
export interface ISearchStat {
  sequenceCount: number;
  sequenceDisplayed: number;
  error: number;
  videoLess: number;
  positionLess: number;
  from: number;
  to: number;
}
const ELEMENT_DATA: ISearchStat[] = [
  { sequenceCount: 0, sequenceDisplayed: 0, error: 0, videoLess: 0, positionLess: 0, from: 0, to: 0 }
];
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  animations: [routerTransition()]
})
export class MapComponent implements OnInit {
  public isLoading = true;
  public searchViewMode = '/map';
  public error: object = null;
  private mediaroot = '/media/';
  private searchTimer = null;
  public data: any[] = [];
  public theMap: L.Map;
  public retrievedSequenceCount = 0;

  public errCount = 0;

  public pageSize = 500;
  public pageSizeOptions: number[] = [100, 500, 1000, 10000];
  public layers = {
    'Local': L.tileLayer(
      window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/tile/{z}/{x}/{y}.png'
    ),
    'Online': L.tileLayer(
      'https://{s}.tile.osm.org/{z}/{x}/{y}.png'
    )
  };

  public traces = L.layerGroup();
  public events = L.layerGroup();

  statColumns: string[] = ['from', 'to', 'sequenceCount', 'sequenceDisplayed', 'error'];
  searchStats: ISearchStat[] = ELEMENT_DATA;

  searchPrms: ISearchParams = new ISearchParams();
  heelRange = [
    { 'name': 'Whatever the boat heeling', 'value': [-90, 90] },
    { 'name': 'starboard', 'value': [-90, 0] },
    { 'name': 'more than 45° starboard', 'value': [-90, -45] },
    { 'name': 'less than 45° starboard', 'value': [-45, 0] },
    { 'name': 'less than 45° port', 'value': [0, 45] },
    { 'name': 'more than 45° port', 'value': [45, 90] },
    { 'name': 'port', 'value': [0, 90] }

  ];


  speedRange = [
    { 'name': 'Whatever the boat speed', 'value': [0, 100] },
    { 'name': '0 to 5', 'value': [0, 5] },
    { 'name': '5 to 10', 'value': [5, 10] },
    { 'name': '10 to 15', 'value': [10, 15] },
    { 'name': '15 to 20', 'value': [15, 20] },
    { 'name': '20 to 30', 'value': [20, 30] },
    { 'name': '30 to 40', 'value': [30, 40] },
    { 'name': '40 To More', 'value': [40, 100] },
  ];


  iconTrace = L.icon({
    iconUrl: 'assets/images/marker-icon-2x.png',
    iconSize: [25, 42],
    iconAnchor: [12, 42],
    popupAnchor: [-3, -76]
  });
  iconSaved = L.icon({
    iconUrl: 'assets/images/love-icon.png',
    iconSize: [35, 51],
    iconAnchor: [17, 51],
    popupAnchor: [-3, -76]
  });
  iconDetect = L.icon({
    iconUrl: 'assets/images/detection-icon.png',
    shadowSize: [50, 64],
    iconAnchor: [25, 80],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76]
  });

  pageEvent: PageEvent;

  currentSpeedRangeName: string;
  currentHeelRangeName: string;
  currentTimeRangeName: string;


  getlangage(): string {
    const langage = localStorage.getItem("langage");
    if (!langage) return this.translate.getBrowserLang();
    return langage;
  }

  constructor(public http: HttpClient, private modalService: NgbModal, private translate: TranslateService,
    // private cookieService: CookieService
  ) {
    this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
    this.translate.setDefaultLang('en');
    const browserLang = this.getlangage();
    this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');

  }

  getCookieInfo(key: string, def: string): string {
    const val = localStorage.getItem(key);
    return (val) ? val : def;
  }


  ngOnInit() {
    this.currentSpeedRangeName = this.getCookieInfo('speedRange', 'Whatever the recording time');
    this.currentHeelRangeName = this.getCookieInfo('heelRange', 'Whatever the boat heeling');
    this.currentTimeRangeName = this.getCookieInfo('timeRange', 'Whenever it was recorded');


    this.searchPrms.type = 'autorecord';
    this.searchPrms.start = 0;
    this.searchPrms.count = this.pageSize;



    this.theMap = L.map('map');
    this.loadData(this);
    this.layers['Local'].on('tileerror', function (event) {
      console.log('error');
    });

    this.layers['Online'].on('tileerror', function (event) {
      console.log('error');
    });

    L.control
      .layers(this.layers, {
        Traces: this.traces,
        Events: this.events
      })
      .addTo(this.theMap);
    // }
  }

  onPageEvent(event) {
    this.searchPrms.count = event.pageSize;
    this.searchPrms.start = event.pageIndex * event.pageSize;
    this.searchTimer = setTimeout(this.loadData, 1000, this);
  }



  public getLatLon(o: any) {
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

    return res;
  }
  public computePayload(group: any[]) {
    const segments = [];
    const segment = {
      id: group[0].id,
      videos: [],
      audios: []
    };
    group.sort(function (a, b) {
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
    this.computeTimeRange();
    const params: URLSearchParams = new URLSearchParams();
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const element = obj[key];

        params.set(key, element);
      }
    }

    return params;
  }



  public onSearchOnHeelAngle(range) {

    this.searchPrms.nmea_d_heel_d = range.value;
    localStorage.setItem('heelRange', range.name);
    this.loadData(this);
  }
  public onSearchOnSpeed(range) {
    this.searchPrms.nmea_d_bgs_d = range.value;
    localStorage.setItem('speedRange', range.name);
    this.loadData(this);
  }


  clearMap() {
    this.theMap.eachLayer(l => {
      try {
        this.theMap.removeLayer(l);
      } catch (e) {
        console.log('problem with ' + e + l);
      }
    });
  }


  public loadData(_self: MapComponent) {
    const self = _self;

    self.clearMap();
    self.errCount = 0;
    self.traces.clearLayers();
    self.events.clearLayers();
    const linePoints = [];
    self.searchStats[0].error = 0;
    self.searchStats[0].positionLess = 0;
    self.searchStats[0].positionLess = 0;
    const params: URLSearchParams = self.serialize(self.searchPrms);
    self.isLoading = true;
    const requestUrl = '/recorder/search?' + params;
    console.log(requestUrl);
    self.http
      .get(requestUrl)
      .toPromise()
      .then(
        data => {
          clearTimeout(self.searchTimer);

          if (self.data) {
            let lastDisplayedSegment = null;
            self.data = data as any[];
            const groups = self.data['groups'] as any[];
            self.searchStats[0].sequenceCount = self.data['groupCount'];
            self.retrievedSequenceCount = self.data['groups'].length;

            self.searchStats[0].to = Date.now();
            self.searchStats[0].from = 0;

            let linePointsCounter = 0;
            let lastTime = null;
            groups.reverse();
            groups.forEach(function (group) {
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
                    if (firstSegment['start_time_data'] - lastTime >= 3600) {
                      lastTime = firstSegment['start_time_data'];
                      linePointsCounter++;
                      linePoints[linePointsCounter] = new Array();
                      linePoints[linePointsCounter].push(latLon);
                    } else {
                      linePoints[linePointsCounter].push(latLon);
                    }
                  }
                  const jsonPayload = JSON.stringify(payload);

                  let marker = null;
                  let markerOptions: MyMarkerOptions;
                  const date = new Date(firstSegment.end_time_data * 1000);
                  const title = date.toLocaleString();
                  if (undefined !== firstSegment['anomaly_score_d']) {
                    markerOptions = {
                      data: firstSegment,
                      jsonPayload: jsonPayload,
                      icon: self.iconDetect,
                      //title: firstSegment.anomaly_score_d
                      title: title
                    };
                    marker = new L.Marker(latLon, markerOptions).addTo(
                      self.events
                    );
                    if (!lastDisplayedSegment) {
                      lastDisplayedSegment = firstSegment;
                    }
                  } else {
                    if (firstSegment['State'] === 'archived') {
                      markerOptions = {
                        data: firstSegment,
                        jsonPayload: jsonPayload,
                        icon: self.iconSaved,
                        title: 'Saved'
                      };
                    } else {
                      markerOptions = {
                        data: firstSegment,
                        jsonPayload: jsonPayload,
                        icon: self.iconTrace,
                        title: title
                      };
                    }

                    marker = new L.Marker(latLon, markerOptions).addTo(
                      self.traces
                    );
                  }
                  self.searchStats[0].from = Math.max(self.searchStats[0].from, firstSegment['end_time_data']);
                  self.searchStats[0].to = Math.min(self.searchStats[0].to, firstSegment['end_time_data']);

                  // console.log(self.searchStats[0].from);
                  lastDisplayedSegment = firstSegment;



                  marker.on('click', function (e) {

                    const modalRef = who.modalService.open(QviewComponent, {
                      //size: 'lg',
                      backdropClass: 'light-blue-backdrop',
                      centered: true
                    });

                    modalRef.componentInstance.json =
                      e.target.options.jsonPayload;
                    modalRef.componentInstance.data = e.target.options.data;
                  });
                } else {
                  self.searchStats[0].error++;
                  self.searchStats[0].videoLess++;
                }
              } else {
                self.searchStats[0].error++;
                self.searchStats[0].positionLess++;
              }
            });

            if (self.theMap && self.theMap !== undefined) {
              self.theMap.removeLayer(self.traces);
              self.theMap.removeLayer(self.events);
            }

            L.polyline(linePoints, { color: 'red' }).addTo(self.theMap);
            let center = new L.LatLng(0.0, 0.0);

            if (groups.length && lastDisplayedSegment) {
              center = self.getLatLon(lastDisplayedSegment);
            }

            self.theMap.setView(center, 8);
            self.theMap.addLayer(self.layers.Local);
            self.theMap.addLayer(self.traces);
            self.theMap.addLayer(self.events);
          }
        },
        err => this.logError(err)
      )
      .catch(function (e) {
        this.logError(e);
      })
      .finally(function () {
        self.isLoading = false;
        self.searchStats[0].sequenceDisplayed = self.retrievedSequenceCount - self.searchStats[0].error;
      });

    const who = self;
  }
  logError(error: object): void {
    this.error = error;
  }

  getMillisecondsFromNow(localStorageDate, localStorageHour){
    const storedStartIsoDate = localStorage.getItem(localStorageDate);
    if (! storedStartIsoDate) return;
    const startDatetime = Math.trunc(Number(new Date(storedStartIsoDate))/ 60000);
    const now = Math.trunc(new Date().getTime() / 60000);
    var storedHour = Number(localStorage.getItem(localStorageHour));
    return now - startDatetime - storedHour;
  }
  computeTimeRange() {
    const numberOfMillsecondsToGoBackInTimeStart= this.getMillisecondsFromNow('startDateIso', 'startHour');
    if (0 < numberOfMillsecondsToGoBackInTimeStart)
      this.searchPrms.start_time = [numberOfMillsecondsToGoBackInTimeStart, 0];

    const numberOfMillsecondsToGoBackInTimeEnd= this.getMillisecondsFromNow('endDateIso', 'endHour');
    if (0 < numberOfMillsecondsToGoBackInTimeEnd)
        this.searchPrms.start_time = [numberOfMillsecondsToGoBackInTimeStart, numberOfMillsecondsToGoBackInTimeEnd];      
  }

  public Reset() {
    this.searchPrms = new ISearchParams();
    this.searchPrms.type = 'autorecord';
    localStorage.removeItem('startDateIso');
    localStorage.removeItem('startHour');
    localStorage.removeItem('endDateIso');
    localStorage.removeItem('endHour');
    localStorage.removeItem('date');
    localStorage.removeItem('heelRange');
    localStorage.removeItem('speedRange');

    this.searchPrms.type = 'autorecord';
    this.searchPrms.start = 0;
    this.searchPrms.count = this.pageSize;
    this.loadData(this);
  }
  public getFromLocalStorage(key) {
    return localStorage.getItem(key);
  }
  public isSliderDisabled(key) {
    return this.getFromLocalStorage(key) === null;
  }

  addEvent(date, type: string, event: MatDatepickerInputEvent<Date>) {
    if (type !== 'change') return;
    localStorage.setItem(date, event.value.toISOString());
    this.loadData(this);
  }

  formatSliderLabel(value: number) {
    const startHour = Math.round(value / 60);
    const minutes = Math.round(value % 60)
    return ((startHour < 10) ? "0" : "") + startHour + "H" + ((minutes < 10) ? "0" : "") + minutes;
  }
  formatLabel(hour) {
    return this.formatSliderLabel(Number(this.getFromLocalStorage(hour)));
  }
  updateHour(hour, event) {
    localStorage.setItem(hour, event.value);
    this.loadData(this);
  }
}
