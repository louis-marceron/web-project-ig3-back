const createDatabaseInstance = require('../../testUtils').createDatabaseInstance;
const bcrypt = require('bcrypt');

let dbMock;
let AppUser;

describe('AppUser model', () => {
  beforeEach(async () => {
    dbMock = await createDatabaseInstance();
    AppUser = require('../../models')(dbMock).AppUser;
    try {
      await dbMock.authenticate();
      await dbMock.sync({ force: true });
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  });

  afterEach(async () => {
    await dbMock.close();
  });

  it('should create a new user with hashed password', async () => {
    const password = 'password123';

    const newUser = {
      email: 'test@example.com',
      nickname: 'test_user',
      password: password,
      is_admin: false,
    };

    const createdUser = await AppUser.create(newUser);

    const isPasswordValid = await bcrypt.compare(password, createdUser.password);
    expect(isPasswordValid).toBeTruthy();
  });

  it('should update user password with hashed password', async () => {
    const password = 'password123';

    const newUser = {
      email: 'test@example.com',
      nickname: 'test_user',
      password: password,
      is_admin: false,
    };

    const createdUser = await AppUser.create(newUser);

    console.log(`Previous password: ${createdUser.password}`)

    const newPassword = 'another_password';

    await createdUser.update({ password: newPassword });

    console.log(`New password: ${createdUser.password}`)

    const isPasswordValid = await bcrypt.compare(newPassword, createdUser.password);
    expect(isPasswordValid).toBeTruthy();
  });
});
