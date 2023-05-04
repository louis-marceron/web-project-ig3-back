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

})
