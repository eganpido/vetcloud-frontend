import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PetService {
    private apiUrl = 'http://localhost:5000/api/pets';
    //   private apiUrl = `${environment.apiUrl}/pets`; // Siguroha nga husto ang path sa imong backend

    constructor(private http: HttpClient) { }

    // Kuhaon ang tanang pets
    getPets(customerId?: number): Observable<any[]> {
        // 1. Kuhaon ang token nga gi-save nimo pag-login
        const token = localStorage.getItem('token');

        // 2. Paghimo og HttpParams
        let params = new HttpParams();
        if (customerId) {
            params = params.set('customerId', customerId.toString());
        }

        // 3. I-setup ang Headers (Siguroha nga motakdo sa 'x-auth-token' sa backend)
        const headers = {
            'x-auth-token': token || ''
        };

        // 4. I-pass ang params ug headers
        return this.http.get<any[]>(`${this.apiUrl}/all`, { params, headers });
    }
    // Save bag-ong record
    savePet(petData: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/save`, petData);
    }

    // Update existing record
    updatePet(petId: number, petData: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/update/${petId}`, petData);
    }

    // Lock record (Hybrid: Create or Update)
    lockPet(petId: number, petData: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/lock/${petId}`, petData);
    }

    // Unlock record
    unlockPet(petId: number): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/unlock/${petId}`, {});
    }

    // Delete record
    deletePet(petId: number): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = { 'x-auth-token': token || '' };

        return this.http.delete(`${this.apiUrl}/delete/${petId}`, { headers });
    }
}