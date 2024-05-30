import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusinessService } from '../authservice/bussinessservice';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {
employeForm ! : FormGroup
isResultLoaded = false;
employees : any = [];
editingEmployeeId: number | null = null;
buttonLabel = 'Add';
searchTerm: string = '';


  constructor (private formBuilder: FormBuilder,private bs: BusinessService,private http:HttpClient){}
  
  ngOnInit(){
    this.employeeeForm();
    this.getAllEmployees();
  }
  employeeeForm (){
  this.employeForm = this.formBuilder.group({
    name: ['',[Validators.required,Validators.minLength(4)]],
    position : ['',[Validators.required]],
    office : ['',[Validators.required]],
    salary : ['',[Validators.required]]
  })
  }
  getAllEmployees() {
    this.bs.getEmployees().subscribe(
      (data: any) => {
        console.log('🚀 ~ EmployeeComponent ~ getAllEmployees ~ data:', data);
        this.employees = data.data;
        this.isResultLoaded = true;
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  submit(){
    if(this.employeForm.valid){
      console.log(this.employeForm.value);
      let postData ={
        name : this.employeForm.value.name,
        position : this.employeForm.value.position,
        office : this.employeForm.value.office,
        salary : this.employeForm.value.salary
      }
      if (this.editingEmployeeId) {
        console.log("🚀 ~ EmployeeComponent ~ submit ~ postData:", postData)
        this.bs.updateEmployee(this.editingEmployeeId, postData).subscribe(
          (data: any) => {
            console.log(data);
            this.getAllEmployees();
            this.editingEmployeeId = null;
            this.employeForm.reset();
          },
          (error: any) => {
            console.error('Error:', error);
          }
        );
      } else {
      console.log("🚀 ~ EmployeeComponent ~ submit ~ postData:", postData)
     this.bs.addEmployee(postData).subscribe((data:any)=>{
      console.log(data)
      this.buttonLabel = 'Add';
      this.employeForm.reset();
      this.getAllEmployees();
     })
    }
    }
  }

  setUpdate(employee: any) {
    console.log("🚀 ~ EmployeeComponent ~ setUpdate ~ employee:", employee)
    this.editingEmployeeId = employee.id;
    this.employeForm.patchValue(employee);
    this.buttonLabel = 'Update';

  }

  setDelete(employee: any) {
    if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
      this.bs.deleteEmployee(employee.id).subscribe(
        (data: any) => {
          console.log(data);
          this.getAllEmployees();  // Refresh the list after deleting an employee
        },
        (error: any) => {
          console.error('Error:', error);
        }
      );
    }
  }

  get filteredEmployees() {
    return this.employees.filter((emp: { name: string; position: string; office: string; salary: string; }) => 
      emp.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      emp.office.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      emp.salary.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

}
