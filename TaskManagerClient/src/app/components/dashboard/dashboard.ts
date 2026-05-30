import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  tasks: any[] = [];
  errorMessage: string | null = null;
  newTask = { title: '', description: '', stage: 'Todo' };

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data: any) => this.tasks = data,
      error: (err) => console.error('Failed to fetch tasks', err)
    });
  }

  createTask(): void {
    // 1. Frontend validation check to stop empty submissions
    if (!this.newTask.title.trim()) {
      this.showError('Task title cannot be empty!');
      return;
    }

    const taskToSend = { ...this.newTask, stage: 'Todo' };

    this.taskService.createTask(taskToSend).subscribe({
      next: () => {
        this.newTask = { title: '', description: '', stage: 'Todo' };
        this.errorMessage = null; // Clear any existing errors on success
        this.loadTasks();
      },
      error: (err) => {
        console.error('Failed to create task', err);
        this.showError('Server communication failed. Please try again.');
      }
    });
  }

  updateTaskStage(task: any, newStage: string): void {
    const updatedTask = { ...task, stage: newStage };
    this.taskService.updateTask(task.id, updatedTask).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Failed to update task stage', err)
    });
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Failed to delete task', err)
    });
  }

  // Helper method to show and automatically hide error notifications after 4 seconds
  showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      if (this.errorMessage === message) {
        this.errorMessage = null;
      }
    }, 4000);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}