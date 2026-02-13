import { Component, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { UselessTask } from '../models/UselessTask';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-signalr',
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
  templateUrl: './signalr.component.html',
  styleUrls: ['./signalr.component.css'],
})
export class SignalrComponent implements OnInit {
  private hubConnection?: signalR.HubConnection;
  usercount = 0;
  tasks: UselessTask[] = [];
  taskname: string = '';

  ngOnInit(): void {
    this.connecttohub();
  }

  connecttohub() {
    // Créer la connexion vers le Hub
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5042/hub')
      .build();

    // Écouter les évènements du serveur
    this.hubConnection.on('TaskList', (tasks: UselessTask[]) => {
      this.tasks = tasks;
    });

    this.hubConnection.on('UserCount', (count: number) => {
      this.usercount = count;
    });

    // Se connecter
    this.hubConnection.start().catch(err => console.error(err));
  }

  complete(id: number) {
    this.hubConnection?.invoke('CompleteTask', id);
  }

  addtask() {
    this.hubConnection?.invoke('AddTask', this.taskname);
    this.taskname = '';
  }
}
