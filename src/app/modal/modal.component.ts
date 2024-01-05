import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppModule } from '../app.module';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatabaseService, User } from '../services/database.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone:true,
  imports:[IonicModule,ReactiveFormsModule],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class ModalComponent  implements OnInit {

  @Input() title: string = "Default title";
  @Output() close = new EventEmitter<void>();

  //create is true
  @Input() updateOrCreate: boolean = true;

  @Input() userForUpdate!: User;
  userCreateForm!: FormGroup;
  constructor(private fb: FormBuilder, private database: DatabaseService) 
  {

  }

  ngOnInit() {
    if(this.updateOrCreate)
    {
      this.userCreateForm = this.fb.group({
        name: ['', Validators.required],
        birthDate: [null, Validators.required],
        job: ['', Validators.required],
        tel: ['', Validators.required]
      });
    }
    if(!this.updateOrCreate && this.userForUpdate)
    {
      this.userCreateForm = this.fb.group({
        name: [this.userForUpdate.name, Validators.required],
        birthDate: [this.userForUpdate.birthDate, Validators.required],
        job: [this.userForUpdate.job, Validators.required],
        tel: [this.userForUpdate.tel, Validators.required]
      });
    }
   

  }

  onSubmit()
  {
    const userFormValue = this.userCreateForm.value;

    const user: User =
    {
      id:0,
      name:userFormValue.name,
      birthDate:userFormValue.birthDate,
      job:userFormValue.job,
      tel:userFormValue.tel,
      active:1
    }
    if(this.userForUpdate && !this.updateOrCreate)
    {
      user.id = this.userForUpdate.id;
      this.database.updateUser(user);
    }
    if(this.updateOrCreate)
    {
      this.database.addUser(user);
      console.log("USERR",user);
    }

    this.userCreateForm.reset();

  }



}
