import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';

interface OtpEmailProps {
    otp: string;
}

export const OtpEmail = ({
    otp
}: OtpEmailProps) => (
    <Html>
        <Head />
        <Tailwind>
            <Body className="bg-white font-koala">
                <Preview>
                    Login code
                </Preview>
                <Container className="mx-auto py-5 pb-12">

                    <Text className="text-[16px] leading-[26px]">
                        Please find your code to login below
                    </Text>
                    <Text className="text-[16px] leading-5">
                        {otp}
                    </Text>
                    <Text className="text-[#8898aa] text-[12px]">
                        If you did not request this email, please ignore it.
                    </Text>
                </Container>
            </Body>
        </Tailwind>
    </Html>
);

export default OtpEmail;
