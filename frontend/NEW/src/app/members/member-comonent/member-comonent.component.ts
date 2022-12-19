import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/_models/User';

@Component({
  selector: 'app-member-comonent',
  templateUrl: './member-comonent.component.html',
  styleUrls: ['./member-comonent.component.css'],
})
export class MemberComonentComponent implements OnInit {
  @Input() user: User;

  constructor() {}

  ngOnInit() {}
}
