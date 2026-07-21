function chartPoints(values) {
  const startX = 38;
  const endX = 522;
  const step = (endX - startX) / (values.length - 1);

  return values.map((value, index) => `${startX + index * step},${value}`).join(" ");
}

export default function SignalChart({ signal }) {
  const points = chartPoints(signal.chart);
  const firstPoint = `38,${signal.chart[0]}`;
  const lastX = 522;
  const lastY = signal.chart.at(-1);
  const area = `${firstPoint} ${points.split(" ").slice(1).join(" ")} 522,354 38,354`;
  const gradientId = `signal-gradient-${signal.id}`;

  return (
    <svg
      className="signal-chart"
      viewBox="0 0 560 420"
      role="img"
      aria-labelledby={`signal-chart-title-${signal.id}`}
    >
      <title id={`signal-chart-title-${signal.id}`}>
        {signal.pair} example price chart
      </title>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={signal.accent} stopOpacity="0.34" />
          <stop offset="100%" stopColor={signal.accent} stopOpacity="0" />
        </linearGradient>
      </defs>

      <g className="signal-chart__grid" aria-hidden="true">
        {[72, 142, 212, 282, 352].map((y) => (
          <line x1="30" x2="530" y1={y} y2={y} key={`y-${y}`} />
        ))}
        {[38, 134, 230, 326, 422, 522].map((x) => (
          <line x1={x} x2={x} y1="54" y2="354" key={`x-${x}`} />
        ))}
      </g>

      <g className="signal-chart__levels" aria-hidden="true">
        <line className="signal-chart__level signal-chart__level--target" x1="30" x2="530" y1="92" y2="92" />
        <line className="signal-chart__level signal-chart__level--entry" x1="30" x2="530" y1="218" y2="218" />
        <line className="signal-chart__level signal-chart__level--stop" x1="30" x2="530" y1="330" y2="330" />
      </g>

      <polygon points={area} fill={`url(#${gradientId})`} aria-hidden="true" />
      <polyline
        className="signal-chart__line"
        points={points}
        style={{ stroke: signal.accent }}
        aria-hidden="true"
      />
      <circle
        className="signal-chart__point-halo"
        cx={lastX}
        cy={lastY}
        r="11"
        style={{ fill: signal.accent }}
        aria-hidden="true"
      />
      <circle cx={lastX} cy={lastY} r="4.5" fill="#fff" aria-hidden="true" />

      <g className="signal-chart__labels" aria-hidden="true">
        <text x="40" y="82">Target</text>
        <text x="40" y="208">Entry</text>
        <text x="40" y="320">Stop</text>
      </g>
    </svg>
  );
}
