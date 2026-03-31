import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface SystemUpdateEmailProps {
  title: string;
  content: string;
}

export const SystemUpdateEmail = ({
  title,
  content,
}: SystemUpdateEmailProps) => (
  <Html>
    <Head />
    <Preview>{title}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={heading}>📢 System Update</Heading>
        </Section>
        <Section style={contentContainer}>
          <Heading style={titleStyle}>{title}</Heading>
          <Text style={paragraph}>{content}</Text>
          
          <Section style={btnContainer}>
            <Link style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}>
              Open Dashboard
            </Link>
          </Section>
        </Section>
        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerText}>
            You are receiving this because you are a subscriber of the Golf Charity Subscription Platform.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default SystemUpdateEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
};

const header = {
  padding: '32px',
  textAlign: 'center' as const,
  backgroundColor: '#3b82f6',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
};

const heading = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
};

const contentContainer = {
  padding: '40px 48px',
};

const titleStyle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#0f172a',
  marginBottom: '16px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#4b5563',
  whiteSpace: 'pre-wrap' as const,
};

const btnContainer = {
  textAlign: 'center' as const,
  marginTop: '32px',
};

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '12px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '20px 0',
};

const footer = {
  padding: '0 48px',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '12px',
  color: '#94a3b8',
};
