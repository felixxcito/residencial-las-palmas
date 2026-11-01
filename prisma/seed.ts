import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

const MAINTENANCE_FEE_CENTS = 12_000;

function monthsAgo(n: number, day: number) {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - n);
  d.setDate(day);
  d.setHours(12, 0, 0, 0);
  return d;
}

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat("es", { month: "long", year: "numeric" }).format(date);
}

async function main() {
  console.log("Limpiando base de datos...");
  await prisma.visitor.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.ticketComment.deleteMany();
  await prisma.maintenanceTicket.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.commonArea.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.charge.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.resident.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.condoSettings.deleteMany();

  console.log("Creando configuración del condominio...");
  await prisma.condoSettings.create({
    data: {
      name: "Residencial Las Palmas",
      address: "Av. Principal 123",
      currency: "USD",
      feeDueDay: 5,
    },
  });

  console.log("Creando usuarios...");
  const adminPassword = await hashPassword("Admin123!");
  const guardPassword = await hashPassword("Guardia123!");
  const residentPassword = await hashPassword("Residente123!");

  const admin = await prisma.user.create({
    data: {
      name: "Carla Méndez",
      email: "admin@condominio.com",
      passwordHash: adminPassword,
      role: "ADMIN",
      phone: "555-0100",
    },
  });

  const guard = await prisma.user.create({
    data: {
      name: "José Ramírez",
      email: "guardia1@condominio.com",
      passwordHash: guardPassword,
      role: "GUARD",
      phone: "555-0200",
    },
  });

  const residentNames = [
    "Ana Torres",
    "Luis Fernández",
    "María Gómez",
    "Carlos Ruiz",
    "Sofía Herrera",
    "Diego Castillo",
    "Valentina Rojas",
    "Andrés Paredes",
    "Camila Suárez",
  ];

  const residentUsers = [];
  for (let i = 0; i < residentNames.length; i++) {
    const user = await prisma.user.create({
      data: {
        name: residentNames[i],
        email: `residente${i + 1}@condominio.com`,
        passwordHash: residentPassword,
        role: "RESIDENT",
        phone: `555-03${String(i + 1).padStart(2, "0")}`,
      },
    });
    residentUsers.push(user);
  }

  console.log("Creando unidades...");
  const unitCodes: { code: string; floor: number; vacant?: boolean }[] = [
    { code: "A-101", floor: 1 },
    { code: "A-102", floor: 1 },
    { code: "A-103", floor: 1 },
    { code: "A-104", floor: 1, vacant: true },
    { code: "A-201", floor: 2 },
    { code: "A-202", floor: 2 },
    { code: "A-203", floor: 2 },
    { code: "A-204", floor: 2 },
    { code: "A-301", floor: 3 },
    { code: "A-302", floor: 3 },
    { code: "A-303", floor: 3 },
    { code: "A-304", floor: 3, vacant: true },
  ];

  const units = [];
  for (const u of unitCodes) {
    const unit = await prisma.unit.create({
      data: {
        code: u.code,
        building: "Torre A",
        floor: u.floor,
        type: "Departamento",
        areaM2: 85 + u.floor * 5,
        parkingSpots: 1,
        status: u.vacant ? "VACANT" : "OCCUPIED",
      },
    });
    units.push({ ...unit, vacant: Boolean(u.vacant) });
  }

  const occupiedUnits = units.filter((u) => !u.vacant);

  console.log("Creando residentes...");
  for (let i = 0; i < residentUsers.length; i++) {
    const unit = occupiedUnits[i];
    await prisma.resident.create({
      data: {
        unitId: unit.id,
        userId: residentUsers[i].id,
        fullName: residentUsers[i].name,
        email: residentUsers[i].email,
        phone: residentUsers[i].phone,
        relation: i % 4 === 0 ? "TENANT" : "OWNER",
        isPrimary: true,
      },
    });
  }

  // Última unidad ocupada: residente sin cuenta de acceso al portal
  const lastUnit = occupiedUnits[occupiedUnits.length - 1];
  await prisma.resident.create({
    data: {
      unitId: lastUnit.id,
      fullName: "Roberto Vega",
      phone: "555-0399",
      relation: "OWNER",
      isPrimary: true,
    },
  });

  // Familiar adicional (sin login) en la primera unidad
  await prisma.resident.create({
    data: {
      unitId: occupiedUnits[0].id,
      fullName: "Pedro Torres",
      relation: "TENANT",
      isPrimary: false,
    },
  });

  console.log("Creando vehículos...");
  const vehicleSeed = [
    { plate: "ABC-123", brand: "Toyota", model: "Corolla", color: "Blanco" },
    { plate: "DEF-456", brand: "Honda", model: "Civic", color: "Gris" },
    { plate: "GHI-789", brand: "Chevrolet", model: "Onix", color: "Rojo" },
    { plate: "JKL-012", brand: "Nissan", model: "Sentra", color: "Negro" },
    { plate: "MNO-345", brand: "Kia", model: "Rio", color: "Azul" },
    { plate: "PQR-678", brand: "Hyundai", model: "Accent", color: "Blanco" },
    { plate: "STU-901", brand: "Mazda", model: "3", color: "Gris" },
    { plate: "VWX-234", brand: "Ford", model: "Fiesta", color: "Rojo" },
  ];
  for (let i = 0; i < vehicleSeed.length; i++) {
    const unit = occupiedUnits[i % occupiedUnits.length];
    await prisma.vehicle.create({
      data: {
        unitId: unit.id,
        ...vehicleSeed[i],
        parkingSpot: `P-${i + 1}`,
      },
    });
  }

  console.log("Creando cuotas y pagos...");
  for (const unit of occupiedUnits) {
    for (let m = 2; m >= 0; m--) {
      const dueDate = monthsAgo(m, 5);
      const period = `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, "0")}`;
      const charge = await prisma.charge.create({
        data: {
          unitId: unit.id,
          concept: `Cuota de mantenimiento - ${monthLabel(dueDate)}`,
          amountCents: MAINTENANCE_FEE_CENTS,
          period,
          dueDate,
          status: "PENDING",
        },
      });

      const unitIndex = occupiedUnits.indexOf(unit);
      const roll = (unitIndex + m) % 5;

      if (m > 0 && roll < 3) {
        // Pagado por completo
        await prisma.payment.create({
          data: {
            chargeId: charge.id,
            amountCents: MAINTENANCE_FEE_CENTS,
            method: roll === 0 ? "TRANSFER" : "CASH",
            registeredById: admin.id,
            paidAt: dueDate,
          },
        });
        await prisma.charge.update({ where: { id: charge.id }, data: { status: "PAID" } });
      } else if (m > 0 && roll === 3) {
        // Pago parcial
        await prisma.payment.create({
          data: {
            chargeId: charge.id,
            amountCents: MAINTENANCE_FEE_CENTS / 2,
            method: "CASH",
            registeredById: admin.id,
            paidAt: dueDate,
          },
        });
        await prisma.charge.update({ where: { id: charge.id }, data: { status: "PARTIAL" } });
      } else if (m === 0 && roll < 2) {
        // Mes actual ya pagado por adelantado
        await prisma.payment.create({
          data: {
            chargeId: charge.id,
            amountCents: MAINTENANCE_FEE_CENTS,
            method: "TRANSFER",
            registeredById: admin.id,
          },
        });
        await prisma.charge.update({ where: { id: charge.id }, data: { status: "PAID" } });
      }
      // El resto queda en PENDING (se mostrará como vencida si dueDate ya pasó)
    }
  }

  console.log("Creando áreas comunes...");
  const salon = await prisma.commonArea.create({
    data: {
      name: "Salón de eventos",
      description: "Espacio cerrado con capacidad para 80 personas, incluye mesas y sillas.",
      capacity: 80,
      openTime: "09:00",
      closeTime: "23:00",
      slotMinutes: 240,
      requiresApproval: true,
    },
  });
  const cancha = await prisma.commonArea.create({
    data: {
      name: "Cancha multiusos",
      description: "Cancha para fútbol y básquet.",
      capacity: 20,
      openTime: "07:00",
      closeTime: "22:00",
      slotMinutes: 60,
    },
  });
  const piscina = await prisma.commonArea.create({
    data: {
      name: "Piscina",
      description: "Piscina climatizada con área de descanso.",
      capacity: 30,
      openTime: "08:00",
      closeTime: "20:00",
      slotMinutes: 90,
    },
  });
  const quincho = await prisma.commonArea.create({
    data: {
      name: "Quincho",
      description: "Zona de parrillas al aire libre.",
      capacity: 25,
      openTime: "10:00",
      closeTime: "22:00",
      slotMinutes: 120,
    },
  });

  console.log("Creando reservas...");
  const now = new Date();
  function atHour(daysFromNow: number, hour: number, durationMinutes: number) {
    const start = new Date(now);
    start.setDate(start.getDate() + daysFromNow);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(start.getTime() + durationMinutes * 60_000);
    return { start, end };
  }

  const pastSlot = atHour(-10, 18, 120);
  await prisma.reservation.create({
    data: {
      commonAreaId: quincho.id,
      unitId: occupiedUnits[0].id,
      userId: residentUsers[0].id,
      startTime: pastSlot.start,
      endTime: pastSlot.end,
      status: "COMPLETED",
    },
  });

  const pastSlot2 = atHour(-4, 10, 90);
  await prisma.reservation.create({
    data: {
      commonAreaId: piscina.id,
      unitId: occupiedUnits[1].id,
      userId: residentUsers[1].id,
      startTime: pastSlot2.start,
      endTime: pastSlot2.end,
      status: "COMPLETED",
    },
  });

  const futureSlot1 = atHour(2, 19, 60);
  await prisma.reservation.create({
    data: {
      commonAreaId: cancha.id,
      unitId: occupiedUnits[2].id,
      userId: residentUsers[2].id,
      startTime: futureSlot1.start,
      endTime: futureSlot1.end,
      status: "CONFIRMED",
    },
  });

  const futureSlot2 = atHour(5, 9, 90);
  await prisma.reservation.create({
    data: {
      commonAreaId: piscina.id,
      unitId: occupiedUnits[3].id,
      userId: residentUsers[3].id,
      startTime: futureSlot2.start,
      endTime: futureSlot2.end,
      status: "CONFIRMED",
    },
  });

  const futureSlot3 = atHour(7, 12, 120);
  await prisma.reservation.create({
    data: {
      commonAreaId: quincho.id,
      unitId: occupiedUnits[4].id,
      userId: residentUsers[4].id,
      startTime: futureSlot3.start,
      endTime: futureSlot3.end,
      status: "CONFIRMED",
    },
  });

  const pendingSlot = atHour(10, 15, 240);
  await prisma.reservation.create({
    data: {
      commonAreaId: salon.id,
      unitId: occupiedUnits[5].id,
      userId: residentUsers[5].id,
      startTime: pendingSlot.start,
      endTime: pendingSlot.end,
      status: "PENDING",
      notes: "Cumpleaños familiar, se espera aprobación de administración.",
    },
  });

  console.log("Creando tickets de mantenimiento...");
  const ticketSeed = [
    {
      title: "Fuga de agua en el pasillo",
      description: "Hay una fuga visible cerca del ascensor del piso 2.",
      category: "Plomería",
      priority: "HIGH" as const,
      status: "IN_PROGRESS" as const,
      unit: occupiedUnits[1],
      user: residentUsers[1],
      comment: "Se contactó al plomero, visita programada para mañana.",
    },
    {
      title: "Luz de emergencia no funciona",
      description: "La luz de emergencia del pasillo del piso 3 no se enciende.",
      category: "Electricidad",
      priority: "MEDIUM" as const,
      status: "OPEN" as const,
      unit: occupiedUnits[6],
      user: residentUsers[6],
    },
    {
      title: "Ascensor con ruido extraño",
      description: "El ascensor principal hace un ruido metálico al subir.",
      category: "Ascensores",
      priority: "URGENT" as const,
      status: "IN_PROGRESS" as const,
      unit: null,
      user: admin,
      comment: "Técnico especializado visitará el edificio esta semana.",
    },
    {
      title: "Jardín necesita mantenimiento",
      description: "Las plantas de la entrada principal necesitan riego y poda.",
      category: "Jardinería",
      priority: "LOW" as const,
      status: "RESOLVED" as const,
      unit: null,
      user: admin,
    },
    {
      title: "Puerta del quincho no cierra bien",
      description: "La puerta de acceso al quincho se traba al cerrar.",
      category: "Áreas comunes",
      priority: "MEDIUM" as const,
      status: "CLOSED" as const,
      unit: occupiedUnits[4],
      user: residentUsers[4],
    },
    {
      title: "Cámara de seguridad desconectada",
      description: "La cámara del estacionamiento parece estar apagada.",
      category: "Seguridad",
      priority: "HIGH" as const,
      status: "OPEN" as const,
      unit: null,
      user: admin,
    },
  ];

  for (const t of ticketSeed) {
    const ticket = await prisma.maintenanceTicket.create({
      data: {
        unitId: t.unit?.id,
        createdById: t.user.id,
        title: t.title,
        description: t.description,
        category: t.category,
        priority: t.priority,
        status: t.status,
      },
    });

    if (t.comment) {
      await prisma.ticketComment.create({
        data: {
          ticketId: ticket.id,
          authorId: admin.id,
          body: t.comment,
        },
      });
    }
  }

  console.log("Creando avisos...");
  await prisma.announcement.create({
    data: {
      title: "Mantenimiento de la piscina",
      body: "La piscina estará cerrada por mantenimiento el próximo fin de semana.",
      authorId: admin.id,
      isPinned: true,
    },
  });
  await prisma.announcement.create({
    data: {
      title: "Asamblea general de propietarios",
      body: "Se convoca a todos los propietarios a la asamblea anual el próximo mes en el salón de eventos.",
      authorId: admin.id,
      expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
    },
  });
  await prisma.announcement.create({
    data: {
      title: "Nuevo horario de recolección de basura",
      body: "A partir de la próxima semana, la recolección de basura será los martes, jueves y sábados.",
      authorId: admin.id,
    },
  });
  await prisma.announcement.create({
    data: {
      title: "Recordatorio: pago de cuotas",
      body: "Recuerda que el pago de la cuota de mantenimiento vence el día 5 de cada mes.",
      authorId: admin.id,
    },
  });

  console.log("Creando registro de visitas...");
  function hoursAgo(h: number) {
    return new Date(now.getTime() - h * 60 * 60 * 1000);
  }

  await prisma.visitor.create({
    data: {
      fullName: "Jorge Salinas",
      documentId: "12345678",
      reason: "Visita familiar",
      unitId: occupiedUnits[0].id,
      hostName: residentUsers[0].name,
      registeredById: guard.id,
      checkInAt: hoursAgo(30),
      checkOutAt: hoursAgo(27),
    },
  });
  await prisma.visitor.create({
    data: {
      fullName: "Empresa de Delivery Rápido",
      reason: "Entrega de paquete",
      unitId: occupiedUnits[2].id,
      hostName: residentUsers[2].name,
      registeredById: guard.id,
      checkInAt: hoursAgo(20),
      checkOutAt: hoursAgo(19),
    },
  });
  await prisma.visitor.create({
    data: {
      fullName: "Técnico de internet",
      documentId: "87654321",
      reason: "Instalación de servicio",
      unitId: occupiedUnits[3].id,
      hostName: residentUsers[3].name,
      registeredById: guard.id,
      checkInAt: hoursAgo(5),
      checkOutAt: hoursAgo(4),
    },
  });
  await prisma.visitor.create({
    data: {
      fullName: "Lucía Fernández",
      documentId: "45612378",
      reason: "Visita",
      unitId: occupiedUnits[5].id,
      hostName: residentUsers[5].name,
      vehiclePlate: "ZZZ-999",
      registeredById: guard.id,
      checkInAt: hoursAgo(1),
    },
  });
  await prisma.visitor.create({
    data: {
      fullName: "Mensajería Express",
      reason: "Entrega de documentos",
      unitId: occupiedUnits[7].id,
      hostName: residentUsers[7].name,
      registeredById: guard.id,
      checkInAt: hoursAgo(0.5),
    },
  });

  console.log("\nListo! Credenciales de prueba:");
  console.log("  Admin:     admin@condominio.com / Admin123!");
  console.log("  Guardia:   guardia1@condominio.com / Guardia123!");
  console.log("  Residente: residente1@condominio.com / Residente123!  (hasta residente9)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
