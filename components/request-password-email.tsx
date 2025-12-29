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
    Heading,
} from '@react-email/components';


interface RequestPasswordEmailProps {
    url: string
    to: string
}

export const RequestPasswordEmail = ({
    url,
    to
}: RequestPasswordEmailProps) => (
    <Html>
        <Head />
        <Tailwind>
            <Body className="bg-white font-koala">
                <Preview>
                    Reset your password for {to}
                </Preview>
                <Container className="mx-auto py-5 pb-12">
                    <Heading as="h1" className="mb-3 text-center text-[20px] font-semibold text-black">Hello {to}</Heading>


                    <Text className="text-[16px] leading-[26px]">
                        We recieved a request to reset your password. for {to}
                    </Text>
                    <Section className="text-center">
                        <Button
                            className="bg-[#5F51E8] rounded-[3px] text-white text-[16px] no-underline text-center block p-3"
                            href={url}
                        >
                            Reset your password
                        </Button>
                    </Section>
                    <Text className="text-[16px] leading-[26px]">
                        Best,
                        <br />
                        The {to} team
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

export default RequestPasswordEmail;
