import { Component, OnInit } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { routerTransition } from '../../router.animations';
import { Configuration } from './configuration-interface';
import { HttpHeaders } from '@angular/common/http';

/** @title Configuration Pannel */
@Component({
    selector: 'app-map',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.scss'],
    animations: [routerTransition()]
})

export class ConfigurationComponent implements OnInit {

    general: Configuration[];
    advanced: Configuration[];
    isLoading=false;
    constructor(public http: HttpClient) { }
    private url = '/recorder/parameters';


    save()
    {
        var configurations=this.advanced;

        for (var i=0; i<this.general.length;i++)
        {
            var found=false;
            for (var j=0; j<configurations.length;j++)
            {
                if(configurations[j].bundleName == this.general[i].bundleName)
                {
                    configurations[j].props.general=this.general[i].props.general;
                    found=true;
                    break;
                }
            }
            if(!found)
            {
                configurations.push(this.general[i]);
            }

        }
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': 'my-auth-token'
            })
          };

        this.http.post<Configuration[]>(this.url+'&verb=store' + '&', JSON.stringify(configurations), httpOptions);
        // console.log(JSON.stringify(configurations));
     }
    ngOnInit() {
        var self = this;
        this.http.get('/recorder/parameters')
            .subscribe(
                data => {
                    var configurations = data as Configuration[];
                    self.advanced = [];
                    self.general=[];
                    for (var i=0; i<configurations.length;i++)
                    {
                        if (configurations[i].props.advanced)
                        {
                            self.advanced.push(configurations[i])
                        }
                        if (configurations[i].props.general)
                        {
                            self.general.push(configurations[i])
                        }

                    }
                    self.isLoading=false;
                },
            );
    }

}
