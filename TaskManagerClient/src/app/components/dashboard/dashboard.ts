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
    if (!this.newTask.title.trim()) return;

    // Default new tasks to the "Todo" stage
    const taskToSend = { ...this.newTask, stage: 'Todo' };

    this.taskService.createTask(taskToSend).subscribe({
      next: () => {
        this.newTask = { title: '', description: '', stage: 'Todo' };
        this.loadTasks();
      },
      error: (err) => console.error('Failed to create task', err)
    });
  }

  // New method to advance or change a task's stage column
  updateTaskStage(task: any, newStage: string): void {
    const updatedTask = { ...task, stage: newStage };
    // Pass both the task ID and the updated payload object
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

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}