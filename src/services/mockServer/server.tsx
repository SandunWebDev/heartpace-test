import { Model, Registry, Server, Factory, Response } from 'miragejs';
import { ModelDefinition } from 'miragejs/-types';
import Schema from 'miragejs/orm/schema';
import { faker } from '@faker-js/faker';

import { countryList } from '../../utils/countryList';
import { preCreatedFakerUserList } from './userList';

export { Server };

export type Gender = 'male' | 'female' | 'other';
export interface User {
	id: string;
	firstName: string;
	lastName: string;
	gender: Gender;
	birthDate: Date;
	jobTitle?: string;
	phone?: string | null;
	email: string;
	address?: string;
	city: string;
	country: string;
}

export interface UserWithExtraData extends User {
	age: number;
}

export interface MultiUserApiResponse {
	users: User[];
}

export interface SingleUserApiResponse {
	user: User;
}

const UserModel: ModelDefinition<User> = Model.extend({});
export type AppRegistry = Registry<
	{
		user: typeof UserModel;
	},
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	{}
>;
type AppSchema = Schema<AppRegistry>;

const allCountryNames = countryList.map((country) => country.name);

export default function createMockServer(environment?: string) {
	return new Server({
		environment: environment ?? 'development',

		models: {
			user: UserModel,
		},

		factories: {
			user: Factory.extend<Partial<User>>({
				id(i) {
					faker.seed(i);
					return faker.string.uuid();
				},
				gender(i) {
					faker.seed(i);

					return faker.helpers.arrayElement([
						faker.person.sex() as Gender,
						faker.person.sex() as Gender,
						'other',
					]);
				},
				firstName(i) {
					faker.seed(i);
					return faker.person.firstName(faker.person.sexType());
				},
				lastName(i) {
					faker.seed(i);
					return faker.person.lastName(faker.person.sexType());
				},
				birthDate(i) {
					faker.seed(i);
					return faker.date.birthdate();
				},
				jobTitle(i) {
					faker.seed(i);

					// NOTE : Using "maybe" to return some entry without job titles. (As undefined)
					return faker.helpers.maybe(() => faker.person.jobTitle(), {
						probability: 0.9,
					});
				},
				phone(i) {
					faker.seed(i);

					// NOTE : Using "arrayElement" to return some entry without phone number. (As null)
					return faker.helpers.arrayElement([
						faker.phone.number({ style: 'national' }),
						faker.phone.number({ style: 'national' }),
						faker.phone.number({ style: 'national' }),
						null,
					]);
				},
				email(i) {
					faker.seed(i);
					return faker.internet.email({
						firstName: this.firstName as string,
						lastName: this.lastName as string,
					});
				},
				address(i) {
					// NOTE : As of now city is not realted to selected "city & country"
					faker.seed(i);
					return faker.location.streetAddress();
				},
				city(i) {
					// NOTE : As of now city is not realted to selected "country"
					faker.seed(i);
					return faker.location.city();
				},
				country(i) {
					faker.seed(i);
					return faker.helpers.arrayElement(allCountryNames);
				},
			}),
		},

		seeds(server) {
			// Below is to create "x" number of faker user entries according to above factory.
			// But creating large list of items take some time. So if we use this approach, app start up take some time and app look slow.
			// for (let i = 0; i < 5000; i++) {
			// 	server.create('user');
			// }

			// So we have stored pre created faker data in a file and directly loading it to seed in here.
			server.db.loadData({
				users: preCreatedFakerUserList,
			});
		},

		routes() {
			this.timing = 500; // Simulate loading times

			this.get('/api/users', (schema: AppSchema) => {
				return schema.all('user');
			});

			this.get('/api/users/:id', (schema: AppSchema, request) => {
				return schema.find('user', request.params.id);
			});

			this.post('/api/users', (schema: AppSchema, request) => {
				const userData = JSON.parse(request.requestBody) as User;
				const header = {};

				if (!userData) {
					return new Response(404, header, {
						message: 'User data not provided.',
					});
				}

				return schema.create('user', {
					...userData,
				});
			});

			this.patch('/api/users/:id', (schema: AppSchema, request) => {
				const userId = request.params.id;
				const newUserData = JSON.parse(request.requestBody) as User;
				const existingUserData = schema.find('user', request.params.id)?.attrs;
				const headers = {};

				if (!newUserData) {
					return new Response(404, headers, {
						message: 'Update data not provided.',
					});
				}

				if (!userId || !existingUserData) {
					return new Response(404, headers, {
						message: 'User not found.',
					});
				}

				return (
					schema
						.find('user', userId)
						?.update({ ...existingUserData, ...newUserData }) ??
					new Response(200, headers, { ...existingUserData, ...newUserData })
				);
			});

			this.delete('/api/users/:id', (schema: AppSchema, request) => {
				const headers = {};
				const userId = request.params.id;
				const user = schema.find('user', request.params.id);

				if (!userId || !user) {
					return new Response(404, headers, {
						message: 'User not found.',
					});
				}

				return (
					schema.find('user', userId)?.destroy() ??
					new Response(200, headers, { user })
				);
			});
		},
	});
}
