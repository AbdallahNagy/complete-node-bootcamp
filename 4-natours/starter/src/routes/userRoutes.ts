import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getUserById)
    .patch(userController.updateUserById)
    .delete(userController.deleteUserById);

export default router;
