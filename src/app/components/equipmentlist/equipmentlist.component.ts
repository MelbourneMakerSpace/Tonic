import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Equipment } from '../../entities/equipment';
import { EquipmentService } from '../../services/equipment.service';

@Component({
  selector: 'equipmentlist',
  templateUrl: './equipmentlist.component.html',
  styles: [
  ]
})
export class EquipmentlistComponent implements OnInit {

  public equipmentList:Equipment[]

  constructor(private equipmentService:EquipmentService) { }

  ngOnInit(): void {
    this.equipmentService.getEquipmentList().pipe(take(1)).subscribe(equipment => {
      this.equipmentList = equipment;
    });
  }

}
