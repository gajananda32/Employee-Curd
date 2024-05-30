import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { EmployeeComponent } from './employee/employee.component';

export const routes: Routes = [
    {
        path: 'user',
        component: UserComponent
    },
    { path : 'add-employee',component : EmployeeComponent},

];
