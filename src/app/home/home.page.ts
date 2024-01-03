import { Component, OnInit, Signal, ViewContainerRef, WritableSignal, signal } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { DatabaseService, User } from '../services/database.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  users$!:Observable<User[]>;
  randomUser!: User;
  removeUserFlag:boolean = false;

  userIdsForRemove: number[] = [];
  constructor(private viewContainerRef:ViewContainerRef, 
              private database: DatabaseService
    ) {
      this.randomUser = this.generateRandomUser();
    }
  

   
  ngOnInit(): void
  {
    this.users$ = this.database.getUsers;
  }


  ShowModal()
  {
    this.viewContainerRef.clear();
    const component = this.viewContainerRef.createComponent(ModalComponent);

    component.instance.title = "MY MODAL";
    component.instance.close.subscribe(()=> this.viewContainerRef.clear());
  }
  generateRandomUser(): User {
    
    return {
      id: Math.floor(Math.random() * 1000),
      name: 'Random Person',
      birthDate: new Date(),
      job: 'Random Job',
      tel: 'Random Tel',
      active: Math.random() > 0.5 ? 1 : 0,
    };
  }

  removeUserAction()
  {
    this.removeUserFlag = true;
  }

  checkBoxChange(event: any)
  {
    const customEvent = event as CustomEvent;
    if (customEvent.detail.checked) 
    {
      this.userIdsForRemove.push(customEvent.detail.value);
    }
     else 
    {
      let index = this.userIdsForRemove.findIndex(
        (x) => x == customEvent.detail.value
      );
      if (index !== -1) {
        this.userIdsForRemove.splice(index, 1);
      }
    }
    
  }

}
