import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {map} from "rxjs/operators";
import {DataService} from "../../data-service.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  ELEMENT_DATA  = [
    {position: 1, name: 'Hydrogen', completed: false, id: 'test'},
  ];
  displayedColumns: string[] = ['position', 'name'];
  tabElms = new BehaviorSubject<any>(this.ELEMENT_DATA);
  dataSource = this.tabElms;
  constructor(public fireservices: AngularFirestore, public data: DataService) { }

  ngOnInit(): void {
    this.data.currentList.subscribe((next: any) => {
      if (next.length > 0) {
        this.ELEMENT_DATA = [];

        this.fireservices.collection('todos', ref => ref.where('listId', '==', next))
          .snapshotChanges().pipe(
            map(changes =>
              changes.map(c =>
                // @ts-ignore
                ({ id: c.payload.doc.id, ...c.payload.doc.data() }))
            )
          ).subscribe((res: any) => {
            let counter = 0;
            const elements:any = [];
            res.forEach((el: any) => {
              elements.push(
                {position: counter, name: el.title, completed: el.completed, id: el.id}
              )
              counter++;
            })
            this.tabElms.next(elements)
          }
        )
      }
    })
  }

  onCheck = (id: string) => {
    console.log('Event: ', id)
  }

}
