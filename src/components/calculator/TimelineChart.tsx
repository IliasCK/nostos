import { useEffect, useRef } from 'preact/hooks';
import type { Timeline } from '../../lib/tax';
import type { Format, Text } from './text';

interface Props {
  t: Text;
  format: Format;
  timeline: Timeline;
}

function cssVar(name: string, fallback: string): string {
  const v = typeof document !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue(name).trim() : '';
  return v || fallback;
}

/** Diagonal hatching so the cliff bar differs by pattern, not only colour. */
function hatch(color: string, background: string): CanvasPattern | string {
  const c = document.createElement('canvas');
  c.width = c.height = 8;
  const ctx = c.getContext('2d');
  if (!ctx) return color;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, 8, 8);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-2, 10);
  ctx.lineTo(10, -2);
  ctx.stroke();
  return ctx.createPattern(c, 'repeat') ?? color;
}

export default function TimelineChart({ t, format, timeline }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { years, durationYears, cliffYear } = timeline;
  const yearLabel = (y: (typeof years)[number]) => (y.onwards ? `${t('calc.chart.year', { year: y.year })}+` : t('calc.chart.year', { year: y.year }));
  const applicable = years.map((y) => (y.with5C ?? y.without5C).monthlyNet);
  const lastWith5C = years[years.length - 2]?.with5C?.monthlyNet ?? 0;
  const drop = years[years.length - 1]!.without5C.monthlyNet - lastWith5C;
  const description = t('calc.chart.desc', { duration: durationYears, cliffYear });

  useEffect(() => {
    let chart: { destroy(): void } | undefined;
    let cancelled = false;
    (async () => {
      try {
        const { Chart, BarController, BarElement, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } =
          await import('chart.js');
        if (cancelled || !canvasRef.current) return;
        Chart.register(BarController, BarElement, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);
        const accent = cssVar('--nostos-accent', '#9c3d21');
        const ink = cssVar('--nostos-ink', '#1c1a17');
        const muted = cssVar('--nostos-muted', '#5c564d');
        const line = cssVar('--nostos-line', '#cfc5b6');
        const surface = cssVar('--nostos-surface', '#fffdf9');
        const cliffIndex = years.length - 1;

        const cliffMarker = {
          id: 'cliffMarker',
          afterDatasetsDraw(c: any) {
            const meta = c.getDatasetMeta(0);
            const prev = meta.data[cliffIndex - 1];
            const cliff = meta.data[cliffIndex];
            if (!prev || !cliff) return;
            const x = (prev.x + cliff.x) / 2;
            const { top, bottom } = c.chartArea;
            const ctx = c.ctx as CanvasRenderingContext2D;
            ctx.save();
            ctx.strokeStyle = ink;
            ctx.setLineDash([5, 4]);
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x, top);
            ctx.lineTo(x, bottom);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = ink;
            ctx.font = '600 12px "Inter Variable", system-ui, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(t('calc.chart.cliff'), x - 6, top + 12);
            ctx.restore();
          },
        };

        chart = new Chart(canvasRef.current, {
          type: 'bar',
          data: {
            labels: years.map(yearLabel),
            datasets: [
              {
                type: 'bar',
                label: t('calc.chart.with5c'),
                data: applicable,
                backgroundColor: years.map((y) => (y.with5C ? accent : hatch(muted, surface))),
                borderColor: years.map((y) => (y.with5C ? accent : muted)),
                borderWidth: 1,
                borderRadius: 3,
                order: 2,
              },
              {
                type: 'line',
                label: t('calc.chart.without5c'),
                data: years.map((y) => y.without5C.monthlyNet),
                borderColor: ink,
                borderDash: [6, 4],
                borderWidth: 2,
                pointRadius: 2,
                pointBackgroundColor: ink,
                order: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
              legend: { position: 'bottom', labels: { color: ink, boxWidth: 14 } },
              tooltip: { callbacks: { label: (ctx: any) => `${ctx.dataset.label}: ${format.money(ctx.parsed.y)}` } },
            },
            scales: {
              x: { ticks: { color: muted }, grid: { display: false } },
              y: { beginAtZero: true, ticks: { color: muted, callback: (v: any) => format.money(Number(v)) }, grid: { color: line } },
            },
          },
          plugins: [cliffMarker],
        });
      } catch {
        // No canvas (e.g. very old browser): the table below carries the same data.
      }
    })();
    return () => {
      cancelled = true;
      chart?.destroy();
    };
  }, [timeline, t, format]);

  return (
    <figure class="space-y-3">
      <figcaption>
        <h3 class="text-xl">{t('calc.chart.title')}</h3>
        <p class="mt-1 text-sm text-muted">{description}</p>
      </figcaption>
      <div class="relative h-64 sm:h-72">
        <canvas ref={canvasRef} role="img" aria-label={description} />
      </div>
      <p class="font-medium" data-testid="cliff-drop">
        <span aria-hidden="true">{drop < 0 ? '▼ ' : drop > 0 ? '▲ ' : '≈ '}</span>
        {t('calc.chart.drop', { cliffYear, amount: format.money(drop) })}
      </p>
      <details class="rounded-md border border-line bg-surface p-3">
        <summary class="cursor-pointer font-medium">{t('calc.chart.table')}</summary>
        <div class="mt-3 overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-line">
                <th scope="col" class="py-1 pr-3">{t('calc.chart.col.year')}</th>
                <th scope="col" class="py-1 pr-3">{t('calc.chart.col.taxYear')}</th>
                <th scope="col" class="py-1 pr-3">{t('calc.chart.col.ageBand')}</th>
                <th scope="col" class="py-1 pr-3 text-right">{t('calc.chart.with5c')}</th>
                <th scope="col" class="py-1 text-right">{t('calc.chart.without5c')}</th>
              </tr>
            </thead>
            <tbody>
              {years.map((y) => (
                <tr class="border-b border-line last:border-0">
                  <th scope="row" class="py-1 pr-3 font-normal">
                    {y.onwards ? t('calc.chart.onwards', { year: y.year }) : y.year}
                  </th>
                  <td class="py-1 pr-3">{y.onwards ? t('calc.chart.onwards', { year: y.taxYear }) : y.taxYear}</td>
                  <td class="py-1 pr-3">{t(`calc.ageBand.${y.ageBand}`)}</td>
                  <td class="py-1 pr-3 text-right">{y.with5C ? format.money(y.with5C.monthlyNet) : '–'}</td>
                  <td class="py-1 text-right">{format.money(y.without5C.monthlyNet)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
