export default function OpenSkyStats() {
  return (
    <div className="my-8">
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div>
          <p className="font-heading text-accent text-2xl font-bold">2,000+</p>
          <p className="font-heading text-text-muted text-[11px] uppercase tracking-widest mt-1">
            Volunteer receivers
          </p>
        </div>
        <div>
          <p className="font-heading text-accent text-2xl font-bold">23T+</p>
          <p className="font-heading text-text-muted text-[11px] uppercase tracking-widest mt-1">
            Messages archived
          </p>
        </div>
        <div>
          <p className="font-heading text-accent text-2xl font-bold">700+</p>
          <p className="font-heading text-text-muted text-[11px] uppercase tracking-widest mt-1">
            Research papers
          </p>
        </div>
      </div>
      <a
        href="https://opensky-network.org/about/network"
        target="_blank"
        rel="noopener noreferrer"
        className="font-heading inline-flex items-center gap-1.5 text-accent text-[12px] font-semibold tracking-wide hover:text-accent-strong transition-colors"
      >
        View OpenSky&apos;s live coverage map ↗
      </a>
    </div>
  );
}
