import {Component, Input, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {map} from "rxjs/operators";
import {DataService} from "../../data-service.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @Input() isColumn: boolean = false;
  menuList: any;
  constructor(public fireservices: AngularFirestore, public data: DataService) { }

  ngOnInit(): void {
    this.fireservices.collection('lists').snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          // @ts-ignore
          ({ id: c.payload.doc.id, ...c.payload.doc.data() }))
      )
    ).subscribe((res: any) => { this.menuList = res })
  }

  onClick = (id: string) => {
    this.data.currentList.next(id);
  }

}
