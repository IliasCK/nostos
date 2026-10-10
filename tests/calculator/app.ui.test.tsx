// @vitest-environment happy-dom
// SYNTHETIC params / made-up data only.
import { cleanup, fireEvent, render, screen, within } from '@testing-library/preact';
import { afterEach, describe, expect, it } from 'vitest';
import CalculatorApp from '../../src/components/calculator/CalculatorApp';
import realConfig from '../../src/config/greece-tax-2026.json';
import rentFile from '../../src/data/manual/rent.json';
import en from '../../src/i18n/en.json';
import { loadFx, loadPriceLevels, loadRent } from '../../src/lib/data';
import { listParams } from '../../src/lib/params/verification';
import { verifiedConfig } from '../eligibility/helpers';

const strings = Object.fromEntries(Object.entries(en).filter(([k]) => k.startsWith('quiz.') || k.startsWith('calc.')));
const realData = { fx: loadFx(undefined), priceLevels: loadPriceLevels(undefined), rent: loadRent(rentFile) };
const fakeData = {
  fx: loadFx({ source: 's', fetchedAt: 't', date: '2026-01-01', base: 'EUR', rates: { GBP: 0.8 } }),
  priceLevels: loadPriceLevels({ source: 's', fetchedAt: 't', year: 2024, basis: 'SYNTHETIC', indices: { GR: 80, GB: 100, DE: 100 } }),
  rent: loadRent({ quarter: '2026-Q2', sourceUrl: 'https://example.org', basis: 'x', cities: { athens: 10 }, sizes: { one_bed: 60 } }),
};

const click = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }));
const type = (label: string, value: string) => fireEvent.input(screen.getByLabelText(label), { target: { value } });
const choose = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });

function fillForm() {
  choose(en['calc.field.origin'], 'DE');
  type(en['calc.field.netMonthly'], '2400');
  type(en['calc.field.rentMonthly'], '1000');
  type(en['calc.field.birthYear'], '1980');
  choose(en['calc.field.city'], 'athens');
  type(en['calc.field.grossAnnual'], '28000');
  choose(en['calc.field.size'], 'one_bed');
  click(en['calc.submit']);
}

afterEach(cleanup);

describe('CalculatorApp, live configuration (all unverified)', () => {
  it('runs quiz → form → results and shows the unverified state in plain language, with no figures', () => {
    render(<CalculatorApp locale="en" strings={strings} config={realConfig} data={realData} methodologyHref="/en/methodology/" />);
    expect(document.querySelector('[data-demo-controls]')).toBeNull();
    expect(screen.queryByLabelText(en['calc.field.origin'])).toBeNull(); // form waits for the quiz

    click('Germany');
    click(en['quiz.work.greek_employer']);
    expect(screen.getByLabelText(en['calc.field.origin'])).toHaveProperty('value', 'DE'); // prefilled from the quiz

    fillForm();
    const results = screen.getByTestId('results');
    expect(within(results).getByText(en['calc.unverified.title'])).toBeTruthy();
    expect(within(results).getByText(en['calc.param.incomeTax.brackets'])).toBeTruthy();
    expect(within(results).queryByTestId('net-figure')).toBeNull();
    expect(within(results).queryByTestId('headline')).toBeNull();
    expect(within(results).getAllByTestId('unavailable').length).toBeGreaterThanOrEqual(2); // rent + comparison
    expect(within(results).getAllByText(en['calc.data.rent'])).toHaveLength(2); // rent and comparison sections
    expect(results.textContent).not.toMatch(/€\s?\d/); // never a number built on a null
    expect(within(results).getByText(en['calc.assume.oneEarner'])).toBeTruthy();
    expect(within(results).getByText(en['calc.disclaimer'])).toBeTruthy();
    expect(within(results).queryByTestId('email-signup')).toBeNull(); // no email signup in v1
  });

  it('shows field errors instead of results for an incomplete form', () => {
    render(<CalculatorApp locale="en" strings={strings} config={realConfig} data={realData} methodologyHref="/en/methodology/" />);
    click('Germany');
    click(en['quiz.work.greek_employer']);
    click(en['calc.submit']);
    expect(screen.getByText(en['calc.errors.summary'])).toBeTruthy();
    expect(screen.getAllByText(en['calc.error.required']).length).toBeGreaterThan(3);
    expect(screen.queryByTestId('results')).toBeNull();
  });
});

describe('CalculatorApp with SYNTHETIC verified params and made-up data', () => {
  it('likely eligible: headline, 5C figure first, comparison tables and timeline table', () => {
    render(<CalculatorApp locale="en" strings={strings} config={verifiedConfig()} data={fakeData} methodologyHref="/en/methodology/" />);
    click('0');
    click('Germany');
    click(en['quiz.work.greek_employer']);
    click('Yes');
    fillForm();

    const results = screen.getByTestId('results');
    expect(within(results).getByTestId('headline').textContent).toContain("In Athens you'd have about 30% more left after rent");
    expect(within(results).getByTestId('headline').textContent).toContain('From year 8: about 5% more.');
    const figures = within(results).getAllByTestId('net-figure');
    expect(figures[0]!.textContent).toContain(en['calc.net.with5c']);
    expect(figures[0]!.textContent).toContain('€2,052');
    expect(figures[1]!.textContent).toContain('€1,778');
    expect(within(results).getAllByTestId('compare-table')).toHaveLength(2);
    expect(within(results).getByTestId('cliff-drop').textContent).toContain('Change from year 8');
    expect(within(results).getByText(en['calc.rent.disclaimer'])).toBeTruthy();
  });
});

describe('plain-language labels', () => {
  const quizOnly = /^art5c\.(lookbackYears|requiredNonResidentYears|minimumStayYears|euEeaQualifies|qualifyingWorkTypes|cooperationCountries\.)/;
  it.each(listParams(realConfig).map((p) => p.path).filter((p) => !quizOnly.test(p)))('%s has a calc.param label', (path) => {
    expect(en).toHaveProperty([`calc.param.${path}`]);
  });
});
