import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    // Siguraduha nga mao ni ang port sa imong Node.js backend
    private apiUrl = 'http://localhost:5000/api/customers';

    constructor(private http: HttpClient) { }

    // 1. Makuha ang tanang customers
    getCustomers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/all`);
    }

    // 2. Pag-save og bag-ong customer (Default isLocked = false)
    saveCustomer(customer: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/save`, customer);
    }

    // 3. Pag-update sa existing customer gamit ang MongoDB _id
    updateCustomer(customerId: any, customer: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/update/${customerId}`, customer);
    }

    // 4. Pag-delete sa customer gamit ang MongoDB _id
    deleteCustomer(customerId: any): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/delete/${customerId}`, {});
    }

    // 5. Pag-Lock (Mao ni ang replicate sa save pero true ang isLocked)
    lockCustomer(customerId: any, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/lock/${customerId}`, data);
    }

    // 6. Pag-Unlock (I-toggle balik sa false ang isLocked field)
    unlockCustomer(customerId: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/unlock/${customerId}`, {});
    }

    // Dashboard Statistics
    getDashboardStats(): Observable<any> {
        return this.http.get(`${this.apiUrl}/stats`);
    }
}