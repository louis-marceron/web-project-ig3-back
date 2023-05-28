import bcrypt from 'bcrypt'
import request from 'supertest'
import { expect } from "chai"
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken'
import setCookie from 'set-cookie-parser'
import app from '../src/app'
import loadEnvironmentVariables from '../src/config/loadEnvironmentVariables'
import db from '../utils/testDB.util'
import AppUser from '../src/models/AppUser.model'
import cookieParser from 'cookie-parser'

const u1 = { email: 'user1@mail.com', password: 'password1' }
const u2 = { email: 'user2@mail.com', password: 'password2' }
let adminToken: string;

describe('/users', () => {
    before(async () => {
        try {
            loadEnvironmentVariables()
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
            const admin = await new AppUser({ email: 'admin@mail.com', password: 'adminpassword' }).save()
            await admin.update({ is_admin: true })
            adminToken = jwt.sign({ id: admin.user_id }, process.env.SECRET!, { expiresIn: '1d' })
        } catch (err) {
            console.error('Unable to sync to the database:', err)
            throw err
        }
    })

    describe('GET', () => {
        it('get all users', async () => {
            await new AppUser(u1).save()
            await new AppUser(u2).save()
            const response = await request(app)
                .get('/users')
                .set('Cookie', [`token=${adminToken}`])
                .expect(200)
            expect(response.body.length).equal(3)
        })

        it('returns 404 if the user doesn\'t exist', async () => {
            await request(app)
                .get('/users/13')
                .set('Cookie', [`token=${adminToken}`])
                .expect(404)
        })

        it('get one user', async () => {
            const user = await new AppUser(u1).save()
            const response = await request(app)
                .get(`/users/${user.user_id}`)
                .set('Cookie', [`token=${adminToken}`])
                .expect(200)
            const { password, ...strippedU1 } = user.dataValues;
            expect(response.body).deep.equal(strippedU1)
        })
    })

    describe('POST', () => {
        it('creates a new user', async () => {
            const response = await request(app)
                .post('/users')
                .set('Cookie', [`token=${adminToken}`])
                .send(u1)
                .expect(201)
            const user = await AppUser.findOne({ where: { email: u1.email } })
            expect(user?.dataValues).not.undefined
            const { password, ...userWithoutPassword } = user?.dataValues
            expect(response.body).deep.equal(userWithoutPassword)
            expect(await bcrypt.compare(u1.password, password)).to.be.true
        })

        it('prevents creating a user with an invalid email', async () => {
            const response = await request(app)
                .post('/users')
                .set('Cookie', [`token=${adminToken}`])
                .send({ ...u1, email: 'invalid_email' })
                .expect(400)
            expect(response.body.error).equal('Validation error')
        })

        it('prevents creating a user with an email used by another user', async () => {
            await new AppUser(u1).save()
            const response = await request(app)
                .post('/users')
                .set('Cookie', [`token=${adminToken}`])
                .send(u1)
                .expect(400)
            expect(response.body.error).equal('An account with this email already exists')
        })

        it('prevents creating an invalid password', async () => {
            const response = await request(app)
                .post('/users')
                .set('Cookie', [`token=${adminToken}`])
                .send({ email: 'user@email.com', password: '123456' })
                .expect(400)
            expect(response.body.error).equal('Validation error')
        })
    })

    describe('PATCH', () => {
        it('updates an existing user', async () => {
            const user = await new AppUser(u1).save()
            const updatedFields = { email: 'newemail@email.com', password: 'newpassword', is_admin: true }
            await request(app)
                .patch(`/users/${user.user_id}`)
                .set('Cookie', [`token=${adminToken}`])
                .send(updatedFields)
                .expect(204)
            const updatedUser = await AppUser.findByPk(user.user_id)
            expect(updatedUser?.email).equal(updatedFields.email)
            expect(updatedUser?.is_admin).equal(updatedFields.is_admin)
            expect(await bcrypt.compare(updatedFields.password, updatedUser!.password)).to.be.true
        })

        it('returns 404 if the user doesn\'t exist', async () => {
            await request(app)
                .patch('/users/13')
                .set('Cookie', [`token=${adminToken}`])
                .send({ email: 'newemail@email.com ' })
                .expect(404)
        })

        it('prevents updating a user with an invalid email', async () => {
            const user = await new AppUser(u1).save()
            const response = await request(app)
                .patch(`/users/${user.user_id}`)
                .set('Cookie', [`token=${adminToken}`])
                .send({ email: 'invalid_email' })
                .expect(400)
            expect(response.body.error).equal('Validation error')
        })

        it('prevents updating with an email used by another user', async () => {
            const user = await new AppUser(u1).save()
            await new AppUser(u2).save()
            const response = await request(app)
                .patch(`/users/${user.user_id}`)
                .set('Cookie', [`token=${adminToken}`])
                .send({ email: u2.email })
                .expect(400)
            expect(response.body.error).equal('An account with this email already exists')
        })

        it('prevents updating a password with less than 8 characters', async () => {
            const user = await new AppUser(u1).save()
            const response = await request(app)
                .patch(`/users/${user.user_id}`)
                .set('Cookie', [`token=${adminToken}`])
                .send({ password: '123456' })
                .expect(400)
            expect(response.body.error).equal('Validation error')
        })
    })

    describe('DELETE', () => {
        it('returns 404 if the user doesn\'t exist', async () => {
            await request(app)
                .delete('/users/13')
                .set('Cookie', [`token=${adminToken}`])
                .expect(404)
        })

        it('deletes a user', async () => {
            const user = await new AppUser(u1).save()
            await request(app)
                .delete(`/users/${user.user_id}`)
                .set('Cookie', [`token=${adminToken}`])
                .expect(204)
            expect(await AppUser.findByPk(user.user_id)).to.be.null
        })
    })

    describe('/signup', () => {
        it('creates a new user', async () => {
            await request(app)
                .post('/users/signup')
                .send(u1)
                .expect(201)

            const createdUser = await AppUser.findOne({ where: { email: u1.email } })
            expect(createdUser?.dataValues).not.be.undefined
        })

        it('returns a cookie with the JWT with the id of user', async () => {
            const response = await request(app)
                .post('/users/signup')
                .set('Cookie', [`token=${adminToken}`])
                .send(u1)
                .expect(201)

            const createdUser = await AppUser.findOne({ where: { email: u1.email } })
            const token: string = (response.header['set-cookie'][0] as string).substring(6, 193)
            const userIdFromToken: string = (jwt.decode(token) as JwtPayload).id
            expect(userIdFromToken).to.equal(createdUser!.user_id)
        })
    })

    describe('/login', () => {
        it('returns 401 if the credentials are invalid', async () => {
            await request(app)
                .post('/users/login')
                .send(u1)
                .expect(401)
        })

        it('returns a cookie with the JWT with the id of user', async () => {
            const user = await new AppUser(u1).save()
            const response = await request(app)
                .post('/users/login')
                .send(u1)
                .expect(200)

            const token: string = (response.header['set-cookie'][0] as string).substring(6, 193)
            const userIdFromToken: string = (jwt.decode(token) as JwtPayload).id
            expect(userIdFromToken).to.equal(user.user_id)
        })
    })

    describe('/logout', () => {
        it('clears the cookie', async () => {
            const user = await new AppUser(u1).save()
            const userToken = jwt.sign({ id: user.user_id }, process.env.SECRET!, { expiresIn: '1d' })

            const response = await request(app)
                .post('/users/logout')
                .set('Cookie', [`token=${userToken}`])
                .expect(200)


            const parsedCookie = setCookie(response.headers['set-cookie'])
            const token = parsedCookie.filter((cookie: any) => cookie.name === 'token')[0]
            expect(() => jwt.verify(token.value, process.env.SECRET!)).to.throw(TokenExpiredError);
        })
    })


    describe('Authorization', () => {
        it('prevents users without JWT cookie to do CRUD operations on /users', async () => {
            await request(app).get('/users').expect(401)
            await request(app).get('/users/42').expect(401)
            await request(app).post('/users').send(u1).expect(401)
            await request(app).patch('/users/42').send(u1).expect(401)
            await request(app).delete('/users/42').expect(401)
        })

        it('prevents non-admin to do CRUD operations on /users', async () => {
            const user = await new AppUser(u1).save()
            const token: string = jwt.sign({ id: user.user_id }, process.env.SECRET!, { expiresIn: '1d' })
            await request(app).get('/users').set('Cookie', [`token=${token}`]).expect(403)
            await request(app).get('/users/42').set('Cookie', [`token=${token}`]).expect(403)
            await request(app).post('/users').set('Cookie', [`token=${token}`]).expect(403)
            await request(app).patch('/users/42').set('Cookie', [`token=${token}`]).expect(403)
            await request(app).delete('/users/42').set('Cookie', [`token=${token}`]).expect(403)
        })

        it('allows admin to do CRUD operations on /users', async () => {
            const user = await new AppUser(u1).save()
            await user.update({})
            const token: string = jwt.sign({ id: user.user_id }, process.env.SECRET!, { expiresIn: '1d' })
            await request(app).get('/users').set('Cookie', [`token=${token}`]).expect(403)
            await request(app).get('/users/42').set('Cookie', [`token=${token}`]).expect(403)
            await request(app).post('/users').set('Cookie', [`token=${token}`]).expect(403)
            await request(app).patch('/users/42').set('Cookie', [`token=${token}`]).expect(403)
            await request(app).delete('/users/42').set('Cookie', [`token=${token}`]).expect(403)
        })
    })
})
