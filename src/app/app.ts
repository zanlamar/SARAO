import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./shared/components/header/header";
import { RouterModule } from '@angular/router';
import { Footer } from "./shared/components/footer/footer";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, RouterModule, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('EntryPoint');
}

