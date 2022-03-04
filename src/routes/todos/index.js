import pkg from '@prisma/client'
const { PrismaClient } = pkg

const prisma = new PrismaClient();

export const get = async ({ locals }) => {
	// locals.userid comes from src/hooks.js
	const response = await prisma.user.findUnique({
		include: {
			todos: true
		},
		where: {
			uid: `${locals.userid}`
		}
	});

	if (!response) {
		// user hasn't created a todo list.
		// create user entry in the User table
		await prisma.user.create({
			data: {
				uid: `${locals.userid}`
			}
		});
	
		// start with an empty array
		return {
			body: {
				todos: []
			}
		};
	}

	if (response) {
		return {
			body: {
				todos: await response.todos
			}
		};
	}

	return {
		status: 404
	}
};

export const post = async ({ request, locals }) => {
	const form = await request.formData();

	await prisma.todo.create({
		data: {
			text: form.get('text'),
			userId: `${locals.userid}`
		}
	});

	return {};
};

// If the user has JavaScript disabled, the URL will change to
// include the method override unless we redirect back to /todos
const redirect = {
	status: 303,
	headers: {
		location: '/todos'
	}
};

export const patch = async ({ request }) => {
	const form = await request.formData();

	await prisma.todo.update({
		data: {
			text: form.has('text') ? form.get('text') : undefined,
			done: form.has('done') ? !!form.get('done') : undefined
		},
		where: {
			uid: parseInt(form.get('uid'))
		}
	});

	return redirect;
};

export const del = async ({ request }) => {
	const form = await request.formData();

	await prisma.todo.delete({
		where: {
			uid: parseInt(form.get('uid'))
		}
	});

	return redirect;
};
