import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private apiUrl = 'http://localhost:9000/api'

  constructor(private http: HttpClient) {}

  addEmployee(formData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/addemployee`, formData, { headers });
  }

    getEmployees(): Observable<any> {
        return this.http.get(`${this.apiUrl}/getemployees`);
    }

    getEmployee(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/getemployee/${id}`);
      }
    
      updateEmployee(id: number, formData: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.put(`${this.apiUrl}/updateemployee/${id}`, formData, { headers });
      }
    
      deleteEmployee(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/deleteemployee/${id}`);
      }

}
