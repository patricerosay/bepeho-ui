import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { IWorker } from '../../shared/interfaces/worker-interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.scss'],
  animations: [routerTransition()],

})

export class WorkerComponent implements OnInit {

  isLoading = true;
  workers: IWorker[];
  product: string;
  environment: string;
  constructor(public http: HttpClient) {

  }
  getIcon(worker: IWorker): string{
    switch (worker.name) {
      case 'Auto recording data':
          return 'fa-bar-chart';
      case 'Cleaning':
          return 'fa-eraser';
      case 'Auto recording audio video':
          return 'fa-video-camera';
          case 'Auto recording audio audio':
              return 'fa-microphone';
      default:
          return 'fa-cog';

  }
  }
  ngOnInit() {
    const self = this;
    this.http.get('/api/services/states/'+'?'+Math.random())
      .subscribe(
        data => {
          self.workers = data as IWorker[];
        },
      );
      this.isLoading = false;
  }
}
