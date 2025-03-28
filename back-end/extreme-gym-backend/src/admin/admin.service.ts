import { Injectable } from '@nestjs/common';

@Injectable()
export class adminService {
  getStats() {
    return {
      totalUsuarios: 80,
      ingresosMensuales: 50000,
      membresiasActivas: 60,
      graficos: [
        { mes: 'Noviembre', membresias: 20 },
        { mes: 'Febrero', membresias: 22 },
        { mes: 'Marzo', membresias: 60 },
      ],
    };
  }
}
