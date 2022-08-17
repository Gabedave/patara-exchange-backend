import userModel from "../../models/UserModel/users";
import * as bcrypt from "bcryptjs";
import * as _ from "lodash";
import AuthService from "../authentication/AuthService";
import UserDoesNotExist from "./exceptions/UserDoesNotExist";
import UserInvalidPassword from "./exceptions/UserInvalidPassword";

export interface ILoginUserArg {
  email: string;
  unHashedPassword?: string;
}

export class UserLogin {
  constructor(
    private userDetails: ILoginUserArg,
    private onUserVerified: ({ authData, userDetails }) => void
  ) {}

  public async call(): Promise<void> {
    const userDetails = await this.getUserDetails();
    await this.verifyUserPassword(userDetails);

    const authData = await this.generateUserAuthData(userDetails._id);

    delete userDetails["password_hash"];
    this.onUserVerified({ authData, userDetails });
  }

  private async getUserDetails() {
    const findUser = await userModel.findOne({
      email: this.userDetails.email,
    });
    if (!findUser) {
      throw new UserDoesNotExist(
        "User with email does not exist. You should sign up instead"
      );
    }
    return findUser.toObject();
  }

  private async verifyUserPassword(userDetails): Promise<void> {
    const match = await bcrypt.compare(
      this.userDetails.unHashedPassword,
      userDetails.password_hash
    );

    if (!match) {
      throw new UserInvalidPassword(
        "Incorrect password. Please try again or reset your password"
      );
    }
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
