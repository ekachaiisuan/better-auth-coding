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

interface VerificationEmailProps {
    verificationURL: string;
    userName: string;
    appName?: string;
}

export const VerificationEmail = ({
    verificationURL, userName, appName = "betterauth-next"
}: VerificationEmailProps) => (
    <Html>
        <Head />
        <Tailwind>
            <Body className="bg-white font-koala">
                <Preview>
                    Verify your email for {appName}
                </Preview>
                <Container className="mx-auto py-5 pb-12">

                    <Text className="text-[16px] leading-[26px]">
                        Hi {userName},
                    </Text>
                    <Text className="text-[16px] leading-[26px]">
                        Welcome to {appName},
                        Thank you for signing up. for {appName}.
                        Please verify your email address to get started.
                    </Text>
                    <Section className="text-center">
                        <Button
                            className="bg-[#5F51E8] rounded-[3px] text-white text-[16px] no-underline text-center block p-3"
                            href={verificationURL}
                        >
                            Verify your email
                        </Button>
                    </Section>
                    <Text className="text-[16px] leading-[26px]">
                        Best,
                        <br />
                        The {appName} team
                    </Text>
                    <Hr className="border-[#cccccc] my-5" />
                    <Text className="text-[#8898aa] text-[12px]">
                        If you did not request this email, please ignore it.
                    </Text>
                </Container>
            </Body>
        </Tailwind>
    </Html>
);

export default VerificationEmail;
