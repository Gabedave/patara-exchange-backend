import userModel from "../../models/UserModel/users";
import UserWithEmailAlreadyExist from "./exceptions/UserWithEmailAlreadyExist";
import * as bcrypt from "bcryptjs";
import { MailsNamespace } from "../Mails/mail_namespace";
import AuthService from "../authentication/AuthService";

export interface ICreateUserArg {
  email: string;
  firstname: string;
  lastname: string;
  unHashedPassword?: string;
  phoneNumber?: string;
  country?: string;
  picture?: string;
}

export class UserCreator {
  hashedPassword;
  constructor(
    private userDetails: ICreateUserArg,
    private onUserCreated: ({ authData, userDetails }) => void
  ) {}

  public async call(): Promise<void> {
    await this.checkIfUserWithEmailExist();
    await this.hashPasswordIfPresent();
    const userDetails = await this.createUser();
    const authData = await this.generateUserAuthData(userDetails._id);
    this.onUserCreated({ authData, userDetails });
  }

  private async checkIfUserWithEmailExist(): Promise<void> {
    const findUser = await userModel.findOne({
      email: this.userDetails.email,
    });
    if (findUser) {
      throw new UserWithEmailAlreadyExist(
        "A user with this email already exist. You should sign in instead"
      );
    }
  }

  private async hashPasswordIfPresent(): Promise<void> {
    if (this.userDetails.unHashedPassword) {
      this.hashedPassword = await bcrypt.hash(
        this.userDetails.unHashedPassword,
        2
      );
    }
  }

  private async createUser(): Promise<any> {
    const userDetailsObject = await userModel.create({
      firstname: this.userDetails.firstname,
      lastname: this.userDetails.lastname,
      email: this.userDetails.email,
      password_hash: this.hashedPassword || undefined,
      phone_number: this.userDetails.phoneNumber,
      country: this.userDetails.country,
      picture: this.userDetails.picture,
    });
    const userDetails = userDetailsObject.toObject();
    delete userDetails["password_hash"];
    return userDetails;
  }

  private async generateUserAuthData(userId: string) {
    const authData: any = await new Promise((resolve, reject) => {
      AuthService.generateTokenForVerification(resolve, reject, {
        userId,
        email: this.userDetails.email,
        role: "user",
      });
    });
    return authData;
  }
}
