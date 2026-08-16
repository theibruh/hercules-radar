import Image from "next/image";

export default function SquawkExample() {
  return (
    <div className="my-8">
        <h2 className="text-text-primary font-heading text-[18px] font-bold mb-4">
        SQUAWK CODES
      </h2>
      <p className="font-serif text-text-primary text-[16px] leading-[1.75] mb-6">
        A squawk code is a four-digit number a transponder broadcasts
        alongside its position, normally just an identifier air traffic
        control assigns, but three specific codes exist purely to signal an
        emergency.
      </p>

      <Image
        src="/about/squawk-example.png"
        alt="A real Hercules Radar flight card showing a squawk 7600 emergency, with the code circled"
        width={640}
        height={220}
        className="rounded-lg w-full h-auto mb-6"
      />

      <table className="w-full font-mono text-[13px] border-collapse">
        <thead>
          <tr className="border-b border-border-subtle">
            <th className="text-left py-2 text-text-muted font-normal text-[11px] uppercase tracking-widest">Code</th>
            <th className="text-left py-2 text-text-muted font-normal text-[11px] uppercase tracking-widest">Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border-subtle">
            <td className="py-2 text-text-primary">0000–7499</td>
            <td className="py-2 text-text-secondary">Normal, assigned by ATC</td>
          </tr>
          <tr className="border-b border-border-subtle">
            <td className="py-2 text-danger font-bold">7500</td>
            <td className="py-2 text-text-secondary">Hijacking</td>
          </tr>
          <tr className="border-b border-border-subtle">
            <td className="py-2 text-danger font-bold">7600</td>
            <td className="py-2 text-text-secondary">Radio/comms failure</td>
          </tr>
          <tr>
            <td className="py-2 text-danger font-bold">7700</td>
            <td className="py-2 text-text-secondary">General emergency</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}