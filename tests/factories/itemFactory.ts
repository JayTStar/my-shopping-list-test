import { faker } from '@faker-js/faker';

export default async function itemFactory() {
  return {
        title: faker.lorem.word(2),
        url: faker.internet.url(),
        description: faker.lorem.paragraph(1),
        amount: parseInt(faker.random.numeric(1))
  };
}