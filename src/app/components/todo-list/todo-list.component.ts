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
    {position: 1, name: 'Hydrogen'},
    {position: 2, name: 'Helium'},
    {position: 3, name: 'Lithium'},
    {position: 4, name: 'Beryllium'},
    {position: 5, name: 'Boron'},
    {position: 6, name: 'Carbon'},
    {position: 7, name: 'Nitrogen'},
    {position: 8, name: 'Oxygen'},
    {position: 9, name: 'Fluorine'},
    {position: 10, name: 'Neon'},
  ];
  displayedColumns: string[] = ['position', 'name'];
  tabElms = new BehaviorSubject(this.ELEMENT_DATA);
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
                {position: counter, name: el.title}
              )
              counter++;
            })
            this.tabElms.next(elements)
          }
        )
      }
    })
  }

}
