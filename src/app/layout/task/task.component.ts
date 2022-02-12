import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ITask } from '../../shared/interfaces/task-interface';
import { HttpClient } from '@angular/common/http';
// import { element } from 'protractor';
@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  animations: [routerTransition()],

})

export class TaskComponent implements OnInit {

  isLoading = true;
  tasks: ITask[];
  product: string;
  environment: string;
  constructor(public http: HttpClient) {

  }

  ngOnInit() {
    const self = this;
    this.http.get('/api/services/states/'+'?'+Math.random())
      .subscribe(
        data => {
          self.tasks = data['ProgressStatus'] as ITask[];
          self.tasks.forEach(task => {
            if (task.state === 1) {
              task.showAs = 'success';
            } else if (task.state === 2) {
              task.showAs = 'danger';
            }  else {
              task.showAs = 'warning';
            }
          });
        },
      );
      this.isLoading = false;

      // this.countdown.resume();
  }

}
