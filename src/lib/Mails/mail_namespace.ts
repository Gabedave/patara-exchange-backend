import { SendgridNamespace } from "../Sendgrid/sendgrid_namespace";

const sendPasswordResetMail = (email: string, resetUrl: string) => {
  const subject = "Password Reset Link";
  const message = `
            <p>You are receiving this email because you (or someone else) has requested the reset of a password. Please click the <a href=${resetUrl} target="_blank">link</a> to reset your password</p>
        `;
  const opts = {
    to: email,
    from: "noreply@.com", // TODO: set from email
    subject,
    text: "Password reset email link",
    html: message,
  };
  console.log("[SendgridNamespace.sendPasswordResetMail] ", { email, opts });

  return SendgridNamespace.sendMail(opts);
};

export const MailsNamespace = {
  sendPasswordResetMail,
};
