import request from 'supertest'
import { expect } from "chai"
import app from '../src/app'
import db from '../utils/testDB.util'
import AppUser from '../src/models/AppUser.model'
const bcrypt = require('bcrypt')

const u1 = { email: 'user1@mail.com', password: 'password1' }
const u2 = { email: 'user2@mail.com', password: 'password2' }

describe('/users', () => {
    before(async () => {
        try {
            await db.authenticate()
        } catch (err) {
            console.error('Unable to connect to the database:', err)
            throw err
        }
    })

    after(async () => {
        try {
            await db.close()
        } catch (err) {
            console.error('Unable to close the database:', err)
            throw err
        }
    })

    beforeEach(async () => {
        try {
            await db.sync({ force: true })
        } catch (err) {
            console.error('Unable to sync to the database:', err)
            throw err
        }
    })

    describe('GET', () => {
        it('returns 404 if there are no users', async () => {
            await request(app)
                .get('/users')
                .expect(404)
        })

        it('get all users', async () => {
            await new AppUser(u1).save()
            await new AppUser(u2).save()
            const response = await request(app)
                .get('/users')
                .expect(200)
            expect(response.body.length).equal(2)
        })

        it('get one user', async () => {
            const user = await new AppUser(u1).save()
            const response = await request(app)
                .get(`/users/${user.user_id}`)
                .expect(200)
            const { password, ...strippedU1 } = user.dataValues;
            expect(response.body).deep.equal(strippedU1)
        })
    })

    describe('POST', () => {
        it('creates a new user', async () => {
            const response = await request(app)
                .post('/users')
                .send(u1)
                .expect(201)
            const user = await AppUser.findOne({ where: { email: u1.email } })
            expect(user?.dataValues).not.equal(null)
            const { password, ...userWithoutPassword } = user?.dataValues
            expect(response.body).deep.equal(userWithoutPassword)
        })

        it('prevents creating a user with an invalid email', async () => {
            const response = await request(app)
                .post('/users')
                .send({ ...u1, email: 'invalid_email' })
                .expect(400)
            expect(response.body.error).equal('Validation error')
        })

        it('prevents creating a user with an email used by another user', async () => {
            await new AppUser(u1).save()
            const response = await request(app)
                .post('/users')
                .send(u1)
                .expect(400)
            expect(response.body.error).equal('An account with this email already exists')
        })

        it('prevents creating a password with less than 8 characters', async () => {
            const response = await request(app)
                .post('/users')
                .send({ email: 'user@email.com', password: '123456' })
                .expect(400)
            expect(response.body.error).equal('Validation error')
        })
    })

    // describe('PATCH', () => {
    //     it('updates an existing user', async () => {
    //         const user = await new AppUser(u1).save()
    //         const updatedUser = { email: 'newemail@email.com', password: 'newpassword' }
    //         const response = await request(app)
    //             .patch(`/users/${user.user_id}`)
    //             .send(updatedUser)
    //             .expect(204)
    //         expect(response.body.email).equal(updatedUser.email)
    //         expect(response.body.password).equal(await hashPassword(u1.password))
    //     })

    //     it('prevents updating a user that doesn\'t exist', async () => {
    //         const response = await request(app)
    //             .patch('/users/13')
    //             .send({ email: 'newemail@email.com ' })
    //             .expect(404)
    //     })

    //     it('prevents updating a user with an invalid email', async () => {
    //         const user = await new AppUser(u1).save()
    //         const response = await request(app)
    //             .patch(`/users/${user.id}`)
    //             .send({ email: 'invalid_email' })
    //             .expect(400)
    //         expect(response.body.error).equal('Validation error')
    //     })

    //     it('prevents updating with an email used by another user', async () => {
    //         const user = await new AppUser(u1).save()
    //         const response = await request(app)
    //             .patch(`/users/${user.id}`)
    //             .send(u1)
    //             .expect(400)
    //         expect(response.body.error).equal('An account with this email already exists')
    //     })

    //     it('prevents updating a password with less than 8 characters', async () => {
    //         const user = await new AppUser(u1).save()
    //         const response = await request(app)
    //             .patch(`/users/${user.id}`)
    //             .send({ password: '123456' })
    //             .expect(400)
    //         expect(response.body.error).equal('Validation error')
    //     })
    // })
})

async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}