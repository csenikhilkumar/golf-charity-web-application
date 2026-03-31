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

interface DrawResultsEmailProps {
  month: string;
  year: number;
  winningNumbers: number[];
  prizePool: number;
  totalWinners: number;
}

export const DrawResultsEmail = ({
  month,
  year,
  winningNumbers,
  prizePool,
  totalWinners,
}: DrawResultsEmailProps) => (
  <Html>
    <Head />
    <Preview>{`The ${month} ${year} Draw Results are in!`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={heading}>🎯 Draw Results</Heading>
          <Text style={subheading}>{month} {year}</Text>
        </Section>
        <Section style={content}>
          <Text style={paragraph}>
            The monthly draw has been completed. Here are the winning numbers and highlights.
          </Text>
          
          <Section style={statsGrid}>
            <Section style={statBox}>
              <Text style={statLabel}>Prize Pool</Text>
              <Text style={statValue}>${prizePool.toLocaleString()}</Text>
            </Section>
            <Section style={statBox}>
              <Text style={statLabel}>Winners</Text>
              <Text style={statValue}>{totalWinners.toString()}</Text>
            </Section>
          </Section>

          <Heading style={numberHeading}>Winning Numbers</Heading>
          <Section style={numbersContainer}>
            {winningNumbers.map((num, i) => (
              <span key={i} style={numberCircle}>{num}</span>
            ))}
          </Section>

          <Text style={paragraph}>
            Log in to your dashboard to see if your numbers matched and check your status.
          </Text>
          <Section style={btnContainer}>
            <Link style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}>
              Check My Results
            </Link>
          </Section>
        </Section>
        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerText}>
            Thank you for being part of the Golf Charity community.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default DrawResultsEmail;

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
  backgroundColor: '#10b981',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
};

const heading = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
};

const subheading = {
  color: '#ffffff',
  fontSize: '18px',
  opacity: 0.9,
  margin: '4px 0 0',
};

const content = {
  padding: '40px 48px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#4b5563',
  textAlign: 'center' as const,
};

const statsGrid = {
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
  margin: '32px 0',
};

const statBox = {
  padding: '16px',
  backgroundColor: '#f8fafc',
  borderRadius: '12px',
  minWidth: '120px',
  textAlign: 'center' as const,
  border: '1px solid #e2e8f0',
};

const statLabel = {
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  color: '#64748b',
  fontWeight: 'bold',
  margin: '0 0 4px',
};

const statValue = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#0f172a',
  margin: '0',
};

const numberHeading = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#0f172a',
  textAlign: 'center' as const,
  marginTop: '40px',
  marginBottom: '16px',
};

const numbersContainer = {
  textAlign: 'center' as const,
  marginBottom: '40px',
};

const numberCircle = {
  display: 'inline-block',
  width: '40px',
  height: '40px',
  lineHeight: '40px',
  borderRadius: '50%',
  backgroundColor: '#0f172a',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 4px',
  textAlign: 'center' as const,
};

const btnContainer = {
  textAlign: 'center' as const,
  marginTop: '32px',
};

const button = {
  backgroundColor: '#10b981',
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
