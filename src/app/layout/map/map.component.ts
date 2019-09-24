import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { routerTransition } from '../../router.animations';
import * as L from 'leaflet';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QviewComponent } from '../../shared/modules/qview/qview.component';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    animations: [routerTransition()]
})

export class MapComponent implements OnInit {
    private mediaroot = '/media/';
    public data: any[] = [];
    public control: L.Map;
    public mbUrl = ('Mediaman-Assistant' === document.title)
        ? 'http://' + window.location.hostname + ':8088/tile/{z}/{x}/{y}.png' :
        'http://{s}.tile.osm.org/{z}/{x}/{y}.png';

    public traces = L.layerGroup();
    public linePoints = [];

    workloadMap = {};

    iconLove = L.icon({
        iconUrl: '/assets/images/love-icon.png',
        shadowSize: [50, 64],
        iconAnchor: [25, 80],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76]
    });

    iconDetect = L.icon({
        iconUrl: '/assets/images/detection-icon.png',
        shadowSize: [50, 64],
        iconAnchor: [25, 80],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76]
    });
    constructor(public http: HttpClient, private modalService: NgbModal) {
        // console.log('modaleService');
    }

    // public onClickOnTrace() {
    //     this
    //     const modalRef = this.modalService.open(QviewComponent);
    //     modalRef.componentInstance.title = 'QuickEdit';
    // }

    ngOnInit() {
        this.control = L.map('map');

        L.tileLayer(this.mbUrl, {
            attribution: 'Map'
        }).addTo(this.control);
        this.loadData();
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
    // public  pop() {
    //     const modalRef = this.modalService.open(NgbdModalContent);
    //     modalRef.componentInstance.title = 'QuickEdit';
    // }
    public loadData() {
        const self = this;
        this.http.get('/recorder/search').toPromise().then(data => {
            if (!self.data) {

                // this.layout.title = " No records where found";
                return;
            }

            self.data = data as any[];
            const groups = self.data['groups'] as any[];
            groups.forEach(function (group) {
                const firstSegment = group[0];
                let autodetectionReport = firstSegment.end_time;
                const latLon: L.LatLngExpression = self.getLatLon(firstSegment);
                self.linePoints.push(latLon);

                const payload = {
                    segments: self.computePayload(group)
                };
                let imgUrl;
                if (payload.segments && payload.segments[0]['videos'] && 0 < payload.segments[0]['videos'].length) {
                    imgUrl = self.mediaroot + payload.segments[0]['videos'][0].img;

                    const markerUrl = '/qview?data=' + btoa(JSON.stringify(payload));

                    if (firstSegment['d_anomaly_score_d'] !== undefined) {
                        autodetectionReport = ' <img height="44" width="44" src="/assets/images/bepeho-favicon.png"/>'
                            + '</a> Event Detected at '
                            + autodetectionReport;

                    }

                    autodetectionReport = autodetectionReport + '<img onclick="onClickOnTrace()" src="'
                        + imgUrl + '"/></a>';


                    const marker = new L.Marker(latLon,
                        {
                            icon: self.iconDetect,
                            title: firstSegment.end_time,
                            payload: JSON.stringify(payload),
                            data: firstSegment
                        }
                    ).addTo(self.traces);
                    marker.on('click', function (e) {

                        const modalRef = who.modalService.open(QviewComponent,
                             { size: 'lg', backdropClass: 'light-blue-backdrop', centered: true});
                        modalRef.componentInstance.json = e.target.options.payload;
                        modalRef.componentInstance.data = e.target.options.data;

                    });
                }
            });

            if (this.control && this.control !== undefined) {
                this.control.removeLayer(this.traces);
            }


            let center = new L.LatLng(0.0, 0.0);

            if (groups.length) {
                center = self.getLatLon(groups[groups.length - 1][0]);
            }

            self.control.setView(center, 8);
            // self.control.panTo(center);
            L.polyline(self.linePoints, { color: 'red' }).addTo(self.control);

            L.control.layers({
                'Traces': self.traces
            }).addTo(self.control);
        });
        self.control.setZoom(5);
        self.control.addLayer(self.traces);
        const who = self;

    }

}
