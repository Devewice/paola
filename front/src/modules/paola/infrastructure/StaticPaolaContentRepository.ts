import type { PaolaContentPort } from '@modules/paola/domain/ports/PaolaContentPort.ts'
import type { PaolaPage } from '@modules/paola/domain/entities/PaolaPage.ts'

/** Contenido estático de docs/paola.md — no se reescribe desde código. */
export class StaticPaolaContentRepository implements PaolaContentPort {
  getPage(): PaolaPage {
    return {
      narrative: [
        {
          id: 'razon',
          title: '¿Cuál es la razón?',
          body: 'Porque la moto me permitió conocer personas, territorios y realidades que antes no veía. Encontré en ella una forma de conectar, aprender y contar historias desde mi propia experiencia.',
        },
        {
          id: 'quien',
          title: '¿Quién es Paola?',
          body: 'Soy Paola, creadora de contenido, motociclista y mujer de Usme. Comparto mis experiencias, rodadas, opiniones y todo aquello que vivo alrededor de las motos, buscando siempre hacerlo desde lo que soy y desde mi realidad.',
        },
        {
          id: 'porque',
          title: '¿Por qué lo hago?',
          body: 'Porque quiero que entendamos que nuestra voz importa. Quiero utilizar mis redes para generar conciencia sobre lo que vivimos como motociclistas y promover que seamos más conscientes, responsables y respetuosos en las vías.',
        },
        {
          id: 'para-que',
          title: '¿Para qué lo hago?',
          body: 'Para demostrar que ser motociclista no es solamente tener una moto y salir a rodar. Es hacer parte de una comunidad, tener una responsabilidad con los demás y entender que nuestras acciones en la vía también hablan de quiénes somos. Rodando con Propósito es mi apuesta para llevar ese mensaje más lejos.',
        },
      ],
      contact: {
        email: 'contacto@paolabiker.com',
        domain: 'paolabiker.com',
        whatsapp: { status: 'pending', label: 'WhatsApp · próximamente' },
        social: { status: 'pending', label: 'Redes · próximamente' },
        video: { status: 'pending', label: 'Video · próximamente' },
      },
    }
  }
}
