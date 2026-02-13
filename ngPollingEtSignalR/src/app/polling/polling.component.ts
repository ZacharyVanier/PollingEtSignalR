import { Component, OnInit, OnDestroy } from '@angular/core';
import { UselessTask } from '../models/UselessTask';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-polling',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './polling.component.html',
  styleUrls: ['./polling.component.css'],
})
export class PollingComponent implements OnInit, OnDestroy {
  apiUrl = 'http://localhost:5042/api/';
  title = 'labo.signalr.ng';
  tasks: UselessTask[] = [];
  taskname: string = '';
  private pollingInterval: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.updateTasks();
  }

  ngOnDestroy(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  complete(id: number) {
    this.http.get(this.apiUrl + 'uselesstasks/complete/' + id).subscribe(() => {
      this.getTasks();
    });
  }

  addtask() {
    this.http.post<UselessTask>(this.apiUrl + 'uselesstasks/add?taskText=' + this.taskname, {}).subscribe((task) => {
      this.tasks.push(task);
      this.taskname = '';
    });

    console.log(this.tasks);
  }

  getTasks() {
    this.http.get<UselessTask[]>(this.apiUrl + 'uselesstasks/getall').subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  async updateTasks() {
    // Appel initial
    this.getTasks();

    // Polling: mise à jour chaque seconde
    this.pollingInterval = setInterval(() => {
      this.getTasks();
    }, 1000);
  }
}
