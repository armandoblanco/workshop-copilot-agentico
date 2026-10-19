// Almacenamiento en memoria de Contoso Eventos.
// Cada servidor crea su propio store, así los tests no comparten estado.

export function crearStore() {
  let ultimoEventoId = 3;
  let ultimaInscripcionId = 3;

  const eventos = [
    { id: 1, nombre: 'Meetup de IA Aplicada', fecha: '2026-11-12', capacidad: 3, lugar: 'Miami' },
    { id: 2, nombre: 'Taller de DevOps', fecha: '2026-11-20', capacidad: 50, lugar: 'San José' },
    { id: 3, nombre: 'Hackday de Modernización', fecha: '2026-12-03', capacidad: 25, lugar: 'Ciudad de México' },
  ];

  const inscripciones = [
    { id: 1, eventoId: 1, nombre: 'Ana Pérez', email: 'ana@contoso.com' },
    { id: 2, eventoId: 1, nombre: 'Luis Gómez', email: 'luis@contoso.com' },
    { id: 3, eventoId: 2, nombre: 'Marta Ruiz', email: 'marta@contoso.com' },
  ];

  return {
    listarEventos() {
      return eventos;
    },
    obtenerEvento(id) {
      return eventos.find((evento) => evento.id === id);
    },
    crearEvento(datos) {
      const evento = { id: ++ultimoEventoId, ...datos };
      eventos.push(evento);
      return evento;
    },
    listarInscripciones(eventoId) {
      return inscripciones.filter((inscripcion) => inscripcion.eventoId === eventoId);
    },
    crearInscripcion(eventoId, datos) {
      const inscripcion = { id: ++ultimaInscripcionId, eventoId, ...datos };
      inscripciones.push(inscripcion);
      return inscripcion;
    },
  };
}
