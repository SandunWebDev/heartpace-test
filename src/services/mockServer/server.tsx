import { Model, Registry, Server, Factory, Response } from 'miragejs';
import { ModelDefinition } from 'miragejs/-types';
import Schema from 'miragejs/orm/schema';
import { faker } from '@faker-js/faker';

export interface User {
	id: string;
	firstName: string;
	lastName: string;
	gender: string;
	birthDate: Date;
	jobTitle: string;
	phone: string;
	email: string;
	address: string;
	city: string;
	country: string;
}

// This error thrown just beacuse we are using non react items in React app.
// eslint-disable-next-line react-refresh/only-export-components
const UserModel: ModelDefinition<User> = Model.extend({});
type AppRegistry = Registry<
	{
		user: typeof UserModel;
	},
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	{}
>;
type AppSchema = Schema<AppRegistry>;

export default function createMockServer() {
	return new Server({
		models: {
			user: UserModel,
		},

		factories: {
			user: Factory.extend<Partial<User>>({
				firstName(i) {
					faker.seed(i);
					return faker.person.firstName();
				},
				lastName(i) {
					faker.seed(i);
					return faker.person.lastName();
				},
				gender(i) {
					faker.seed(i);
					return faker.person.gender();
				},
				birthDate(i) {
					faker.seed(i);
					return faker.date.birthdate();
				},
				jobTitle(i) {
					faker.seed(i);
					return faker.person.jobTitle();
				},
				phone(i) {
					faker.seed(i);
					return faker.phone.number();
				},
				email(i) {
					faker.seed(i);
					return faker.internet.email();
				},
				address(i) {
					faker.seed(i);
					return faker.location.streetAddress();
				},
				city(i) {
					faker.seed(i);
					return faker.location.city();
				},
				country(i) {
					faker.seed(i);
					return faker.location.country();
				},
			}),
		},

		seeds(server) {
			for (let i = 0; i < 5; i++) {
				server.create('user');
			}

			// Below can be used if we want to load data from external data source.
			// server.db.loadData({
			// 	users: usersList,
			// });
		},

		routes() {
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
