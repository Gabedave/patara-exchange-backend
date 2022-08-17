const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (opts: {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}) => {
  console.log("[SendgridNamespace.sendMail] ", { opts });
  sgMail.send(opts);
};

export const SendgridNamespace = {
  sendMail,
};
