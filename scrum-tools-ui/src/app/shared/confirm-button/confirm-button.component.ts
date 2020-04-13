import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-button',
  templateUrl: './confirm-button.component.html',
  styleUrls: ['./confirm-button.component.scss'],
})
export class ConfirmButtonComponent implements OnInit {
  isConfirming = false;

  @Output() confirmed = new EventEmitter();

  secondary = false;
  small = false;

  constructor(private ref: ElementRef) {}

  ngOnInit(): void {
    this.secondary = this.ref.nativeElement.classList.contains('secondary');
    this.small = this.ref.nativeElement.classList.contains('small');
  }

  ask() {
    this.isConfirming = true;
  }
  confirm() {
    this.confirmed.emit(true);
  }
  cancel() {
    this.isConfirming = false;
  }
}
