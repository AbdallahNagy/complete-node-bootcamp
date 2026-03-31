import express from 'express';
import * as userController from '../controllers/userController';
import * as authController from '../controllers/authController';

const router = express.Router();

router.post('/signup', authController.signup);


router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getUserById)
    .patch(userController.updateUserById)
    .delete(userController.deleteUserById);

export default router;
