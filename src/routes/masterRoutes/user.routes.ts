import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserController } from "../../controllers/masterCcontrollers/user.controller";
import { createUserSchema, deleteUserSchema, getUserByIdSchema, updateUserSchema } from "../../validations/masterValidation/user.validation";

const userRouter=Router();
const userController=new UserController();

userRouter.post('/', validateRequest(createUserSchema), userController.createUser);

userRouter.post('/login',userController.loginUser);

userRouter.post('/logout',userController.logoutUser);

userRouter.post('/refreshAccessToken',userController.refreshToken);

userRouter.put('/:id', validateRequest(updateUserSchema), userController.updateUser);

userRouter.get('/', userController.getUsers);

userRouter.delete('softDelete/:id',validateRequest(deleteUserSchema), userController.softDeleteUser);

userRouter.delete('/:id',validateRequest(deleteUserSchema), userController.deleteUser);

userRouter.get('/:id', validateRequest(getUserByIdSchema), userController.getUserById);



export default userRouter;