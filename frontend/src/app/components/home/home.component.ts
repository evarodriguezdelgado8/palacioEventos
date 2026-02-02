import { Component, OnInit } from '@angular/core';
import { ReservasService } from '../../services/reservas.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  salas: any[] = [];

  constructor(private reservasService: ReservasService) { }

  ngOnInit() {
    this.reservasService.getAllSalas().subscribe(data => {
      this.salas = data;
    });
  }
}
