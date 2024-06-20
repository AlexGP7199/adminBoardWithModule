import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-simple-card',
  templateUrl: './simple-card.component.html',
  styleUrl: './simple-card.component.css'
})
export class SimpleCardComponent {
  @Input() 
  public title: string = 'Title';
  @Input() 
  public content: string = '0';
  @Input() 
  public stats: string = '0';
  @Input() 
  public footerlaber: string = '0';
}
