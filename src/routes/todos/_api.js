/*
	This module is used by the /todos.json and /todos/[uid].json
	endpoints to make calls to api.svelte.dev, which stores todos
	for each user. The leading underscore indicates that this is
	a private module, _not_ an endpoint — visiting /todos/_api
	will net you a 404 response.

	(The data on the todo app will expire periodically; no
	guarantees are made. Don't use it to organise your life.)
*/

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function api(event, resource, data) {
	// user must have a cookie set
	if (!event.locals.userid) {
		return { status: 401 };
	}

	switch(event.request.method) {
		case 'GET': {
      let user = await prisma.user.findUnique({
        include: {
          todos: true
        },
        where: {
          uid: `${event.locals.userid}`
        }
      });

      if (!user) {
        // user hasn't created a todo list.
        // create user entry in the User table
        user = await prisma.user.create({
          data: {
            uid: `${event.locals.userid}`
          }
        });
      }

			console.log('User: ', user);

      return {
				status: 200,
				body: user.todos,
				headers: {
					location: '/todos'
				}
			}
    }

		case 'POST': {
			console.log('POST DATA: ', data);
			console.log('USER ID: ', event.locals.userid);
			const user = await prisma.user.findUnique({
				where: {
					uid: `${event.locals.userid}`
				}
			});
			console.log('USER: ', user);
			await prisma.todo.create({
        data: {
          text: data.text,
          userId: `${event.locals.userid}`
        }
      });

			return {
				status: 303,
				headers: {
					location: '/todos'
				}
			};
		}

		case 'PATCH': {
			console.log('PATCH DATA: ', data);
			if (!data.text) {
				delete data.text;
			}
			await prisma.todo.update({
				data,
				where: {
					uid: parseInt(event.params.uid)
				}
			});
		
			return {
				status: 303,
				headers: {
					location: '/todos'
				}
			};
		}

		case 'DELETE': {
			const response = await prisma.todo.delete({
				where: {
					uid: parseInt(event.params.uid)
				}
			});
		
			return {
				status: 200,
				body: response
			}
		}

		default:
      return {
				status: 404
			}
	}
}
