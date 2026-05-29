import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'https://localhost:7119/api/task';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, { headers: this.getHeaders() });
  }

  createTask(task: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, task, { headers: this.getHeaders() });
  }

  updateTask(id: number, task: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, task, { headers: this.getHeaders() });
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }
}