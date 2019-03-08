import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Task } from './task-interface';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  animations: [routerTransition()],

})

export class TaskComponent implements OnInit {

  tasks: Task[];
  product: string;
  environment: string;
  constructor(public http: HttpClient) {

  }
  getConfig(task: Task) {
    return { template: '$!h!:$!m!:$!s!',leftTime: task.time};
  }
  ngOnInit() {
    var self = this;
    this.http.get('/recorder/taskTag')
      .subscribe(
        data => {
          self.tasks = data['tasks'];
        },
      );
      // this.countdown.resume();
  }

}