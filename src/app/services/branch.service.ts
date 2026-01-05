import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BranchService {
    // Siguroha nga husto ang port sa imong backend
    private apiUrl = 'http://localhost:5000/api/branches';

    constructor(private http: HttpClient) { }

    // Kuhaon ang tanang branches para sa dropdown sa login
    getAllBranches(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/all`);
    }

    // Pwede sab nimo pun-an og method para sa pag-add og branch puhon
    addBranch(branchData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/add`, branchData);
    }
}