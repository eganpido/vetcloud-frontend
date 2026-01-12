import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        // 1. I-save ang Core User Info
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.user.userId.toString());
        localStorage.setItem('username', res.user.username);

        // 2. I-save ang Default Branch (kon gikan sa backend)
        // Kon ang user naay gi-assign nga default branch, i-set nato ni
        if (res.user.branchId) {
          this.setCurrentBranch(res.user.branchId);
        }
      })
    );
  }

  // --- BRANCH MANAGEMENT METHODS ---

  // Gamiton kini inig pili sa user og branch sa dropdown
  setCurrentBranch(branchId: number | string) {
    localStorage.setItem('currentBranchId', branchId.toString());
  }

  // Kuhaon ang "Active" branch para sa Interceptor o Forms
  getCurrentBranchId(): string | null {
    return localStorage.getItem('currentBranchId');
  }

  // I-add kini nga function
  getCurrentUserId(): number | null {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const userData = JSON.parse(userJson);
      // Siguroha nga 'userId' ang field name nga gi-save nimo pag-login
      return userData.userId;
    }
    return null;
  }

  // Optional: Function para makuha ang tibuok user object
  getCurrentUser() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        return JSON.parse(userJson); // Kini mo-return sa { userId, username, fullname }
      } catch (e) {
        console.error("Error parsing user storage", e);
        return null;
      }
    }
    return null;
  }

  // --- AUTH HELPERS ---

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    // Tangtangon tanan apil ang branch session
    localStorage.clear();
  }
}