import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component'; // I-import kini
import { LayoutComponent } from './components/layout/layout.component';       // I-import ang Layout
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    // 1. Pages nga walay Sidebar (Public Pages)
    {
        path: '',
        component: LandingPageComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },

    // 2. Pages nga naay Sidebar (Protected Pages)
    {
        path: '',
        component: LayoutComponent, // Mao ni ang naay Sidebar ug Navbar
        canActivate: [authGuard],   // Protektado sa Auth Guard
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'customers',
                component: CustomerListComponent
            },
            // Pwede nimo pun-an diri puhon (e.g., inventory, reports)
        ]
    },

    // 3. Wildcard (Redirect sa Landing Page kon dili makit-an ang route)
    {
        path: '**',
        redirectTo: ''
    }
];