export default function AdsbFlowDiagram() {
  return (
    <svg
      viewBox="0 0 680 200"
      role="img"
      aria-label="Diagram showing how flight data flows from an aircraft's transponder, through a ground receiver, to the OpenSky Network, to Hercules Radar"
      className="w-full h-auto"
    >
      <defs>
        <marker id="adsb-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>

      <rect x="40" y="60" width="130" height="56" rx="8" fill="var(--color-surface-card)" stroke="var(--color-border-subtle)" strokeWidth="1" />
      <text x="105" y="80" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-heading)" fontSize="13" fontWeight="600" fill="var(--color-text-primary)">Transponder</text>
      <text x="105" y="98" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-heading)" fontSize="11" fill="var(--color-text-muted)">Broadcasts data</text>

      <line x1="170" y1="88" x2="183" y2="88" stroke="var(--color-text-muted)" strokeWidth="1.5" markerEnd="url(#adsb-arrow)" />

      <rect x="185" y="60" width="130" height="56" rx="8" fill="var(--color-surface-card)" stroke="var(--color-border-subtle)" strokeWidth="1" />
      <text x="250" y="80" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-heading)" fontSize="13" fontWeight="600" fill="var(--color-text-primary)">Receiver</text>
      <text x="250" y="98" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-heading)" fontSize="11" fill="var(--color-text-muted)">Picks up signal</text>

      <line x1="315" y1="88" x2="328" y2="88" stroke="var(--color-text-muted)" strokeWidth="1.5" markerEnd="url(#adsb-arrow)" />

      <rect x="330" y="60" width="130" height="56" rx="8" fill="var(--color-accent-wash)" stroke="var(--color-accent)" strokeWidth="1" />
      <text x="395" y="80" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-heading)" fontSize="13" fontWeight="600" fill="var(--color-accent)">OpenSky</text>
      <text x="395" y="98" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-heading)" fontSize="11" fill="var(--color-text-muted)">Aggregates data</text>

      <line x1="460" y1="88" x2="473" y2="88" stroke="var(--color-text-muted)" strokeWidth="1.5" markerEnd="url(#adsb-arrow)" />

      <rect x="475" y="60" width="150" height="56" rx="8" fill="var(--color-accent-wash)" stroke="var(--color-accent)" strokeWidth="1" />
      <text x="550" y="80" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-heading)" fontSize="13" fontWeight="600" fill="var(--color-accent)">Hercules Radar</text>
      <text x="550" y="98" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-heading)" fontSize="11" fill="var(--color-text-muted)">Polls the data</text>

      <text x="340" y="160" textAnchor="middle" fontFamily="var(--font-heading)" fontSize="10" fill="var(--color-text-muted)">
        Hardware picks it up · software carries it the rest of the way · polled every 30 seconds
      </text>
    </svg>
  );
}