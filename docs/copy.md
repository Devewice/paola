# Copy — tono Paola Biker

Guía rápida. Lo vinculante de arquitectura está en [`AGENTS.md`](../AGENTS.md).

## Voz

- Parche, moto, Bogotá/Soacha. Cercano, no corporativo.
- Habla **al usuario** (*tú*): *escríbeme*, *te aviso*, *únete*, *mira la próxima salida*.
- **Paola Biker** en marca, títulos, pestañas y legal. No hace falta repetir *Paola* en cada botón.

## Evitar

- CTAs en tercera persona repetitivos: ~~escríbele a Paola~~, ~~pregúntale a Paola~~.
- Tono institucional frío o genérico de motoclub.

## Dónde va el texto

- `front/src/app/constants/` — cascarón, rutas, legal compartido.
- `front/src/modules/<módulo>/constants/` — copy del módulo.
- Componentes `@ui` — defaults genéricos (*Escríbeme*); el detalle lo pasan las vistas.

## Tríada (referencia)

| Voz | Uso |
|-----|-----|
| Moto Loigca | Rodadas, cupo, ley, tips |
| Cámara Incauta | Fotos, memorias |
| Paola Armargura | Relato, denuncias, cierre |

## CTAs compartidos

En `front/src/app/constants/copy.ts`:

```ts
CONTACT_COPY.cta           // Escríbeme
CONTACT_COPY.ctaWhatsApp   // Escríbeme por WhatsApp
CONTACT_COPY.ctaMail       // Escríbenos por correo
```

Los componentes `@ui` usan *Escríbeme* como default; las vistas pueden pasar el texto concreto por prop.

## Fijos

- `contacto@paolabiker.com`
- `paolabiker.com`
