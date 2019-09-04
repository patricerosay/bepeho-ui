import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Line } from './line';
import * as $ from 'jquery';

export interface DialogData {
    animal: string;
    name: string;
}

@Component({
    selector: 'plotly-line-charts',
    templateUrl: './linear-charts.component.html',
})



export class LinearChartsComponent implements OnInit {

    constructor(public http: HttpClient, public dialog: MatDialog) { }

    public debug = true;
    public useResizeHandler = true;
    public data: any[] = [];

    modalOpen = false;
    param = {
        precision: 'minute',
        aggregation: ['med'],
        event: [],
        data: ['bgs_d', 'bgt_d', 'rws_d', 'rwa_d']
    }
    searchParams = {
        'start': 0,
        'type': 'timeserie'
        , 'count': 100000
        , 'start_time': [0, 360]
        , 'aggregation': 'minute_ts'
    };
    ngOnInit() {
        this.loadData();
        var self = this;
        $(document).ready(function () {
            $('.aggregate').click(function () {
                event.stopPropagation();
                let idx = self.param.aggregation.indexOf(this.id);
                if (-1 != idx) {
                    self.param.aggregation.splice(idx, 1);
                }
                else {
                    self.param.aggregation.push(this.id);

                }

                self.loadData();
            });
        });
        $('.precision').click(function () {
            self.param.precision = this.id;
            self.searchParams.aggregation = this.id + '_ts';
            self.loadData();
        });
        $('.data').click(function () {
            let idx = self.param.data.indexOf(this.id);
            if (-1 != idx) {
                self.param.data.splice(idx, 1);

            }
            else {
                self.param.data.push(this.id);

            }
            self.loadData();
        });
        $('.event').click(function () {
            let idx = self.param.event.indexOf(this.id);
            if (-1 != idx) {
                self.param.event.splice(idx, 1);

            }
            else {
                self.param.event.push(this.id);

            }
            self.loadData();
        });
    }


    public layout: any = {
        title: 'Searching time series',
        xaxis: {
            autorange: true,
            type: 'date'
        },
        yaxis: {
            autorange: true,
            type: 'linear'
        }
    };

    public min() {

    }
    makeColor(value) {
        function intToHex(i) {
            var hex = parseInt(i).toString(16);
            return (hex.length < 2) ? '0' + hex : hex;
        }
        // value must be between [0, 510]
        value = Math.min(Math.max(0, value), 1) * 510;

        var redValue;
        var greenValue;
        if (value > 255) {
            redValue = 255;
            greenValue = Math.sqrt(value) * 16;
            greenValue = Math.round(greenValue);
        } else {
            greenValue = 255;
            value = value - 255;
            redValue = 256 - (value * value / 255)
            redValue = Math.round(redValue);
        }

        return '#' + intToHex(redValue) + intToHex(greenValue) + '00';
    }
    getDataFromName(series, name) {
        for (var i = 0; i < series.length; i++) {
            if (series[i].name == name)
                return series[i].values;
        }
        return null;
    };

    public loadData() {
        
        return this.http.get('/recorder/timeseries').subscribe(
            (response) => this.onGetResults(response),
            (error) => this.onGetError(error.json()),
            () => this.onGetComplete()
        );
    }
    public onGetError(error: string) {

    }
    public onGetComplete() {

    }
    public onGetResults(data) {
        var self = this;

        self.data = [];
        const o: Line[] = data as Line[];
        const dates = o['date'];
        const series = o['series'];

        self.param.data.forEach(function (dt) {
            self.param.aggregation.forEach(function (prec) {
                let trace = {
                    x: [],
                    y: [],
                    mode: 'lines',
                    name: prec + '_' + dt
                };
                self.data.push(trace);
            });
        });

        for (var j = 0; j < self.data.length; j++) {
            var trace = self.data[j];
            var s = this.getDataFromName(series, trace.name);
            if (s) {

                trace.x = dates;
                trace.y = this.getDataFromName(series, trace.name);
            }
        };

        for (var j = 0; j < self.param.event.length; j++) {
            var event = self.param.event[j];
            var s = this.getDataFromName(series, event);
            if (s) {
                for (var v = 0; v < s.length; v++) {
                    if (!s[v]) continue;
                    var shape = {
                        type: 'line',
                        x0: dates[v],
                        y0: 0,
                        x1: dates[v],
                        yref: 'paper',
                        y1: 10,
                        line: {
                            color: this.makeColor(Math.abs(s[v]) * 510),
                            width: 1.5,
                            dash: 'dot'
                        }
                    }
                    self.layout.shapes.push(shape);
                }

            }
        };
        this.layout.title = dates.length + ' records where found';
        // });
    }

}
