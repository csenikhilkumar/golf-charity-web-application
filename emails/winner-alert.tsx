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
  Img,
} from '@react-email/components';
import * as React from 'react';

interface WinnerAlertEmailProps {
  userName: string;
  prizeAmount: number;
  matchType: string;
  drawDate: string;
}

export const WinnerAlertEmail = ({
  userName,
  prizeAmount,
  matchType,
  drawDate,
}: WinnerAlertEmailProps) => (
  <Html>
    <Head />
    <Preview>Congratulations! You've won a prize in the Golf Charity Draw!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={heading}>🏆 You're a Winner!</Heading>
        </Section>
        <Section style={content}>
          <Text style={paragraph}>Hi {userName},</Text>
          <Text style={paragraph}>
            We have exciting news! Your entry in the {drawDate} draw was a winner.
          </Text>
          <Section style={prizeBox}>
            <Text style={prizeLabel}>Prize Won</Text>
            <Text style={prizeValue}>${prizeAmount.toLocaleString()}</Text>
            <Text style={matchLabel}>Matching: {matchType}</Text>
          </Section>
          <Text style={paragraph}>
            To claim your prize, please log in to your dashboard and upload your proof of participation (e.g., your Stableford score card).
          </Text>
          <Section style={btnContainer}>
            <Link style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}>
              Go to Dashboard
            </Link>
          </Section>
          <Text style={paragraph}>
            Thank you for supporting our charity partners through your participation.
          </Text>
        </Section>
        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerText}>
            Golf Charity Subscription Platform. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WinnerAlertEmail;

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
  backgroundColor: '#0f172a',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
};

const heading = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
};

const content = {
  padding: '40px 48px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#4b5563',
};

const prizeBox = {
  backgroundColor: '#f8fafc',
  borderRadius: '12px',
  padding: '24px',
  textAlign: 'center' as const,
  margin: '32px 0',
  border: '1px solid #e2e8f0',
};

const prizeLabel = {
  fontSize: '14px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  color: '#64748b',
  margin: '0 0 8px',
  fontWeight: 'bold',
};

const prizeValue = {
  fontSize: '48px',
  fontWeight: 'black',
  color: '#0f172a',
  margin: '0',
};

const matchLabel = {
  fontSize: '14px',
  color: '#10b981',
  fontWeight: '600',
  marginTop: '8px',
};

const btnContainer = {
  textAlign: 'center' as const,
  marginTop: '32px',
};

const button = {
  backgroundColor: '#0f172a',
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
