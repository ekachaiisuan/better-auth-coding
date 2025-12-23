import { Resend } from "resend";
import VerificationEmail from "@/components/verification-email";


const resend = new Resend(process.env.RESEND_API_KEY);

type EmailProps = {
    to: string;
    verificationURL: string;
    userName: string;
}



export const sendVerificationEmail = async ({
    to,
    verificationURL,
    userName,
}: EmailProps) => {

    await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to,
        subject: 'Welcome to betterauth-next',
        react: <VerificationEmail verificationURL={ verificationURL } userName = { userName } />,
    });

    
};