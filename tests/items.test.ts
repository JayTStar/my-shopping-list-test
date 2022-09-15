import supertest from 'supertest';
import app from '../src/app';
import { prisma } from '../src/database';
import itemFactory from "./factories/itemFactory";
import {faker} from "@faker-js/faker";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "items"`;
});

describe('Testa POST /items ', () => {
  it('Deve retornar 201, se cadastrado um item no formato correto', async () => {
    const item = await itemFactory()

    const result = await supertest(app).post(`/items`).send(item);

    const creatredItem = await prisma.items.findUnique({
      where: { title: item.title }
    });

    expect(result.status).toBe(201);
    expect(creatredItem).not.toBeNull();
  });
  it('Deve retornar 409, ao tentar cadastrar um item que exista', async () => {
    const item = await itemFactory()

    const firstPost = await supertest(app).post(`/items`).send(item);
    const secondPost = await supertest(app).post(`/items`).send(item);

    expect(secondPost.status).toBe(409);
  });
});

describe('Testa GET /items ', () => {
  it('Deve retornar status 200 e o body no formato de Array', async () => {
    const getItens = await supertest(app).get(`/items`);

    expect(getItens.status).toBe(200);
    expect(getItens.body).toBeInstanceOf(Array);
  });
});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual a o item cadastrado', async () => {
    const item = await itemFactory()

    const result = await supertest(app).post(`/items`).send(item);

    const creatredItem = await prisma.items.findUnique({
      where: { title: item.title }
    });

    const getItem = await supertest(app).get(`/items/${creatredItem.id}`);

    expect(result.status).toBe(201);
    expect(getItem.status).toBe(200);
    expect(getItem.body).toStrictEqual(creatredItem);
  });
  it('Deve retornar status 404 caso não exista um item com esse id', async () => {

    const getItem = await supertest(app).get(`/items/${parseInt(faker.random.numeric(1))}`);

    expect(getItem.status).toBe(404);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});