import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { routerTransition } from '../../router.animations';
import * as L from 'leaflet';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    animations: [routerTransition()]
})

export class MapComponent implements OnInit {
    public data: any[] = [];
    public control: L.Map;
    public mbUrl = ('Mediaman-Assistant' == document.title)
        ? 'http://' + window.location.hostname + ':8088/tile/{z}/{x}/{y}.png' :
        'http://{s}.tile.osm.org/{z}/{x}/{y}.png';

    public detections = L.layerGroup();
    public traces = L.layerGroup();
    public loves = L.layerGroup();
    public linePoints = [];

    iconLove = L.icon({
        iconUrl: '/assets/images/love-icon.png',
        shadowSize:   [50, 64],
        iconAnchor:   [25, 80],
        shadowAnchor: [4, 62],
        popupAnchor:  [-3, -76]
        });

    iconDetect = L.icon({
        iconUrl: '/assets/images/detection-icon.png',
        shadowSize:   [50, 64],
        iconAnchor:   [25, 80],
        shadowAnchor: [4, 62],
        popupAnchor:  [-3, -76]
        });
    constructor(public http: HttpClient) { }

    ngOnInit() {
        // Déclaration de la carte avec les coordonnées du centre et le niveau de zoom.
        this.control = L.map('map');//.setView([50.6311634, 3.0599573], 12);

        L.tileLayer(this.mbUrl, {
            attribution: 'Map'
        }).addTo(this.control);
        this.loadData();
    }


    public getLatLon(o: any) {
        let res = new L.LatLng(0.0, 0.0);
        let s = o["nmea_s_boatpos"];
        if (s) {
            var a = s.split(',');
            res.lat = a[0];
            res.lng = a[1];
        }
        return res;
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
                    //src: "/media/" + group[g].filename_p_file,
                    ////#endregionimg: "/media/" + group[g].filename_i_file
                     src:  group[g].filename_p_file,
                    img:  group[g].filename_i_file
                };
                segment.videos.push(video);
            } else {
                var audio = {
                    id: group[g].id,
                    //src: "/media/" + group[g].filename_m_file
                    src:  group[g].filename_m_file

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
            if (!self.data) {
                // this.layout.title = " No records where found";
                return;
            }


            self.data = data as any[];
            var groups = self.data["groups"] as any[];
            groups.forEach(function (group) {
                const firstSegment = group[0];
                var autodetectionReport = firstSegment.end_time;
                const latLon: L.LatLngExpression = self.getLatLon(firstSegment);
                self.linePoints.push(latLon);

                var payload = {
                    segments: self.computePayload(group)
                };
                var imgUrl;
                if (payload.segments && payload.segments[0]["videos"])
                    imgUrl = payload.segments[0]["videos"][0].img;


                var markerUrl = '/qv.html?' + JSON.stringify(payload);

                if (firstSegment["d_anomaly_score_d"] !== undefined) {
                    autodetectionReport = ' <img height="44" width="44" src="/assets/images/bepeho-favicon.png"/></a> Event Detected at ' + autodetectionReport

                }

                L.marker(latLon, { icon: self.iconDetect }).bindPopup(autodetectionReport + '<a href="' + markerUrl + '"><img src="' + imgUrl + '"/></a>').addTo(self.detections);
                L.marker(latLon, { icon: self.iconDetect }).bindPopup(autodetectionReport + '<a href="' + markerUrl + '"><img src="' + imgUrl + '"/></a>').addTo(self.traces);


                if (firstSegment['State'] == 'archived') {
                    autodetectionReport = '<i class=\"glyphicon glyphicon-heart \"></i> Sequence kept at ' + autodetectionReport;

                    L.marker(latLon, { icon: self.iconLove }).bindPopup(autodetectionReport + '<a href="' + markerUrl + '"><img src="' + imgUrl + '"/></a>').addTo(self.traces);
                    L.marker(latLon, { icon: self.iconLove }).bindPopup(autodetectionReport + '<a href="' + markerUrl + '"><img src="' + imgUrl + '"/></a>').addTo(self.loves);

                }
                else {
                    L.marker(latLon).bindPopup(autodetectionReport + '<a href="' + markerUrl + '"><img src="' + imgUrl + '"/></a>').addTo(self.traces);
                }
            });

            if (this.control && this.control !== undefined) {
                this.control.removeLayer(this.detections);
                this.control.removeLayer(this.traces);
                this.control.removeLayer(this.loves);
                this.control.removeLayer(this.loves);
            }


            var center = new L.LatLng(0.0, 0.0);

            if (groups.length) {
                center = self.getLatLon(groups[groups.length - 1][0]);

            }

            self.control.setView(center, 8);
            // self.control.panTo(center);
            L.polyline(self.linePoints, { color: 'red' }).addTo(self.control);

            L.control.layers({
                "Events": self.detections,
                "Loves": self.loves,
                "Traces": self.traces
            }).addTo(self.control);
        });
    }
}
