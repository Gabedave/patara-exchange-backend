import usersModel from "../../models/UserModel/users";
import { ICreateUserArg, UserCreator } from "./UserCreator";
import { ILoginUserArg, UserLogin } from "./UserLogin";

export const findUserById = async (user_id: string) => {
  return usersModel.findOne({ _id: user_id, deleted: { $ne: true } });
};

export const findUserByEmail = async (email: string) => {
  return usersModel.findOne({ email: email, deleted: { $ne: true } });
};

export const doesEmailBelongToAUser = async (email: string) => {
  return !!(await usersModel.findOne({
    email: email,
    deleted: { $ne: true },
  }));
};

export const createUser = async (
  userDetails: ICreateUserArg,
  onUserCreated: ({ authData, userDetails }) => void
) => {
  return new UserCreator(userDetails, onUserCreated).call();
};

export const loginUser = async (
  userDetails: ILoginUserArg,
  onVerifyUser: ({ authData, userDetails }) => void
) => {
  return new UserLogin(userDetails, onVerifyUser).call();
};
