import { Component, OnInit } from '@angular/core';

interface Faq {
  pregunta: string;
  respuesta: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  // Datos de las preguntas (Puedes mover esto a un servicio si prefieres)
  faqs: Faq[] = [
    {
      pregunta: '¿Con cuánta antelación debo hacer mi reserva?',
      respuesta: 'Recomendamos realizar la reserva con al menos 3 meses de antelación para bodas y grandes eventos. Para reuniones más pequeñas, 2 semanas pueden ser suficientes según disponibilidad.',
      isOpen: true // La primera abierta por defecto para invitar a leer
    },
    {
      pregunta: '¿Puedo cancelar una reserva confirmada?',
      respuesta: 'Sí, puedes cancelar tu reserva desde la sección "Mis Reservas". Ten en cuenta que las cancelaciones realizadas con menos de 48 horas de antelación pueden incurrir en gastos de gestión.',
      isOpen: false
    },
    {
      pregunta: '¿Hasta qué hora puede durar el evento?',
      respuesta: 'El alquiler de la Sala Real incluye el uso de las instalaciones hasta las 03:00 AM. Si deseas extender la celebración, es posible ampliar el horario hasta las 06:00 AM contratando horas extra.',
      isOpen: false
    },
    {
      pregunta: '¿Cuál es la capacidad máxima de la Sala Real?',
      respuesta: 'La Sala Real tiene un aforo máximo de 200 personas en formato cóctel y 150 en formato banquete. Para eventos más íntimos, consulta nuestras otras salas.',
      isOpen: false
    },
    {
      pregunta: '¿Hay aparcamiento disponible?',
      respuesta: 'Sí, contamos con un aparcamiento privado subterráneo con capacidad para 50 vehículos, exclusivo para los asistentes al evento.',
      isOpen: false
    }
  ];

  faqsFiltradas: Faq[] = [];

  constructor() { }

  ngOnInit(): void {
    // Inicializamos las filtradas con todas las preguntas
    this.faqsFiltradas = this.faqs;
  }

  // Abrir/Cerrar acordeón
  toggleFaq(index: number): void {
    // Opción A: Solo uno abierto a la vez (Descomenta esto si lo prefieres)
    /*
    this.faqsFiltradas.forEach((item, i) => {
      if (i !== index) item.isOpen = false;
    });
    */

    // Opción B: Múltiples abiertos (Toggle simple)
    this.faqsFiltradas[index].isOpen = !this.faqsFiltradas[index].isOpen;
  }

  // Filtrar preguntas con el buscador
  filtrarPreguntas(event: any): void {
    const texto = event.target.value.toLowerCase();
    
    if (!texto) {
      this.faqsFiltradas = this.faqs;
      return;
    }

    this.faqsFiltradas = this.faqs.filter(faq => 
      faq.pregunta.toLowerCase().includes(texto) || 
      faq.respuesta.toLowerCase().includes(texto)
    );
  }
}