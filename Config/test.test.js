import app from '../Api/app';
import request from 'supertest';


it('Debería manejar la ruta /api/categorias', async () => {
    const response = await request(app).post('/api/categorias');
    expect(response.status).toBe(200);
    // Ajusta la expectativa para verificar la existencia del array y su longitud
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });
  