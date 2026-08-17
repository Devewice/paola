# Lluvia de ideas

Notas de trabajo de Paola. Aquí van las ideas antes de convertirse en módulos.

**Fecha de inicio:** 7/21/2026  
**Estefany — Paola Biker**

---

## Producto

Paola es una plataforma de comunidad motera: parche, rodadas, voz ciudadana, tienda y la historia de quién es Paola.

---

## Referentes de entidades

### Global

- **Inicio** — resumen

### Parchese — Club Motero

- Agenda
- **Apúntese pa rodar** — próximas rodadas o actividades, sistema de tickets
- **Así va el parche** — integrantes
- Alianzas
- Memorias
  - Conteo de kilómetros
  - Fotos de las actividades
  - Participantes y sus vehículos (enlaces de Instagram)
- Alianzas
- **Únete** — link de la comunidad de WhatsApp

### Tu voz — “rodando con propósito”

- Denuncias (alcantarillas, calles, abusos)
- Educación vial — leyes (tips)
- Comparendos¿? — asesoría básica

### Tienda / marketplace

- Productos / servicios
  - Entrega gratis en Bogotá y Soacha
  - Garantía por defectos de fabricación
- Limpieza de cascos
- Accesorios
- Ropa
- Método de pago (pasarela, confidencialidad)

### Paola / contacto / redes

- La razón
- ¿Quién es Paola?
- ¿Por qué lo hago?
- ¿Para qué lo hago?
- Contacto
- Correo, WhatsApp
- Redes
- Links de mis redes y video relevante

**Nota:** la publicidad o alianzas va en la pestaña de Parchese que apoyan las rodadas y actividades **y/o** continúa en un lado en todas las pestañas.

---

## Personas

- Ninguno

---

## Proyectos referentes

- **Motocultura:** [https://sosmotocultura.com/](https://sosmotocultura.com/)
- Clubs de moteros: referentes, pero se sienten como páginas básicas y sin mucho aporte
  - gonobikerreas — *El parche que nació para ser historia*
  - [https://motoclub.com.co/](https://motoclub.com.co/)
  - [https://bskmt.com/](https://bskmt.com/)

---

## Lógica de negocio

### Datos

- Conteo de kilómetros
- Integrantes
- Alianzas

### Rodadas

- Ruta de rodadas
- Fotos de rodadas terminadas
- Participantes de esa rodada
- Enlaces de Instagram o redes
- Próximas rodadas
- Sistema de tickets

### Recolección

- Membresías
- Publicidad
- Eventos
- Productos
  - Propios — intencional
  - Solo colaboración con marcas

### Marca

- Promoción de marca propia
- Sin mezclar
- Auténtico

### Usuarios

- Panel de usuario
- Compras
- Amigos
- Chat

### Clientes

- Marketplace
- Físicos
- Entrega gratis para Bogotá y Soacha
- Garantía solo por defectos de fabricación
- Política de privacidad — después
- Métodos de pago — pasarela de pago, opción adicional para enviar a soporte con Paola
- Servicios: lavado de cascos

---

## Visual

- Cámara 360 mascota como la Insta360, versión dibujos animados
- Orgánico, o no se si hay una propuesta mejor
- **Tríada retórica para crear historias** (ethos, pathos, logos), personificada en tres voces:
  - **Paola Armargura** — pathos: emoción, carácter, amargura
  - **Cámara Incauta** — ethos: la cámara ingenua que presencia y da credibilidad
  - **Moto Loigca** — logos: la moto que razona y explica
- **Paper Mario** (el juego): referente visual de recorte de papel, personajes planos en un mundo con volumen

---

## Arquitectura (código)

- El dominio no conoce Vue ni Vuetify
- Un `index.ts` público por módulo
- Cambiar localStorage por un adapter HTTP cuando exista API
- `HttpPort` compartido en `src/shared` si varios módulos necesitan red
- Vue Router cuando aparezca una segunda pantalla
- Pinia solo si el estado de UI se vuelve ruidoso; las reglas de negocio no van ahí

### Módulos que implica esta visión

- Inicio / resumen
- Club (integrantes, alianzas, kilómetros)
- Rodadas (agenda, tickets, memorias, fotos, participantes)
- Voz (denuncias, educación vial, asesoría básica de comparendos)
- Marketplace (productos, lavado de cascos, pagos)
- Paola / contacto / redes
- Usuarios (panel, compras, amigos, chat)
- Franja de publicidad / alianzas (global)

### Preguntas abiertas

- Backend: ¿API Node en este repo o un servicio aparte?
- Datos: ¿REST, GraphQL o local-first?
- Tests: ¿primero unitarios de casos de uso?
- Auth, roles, y si el club es público o solo para integrantes
- Sistema de tickets: ¿propio o un proveedor externo?
- ¿Pasarela de pago o “escribirle a Paola” como primer camino?
