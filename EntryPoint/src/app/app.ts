import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./header/header";
import { RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('EntryPoint');
}
