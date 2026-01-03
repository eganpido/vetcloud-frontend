import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth'; // Usba ang port kon lahi imong gamit

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        // I-save ang token ug user info kon malampuson ang login
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.user.userId.toString());
        localStorage.setItem('username', res.user.username);
      })
    );
  }

  // Method para mahibal-an kon logged in ba ang user
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Method para sa pag-logout
  logout() {
    localStorage.clear();
  }
}