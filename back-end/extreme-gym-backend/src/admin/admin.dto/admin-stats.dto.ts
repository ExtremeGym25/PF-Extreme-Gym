import { ApiProperty } from '@nestjs/swagger';

export class MonthlyData {
  @ApiProperty({ description: 'Nombre del mes (en español)' })
  month: string;

  @ApiProperty({ description: 'Cantidad de registros para este mes' })
  count: number;
}

export class MonthlyUsersRegistered extends MonthlyData {
  @ApiProperty({ description: 'Cantidad de usuarios registrados en este mes' })
  registered: number;
}

export class MonthlyReservations extends MonthlyData {
  @ApiProperty({ description: 'Cantidad de reservas realizadas en este mes' })
  reservations: number;
}

export class MonthlyPublications extends MonthlyData {
  // 'count' ya está en MonthlyData
}

export class AdminStatsResponseDto {
  @ApiProperty({
    description: 'Total de usuarios registrados en la aplicación',
  })
  totalUsuarios: number;

  @ApiProperty({
    description: 'Cantidad de usuarios registrados por mes',
    type: [MonthlyUsersRegistered],
  })
  usuariosRegistradosMensual: MonthlyUsersRegistered[];

  @ApiProperty({ description: 'Cantidad de usuarios con suscripción gratuita' })
  usuariosFree: number;

  @ApiProperty({ description: 'Cantidad de usuarios con suscripción premium' })
  usuariosPremium: number;

  @ApiProperty({
    description: 'Cantidad de reservas realizadas por mes',
    type: [MonthlyReservations],
  })
  reservasMensuales: MonthlyReservations[];

  @ApiProperty({
    description:
      'Ingresos mensuales estimados generados por suscripciones premium',
  })
  ingresosMensualesPremiumEstimado: number;

  @ApiProperty({
    description: 'Cantidad de publicaciones realizadas por mes',
    type: [MonthlyPublications],
  })
  publicacionesMensuales: MonthlyPublications[];
}
