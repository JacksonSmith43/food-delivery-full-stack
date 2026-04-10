import { Component, EventEmitter, HostListener, Output, signal } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { MatAnchor } from '@angular/material/button';

@Component({
  selector: 'app-popup',
  imports: [MatAnchor, A11yModule],
  templateUrl: './popup.html',
  styleUrl: './popup.css',
})
export class PopupComponent {
  isOpen = signal<boolean>(false);
  title = signal<string>('');
  message = signal<string>('');

  // Child -> Parent event when the popup is closed (confirm OR cancel).
  @Output() closed = new EventEmitter<void>();
  // Child -> Parent event only for the positive action (Yes).
  @Output() confirmed = new EventEmitter<void>();

  // Escape key closes the popup when it is open.
  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen()) {
      this.close();
    }
  }

  // Parent calls this to open the popup with dynamic text.
  open(title: string, message: string) {
    console.log('PopupComponent_open().');
    this.title.set(title);
    this.message.set(message);
    this.isOpen.set(true);
  }

  // User clicked "No" (or close action).
  close() {
    console.log('PopupComponent_close().');
    this.isOpen.set(false);
    // Notify the parent that the popup is no longer visible.
    this.closed.emit();
  }

  // User clicked "Yes".
  onConfirm() {
    console.log('PopupComponent_onConfirm().');
    this.isOpen.set(false);
    // First tell parent: action confirmed.
    this.confirmed.emit();
    // Then tell parent: popup closed.
    this.closed.emit();
  }
}
