// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/preact';
import { afterEach, describe, expect, it, vi } from 'vitest';
import EligibilityQuiz from '../../src/components/quiz/EligibilityQuiz';
import realConfig from '../../src/config/greece-tax-2026.json';
import en from '../../src/i18n/en.json';
import { verifiedConfig } from './helpers';

const strings = Object.fromEntries(Object.entries(en).filter(([key]) => key.startsWith('quiz.')));
const click = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }));
const card = (question: string) => document.querySelector<HTMLElement>(`[data-question="${question}"]`)!;

afterEach(cleanup);

describe('EligibilityQuiz with the real (unverified) config', () => {
  it('skips Q1 and Q4, steps through Q2 and Q3, supports Back, and shows a borderline result', () => {
    render(<EligibilityQuiz strings={strings} config={realConfig} />);

    expect(screen.getByText('Question 1 of 2')).toBeTruthy();
    expect(screen.getByRole('heading', { name: en['quiz.q.origin'] })).toBeTruthy();
    expect(screen.getByText(en['quiz.skippedNotice'])).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Back/ })).toBeNull();

    click('Germany');
    expect(screen.getByRole('heading', { name: en['quiz.q.work'] })).toBeTruthy();

    click(/Back/);
    expect(screen.getByRole('heading', { name: en['quiz.q.origin'] })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Germany' }).getAttribute('aria-pressed')).toBe('true');

    click('Germany');
    click(en['quiz.work.remote_foreign']);

    expect(screen.getByRole('heading', { name: 'Borderline' })).toBeTruthy();
    expect(document.querySelectorAll('[data-question]')).toHaveLength(4);
    expect(within(card('priorResidence')).getByText('Not asked')).toBeTruthy();
    expect(within(card('priorResidence')).getByText('Rule not yet verified.')).toBeTruthy();
    expect(within(card('work')).getByText(en['quiz.note.remote'])).toBeTruthy();
    expect(within(card('origin')).getByText('No source recorded yet.')).toBeTruthy();
    expect(document.querySelectorAll('[data-verdict="pass"]')).toHaveLength(0);
    expect(screen.getByText(en['quiz.disclaimer'])).toBeTruthy();
  });
});

describe('EligibilityQuiz with a verified SYNTHETIC config', () => {
  it('asks all four questions and reports likely_eligible through onComplete', () => {
    const onComplete = vi.fn();
    render(<EligibilityQuiz strings={strings} config={verifiedConfig()} onComplete={onComplete} />);

    expect(screen.getByText('Question 1 of 4')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'In how many of the last 8 years were you a tax resident of Greece?' })).toBeTruthy();
    expect(screen.getAllByRole('button')).toHaveLength(9 + 1); // 0..8 + not sure

    click('0');
    click('Germany');
    click(en['quiz.work.greek_employer']);
    expect(screen.getByRole('heading', { name: 'Will you stay in Greece for at least 2 years?' })).toBeTruthy();
    click('Yes');

    expect(screen.getByRole('heading', { name: 'Likely eligible' })).toBeTruthy();
    expect(document.querySelectorAll('[data-verdict="pass"]')).toHaveLength(4);
    expect(within(card('priorResidence')).getByText('0 years')).toBeTruthy();
    expect(within(card('stay')).getByText('You must declare that you\'ll stay in Greece for at least 2 years.')).toBeTruthy();
    expect(within(card('stay')).getByRole('link').getAttribute('href')).toBe('https://example.org/synthetic');

    expect(onComplete).toHaveBeenCalledTimes(1);
    const [result, answers] = onComplete.mock.calls[0]!;
    expect(result.outcome).toBe('likely_eligible');
    expect(answers).toEqual({ priorResidence: 0, origin: 'DE', work: 'greek_employer', stay: 'yes' });
  });

  it('shows likely_not_eligible with the not-working note, and Back / Start again work from the result', () => {
    render(<EligibilityQuiz strings={strings} config={verifiedConfig()} />);
    click('0');
    click('Germany');
    click(en['quiz.work.not_working']);
    click('Yes');

    expect(screen.getByRole('heading', { name: 'Likely not eligible' })).toBeTruthy();
    expect(within(card('work')).getByText(en['quiz.note.notWorking'])).toBeTruthy();

    click(/Back/);
    expect(screen.getByRole('heading', { name: 'Will you stay in Greece for at least 2 years?' })).toBeTruthy();
    click('Not sure');
    expect(screen.getByRole('heading', { name: 'Likely not eligible' })).toBeTruthy();

    click('Start again');
    expect(screen.getByText('Question 1 of 4')).toBeTruthy();
    expect(screen.getByRole('button', { name: '0' }).getAttribute('aria-pressed')).toBe('false');
  });
});
