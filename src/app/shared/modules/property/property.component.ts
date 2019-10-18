import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Configuration, Property } from '../../../shared/interfaces/configuration-interface';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit {
  @Input() bgClass: string;
  @Input() properties: Map<string, Property[]>;
  @Input() id: string;
  @Input() label: string;

  @Output() event: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router) { }

  getMapKey(m: Map<string, Property[]>): string[] {
    return Array.from(m.keys());
  }

  getProperties(m: Map<string, Property[]>, key: string): Property[] {
    return m.get(key);
  }
  setBooleanValue(prop: Property , e) {
    if (e.checked) {
      prop.value = 'true';
   } else {
    prop.value = 'false';
   }
}
  ngOnInit() { }

}
