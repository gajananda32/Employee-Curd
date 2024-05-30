import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  userform : FormGroup;

constructor(private formBuilder: FormBuilder) { 
  this.userform = this.formBuilder.group({
  });
}

ngOnInit() {
  this.createUserForm();
}

createUserForm() {
  this.userform = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.pattern(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    password: ['', [Validators.required, Validators.pattern(/^.{6,}$/)]]
  });
}

submit(){
  console.log(this  .userform.value);
  const formData = JSON.stringify(this.userform.value);
  
  // Create a new Blob with the form data
  const blob = new Blob([formData], { type: 'application/json' });

  // Create a temporary anchor element
  const anchor = document.createElement('a');
  anchor.download = 'formData.json';

  // Create a URL for the Blob and set it as the anchor's href
  anchor.href = window.URL.createObjectURL(blob);

  // Simulate a click on the anchor element to trigger the download
  anchor.click();

}

}
