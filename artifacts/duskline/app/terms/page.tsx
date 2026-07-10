import type { Metadata } from "next";
import Link from "next/link";
import Wordmark from "@/components/Wordmark";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions — Orenara",
  description:
    "Terms and conditions for the supply of Orenara outdoor LED strip lighting products. Supply-only; installation is the customer's responsibility and must be carried out by a licensed electrician.",
  robots: { index: true, follow: true },
};

type Clause = {
  id: string;
  strong?: string;
  text?: string;
  sub?: string[];
};

type Section = {
  n: string;
  title: string;
  clauses: Clause[];
};

const LAST_UPDATED = "1 July 2026";
const JURISDICTION = "New South Wales";

const sections: Section[] = [
  {
    n: "1",
    title: "Who We Are and What We Do",
    clauses: [
      {
        id: "1.1",
        text: 'Orenara ("we," "us," "our") supplies outdoor LED strip lighting products, including flexible and rigid mounting systems, LED strip, drivers, dimmers, connectors, and associated components (the "Products").',
      },
      {
        id: "1.2",
        strong:
          "Orenara is a supplier of parts only. We do not provide installation services, electrical work, or on-site trade services of any kind.",
        text: " Nothing on our website, in our marketing materials, in any quote, invoice, or communication with us should be interpreted as an offer to install, wire, or otherwise physically integrate the Products into any property, structure, or electrical system.",
      },
      {
        id: "1.3",
        text: 'By purchasing Products from Orenara, the purchaser ("you," "the Customer") acknowledges and agrees that installation, wiring, electrical connection, and integration of the Products is entirely the Customer\'s responsibility, or the responsibility of whichever licensed tradesperson the Customer engages to carry out that work.',
      },
    ],
  },
  {
    n: "2",
    title: "Electrical Work Must Be Performed by a Licensed Electrician",
    clauses: [
      {
        id: "2.1",
        text: "The Products include components that connect to or operate from mains electrical supply (including but not limited to LED drivers rated for 220–240V AC input). In every Australian state and territory, electrical wiring work of this nature is legally required to be performed, or directly supervised, by a person holding a current electrical licence in the relevant jurisdiction, and in accordance with AS/NZS 3000 (the Australian/New Zealand Wiring Rules) and any other applicable standards, codes, or regulations.",
      },
      {
        id: "2.2",
        strong:
          "Orenara strongly recommends that all electrical connection, wiring, and installation of the Products be carried out exclusively by a licensed electrician.",
        text: " We do not sell Products on the basis that they are intended or suitable for unlicensed installation of mains-connected components.",
      },
      {
        id: "2.3",
        text: "If you are not a licensed electrician and choose to undertake any part of the installation yourself, you do so entirely at your own risk and acknowledge that:",
        sub: [
          "(a) doing so may be unlawful in your jurisdiction and may expose you to regulatory penalties independent of anything in these Terms;",
          "(b) Orenara accepts no responsibility whatsoever for the outcome, safety, or compliance of any installation not carried out by a licensed electrician;",
          "(c) any warranty, guarantee, insurance, or other protection that might otherwise apply may be voided, in whole or in part, as a result of unlicensed installation.",
        ],
      },
      {
        id: "2.4",
        text: "Nothing in this clause is intended to encourage, endorse, or facilitate unlicensed electrical work. Where local law prohibits unlicensed persons from connecting mains-voltage equipment, that law prevails and the Customer must comply with it regardless of anything else in these Terms.",
      },
    ],
  },
  {
    n: "3",
    title: "Installation Responsibility",
    clauses: [
      {
        id: "3.1",
        text: "Where installation is carried out by a licensed electrician engaged by the Customer (whether directly or through a builder, landscaper, or other trade), that electrician is solely responsible for:",
        sub: [
          "(a) verifying the Products are appropriate for the specific installation, environment, and load requirements of the site;",
          "(b) correct wiring, connection, termination, sealing, and mounting of all components in accordance with the manufacturer's instructions, AS/NZS 3000, and all other applicable standards;",
          "(c) ensuring IP-rated seals, connectors, and end caps are installed and sealed correctly, as an improperly sealed IP68-rated component no longer carries any ingress protection;",
          "(d) all aspects of electrical safety, compliance, and certification arising from the installation.",
        ],
      },
      {
        id: "3.2",
        text: "Orenara provides installation instructions and specification information in good faith as guidance only. Provision of this information does not constitute installation supervision, engineering certification, or a guarantee that following it will produce a compliant or safe installation in every circumstance. Site conditions vary, and it is the installer's responsibility to exercise their own professional judgment.",
      },
      {
        id: "3.3",
        text: "Orenara is not responsible for, and accepts no liability arising from:",
        sub: [
          "(a) incorrect wiring, terminations, polarity, voltage matching, or driver/dimmer pairing carried out during installation;",
          "(b) failure to properly seal connectors, joints, or end caps, or damage caused by moisture, dust, or other ingress resulting from improper sealing;",
          "(c) damage caused by installation in a manner inconsistent with the Products' specifications (including but not limited to exceeding rated bend radius, exceeding maximum run length per driver, or mounting in a manner not described in our specification materials);",
          "(d) damage or malfunction arising from modifications, alterations, or repairs made to the Products by anyone other than Orenara;",
          "(e) damage arising from the acts or omissions of any third-party tradesperson, contractor, builder, or other installer engaged by the Customer;",
          "(f) any consequential loss, property damage, or personal injury arising from any of the above.",
        ],
      },
    ],
  },
  {
    n: "4",
    title: 'Products Are Supplied "As Described," Not Installed and Tested On-Site',
    clauses: [
      {
        id: "4.1",
        text: "Products are supplied in the condition described in the applicable product listing or quotation at the time of dispatch. Orenara does not inspect, test, or certify Products once they leave our possession, and cannot verify the condition, wiring, or configuration of any Product once installation has commenced.",
      },
      {
        id: "4.2",
        text: "Any fault, defect, or failure that becomes apparent after installation may have multiple possible causes, including but not limited to manufacturing defect, transport damage, incorrect installation, incorrect electrical configuration, or damage from external causes. The Customer acknowledges that determining the cause of a post-installation fault may require investigation, and that Orenara is not obliged to accept responsibility for a fault without first being able to assess whether it arose from the Product itself, as supplied, prior to installation.",
      },
    ],
  },
  {
    n: "5",
    title: "Warranty and Consumer Guarantees",
    clauses: [
      {
        id: "5.1",
        text: "Orenara does not offer any additional or extended warranty beyond what is described in this clause.",
      },
      {
        id: "5.2",
        strong:
          "Nothing in these Terms excludes, restricts, or modifies any consumer guarantee, right, or remedy that cannot lawfully be excluded, restricted, or modified under the Australian Consumer Law (Schedule 2 of the Competition and Consumer Act 2010 (Cth)) or any other applicable law.",
        text: " Where the Australian Consumer Law applies to the supply of the Products, the Customer may be entitled to a replacement, repair, refund, or compensation for a failure to meet a consumer guarantee, and these Terms do not affect those rights.",
      },
      {
        id: "5.3",
        text: "To the maximum extent permitted by law, and subject to clause 5.2, Orenara's liability for any claim arising from the Products is limited, at Orenara's option, to one of the following: (a) replacement of the Product; (b) resupply of an equivalent Product; or (c) refund of the price paid for the Product. Orenara's liability is in any event limited to the amount paid by the Customer for the specific Product giving rise to the claim.",
      },
      {
        id: "5.4",
        text: "Where the Customer is a business acquiring the Products for the purposes of a trade, business, or profession, and to the extent permitted by law, the parties agree that the guarantees under the Australian Consumer Law that can be excluded for such acquisitions are excluded, and Orenara's liability is limited as set out in clause 5.3.",
      },
      {
        id: "5.5",
        text: "No warranty, express or implied, is given in relation to the performance, safety, or compliance of any installation. Any warranty relating to the Product itself does not extend to cover installation workmanship, and any claim relating to installation should be directed to the installer responsible.",
      },
    ],
  },
  {
    n: "6",
    title: "Limitation of Liability",
    clauses: [
      {
        id: "6.1",
        text: "Subject to clause 5.2, and to the maximum extent permitted by law, Orenara excludes all liability (whether in contract, tort, including negligence, under statute, or otherwise) for:",
        sub: [
          "(a) any indirect, special, or consequential loss or damage;",
          "(b) any loss of profits, revenue, business opportunity, or goodwill;",
          "(c) any property damage, personal injury, or death arising from or connected with the installation, use, misuse, or failure of the Products, except to the extent such liability cannot lawfully be excluded;",
          "(d) any loss arising from delay in delivery, howsoever caused.",
        ],
      },
      {
        id: "6.2",
        text: "Nothing in these Terms excludes or limits Orenara's liability for death or personal injury caused by Orenara's own negligence, to the extent such exclusion or limitation is not permitted by law.",
      },
      {
        id: "6.3",
        text: "The Customer acknowledges that the exclusions and limitations in this clause are a fundamental basis on which Orenara is prepared to supply the Products, and that the price of the Products reflects the allocation of risk set out in these Terms.",
      },
    ],
  },
  {
    n: "7",
    title: "Indemnity",
    clauses: [
      {
        id: "7.1",
        text: "To the maximum extent permitted by law, the Customer indemnifies and holds Orenara harmless against any claim, loss, damage, cost, or expense (including legal costs) arising from or connected with:",
        sub: [
          "(a) the Customer's installation, or any third party's installation on the Customer's behalf, of the Products;",
          "(b) any breach by the Customer of clause 2 (Electrical Work Must Be Performed by a Licensed Electrician);",
          "(c) any use of the Products otherwise than in accordance with the specifications and instructions provided by Orenara;",
          "(d) any claim brought by a third party arising from the installation or use of the Products at the Customer's premises.",
        ],
      },
    ],
  },
  {
    n: "8",
    title: "Lead Times and Delivery",
    clauses: [
      {
        id: "8.1",
        text: "Products are made to order. Estimated lead times provided at the time of quotation (including any standard or expedited lead time) are estimates only, based on information available at the time, and are not guaranteed delivery dates unless expressly confirmed in writing by Orenara as a firm date for a specific order.",
      },
      {
        id: "8.2",
        text: "Orenara is not liable for any loss, cost, or damage arising from delay in delivery, including but not limited to costs associated with trade scheduling, project delays, or third-party contractual commitments made by the Customer in reliance on an estimated lead time.",
      },
      {
        id: "8.3",
        text: "Risk in the Products passes to the Customer on delivery to the address nominated by the Customer, or on collection, whichever occurs first. Orenara is not responsible for the Products once delivered, including any damage occurring during on-site storage, handling, or subsequent installation.",
      },
    ],
  },
  {
    n: "9",
    title: "Specification and Site Suitability",
    clauses: [
      {
        id: "9.1",
        text: "Where Orenara provides a specification, quote, or recommendation based on information supplied by the Customer (including site dimensions, application type, or intended use), that specification is based solely on the information provided and Orenara has not conducted any site inspection, engineering assessment, or independent verification of site conditions.",
      },
      {
        id: "9.2",
        text: "It is the Customer's responsibility (or the responsibility of their engaged tradesperson) to verify that the specified Products are suitable for the actual site conditions, electrical supply, environmental exposure, and intended use prior to installation. Orenara is not liable for any mismatch between the specification provided and the actual requirements of the site, where that mismatch arises from inaccurate, incomplete, or changed information provided by the Customer.",
      },
    ],
  },
  {
    n: "10",
    title: "Returns and Change of Mind",
    clauses: [
      {
        id: "10.1",
        text: "As Products are made to order, Orenara does not accept returns for change of mind. This clause does not affect any right the Customer has under the Australian Consumer Law in relation to a failure to meet a consumer guarantee.",
      },
    ],
  },
  {
    n: "11",
    title: "General",
    clauses: [
      {
        id: "11.1",
        text: "These Terms constitute the entire agreement between Orenara and the Customer in relation to the supply of the Products, and supersede any prior representations, understandings, or agreements, whether written or oral, except to the extent such representations would constitute misleading or deceptive conduct under the Australian Consumer Law.",
      },
      {
        id: "11.2",
        text: "If any provision of these Terms is found to be void, illegal, or unenforceable, that provision is severed, and the remainder of these Terms continues in full force and effect.",
      },
      {
        id: "11.3",
        text: `These Terms are governed by the laws of ${JURISDICTION}, Australia, and the parties submit to the non-exclusive jurisdiction of the courts of that state or territory.`,
      },
      {
        id: "11.4",
        text: "Orenara may update these Terms from time to time. The Terms in force at the time an order is placed apply to that order.",
      },
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "var(--ink)",
          borderBottom: "1px solid var(--ink-line)",
        }}
      >
        <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex" }} aria-label="Orenara home">
            <Wordmark size="sm" />
          </Link>
          <Link
            href="/"
            className="hidden sm:inline-flex"
            style={{ color: "var(--bone-dim)", fontSize: "0.875rem", fontWeight: 500, textDecoration: "none" }}
            data-testid="terms-back-link"
          >
            Back to site
          </Link>
        </nav>
      </header>

      <main style={{ background: "var(--ink)" }}>
        <section style={{ paddingTop: "148px", paddingBottom: "80px" }}>
          <div className="mx-auto px-6" style={{ maxWidth: "820px" }}>
            <p className="spec-badge mb-6" style={{ display: "inline-flex" }}>
              Legal
            </p>
            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 3.25rem)",
                color: "var(--bone)",
                letterSpacing: "-0.035em",
                lineHeight: 1.08,
              }}
            >
              Terms &amp; <span>Conditions</span>
            </h1>
            <p style={{ marginTop: "16px", fontSize: "0.875rem", color: "var(--bone-dim)" }}>
              Last updated: {LAST_UPDATED}
            </p>

            {/* Supply-only summary callout */}
            <div
              style={{
                marginTop: "32px",
                padding: "20px 24px",
                borderRadius: "var(--radius)",
                border: "1px solid var(--ink-line)",
                background: "var(--ink-raised)",
              }}
            >
              <p style={{ fontSize: "0.9375rem", color: "var(--bone)", lineHeight: 1.7 }}>
                Orenara supplies components only.
              </p>
              <p style={{ marginTop: "6px", fontSize: "0.9375rem", color: "var(--bone-dim)", lineHeight: 1.7 }}>
                We do not provide installation or electrical work. All wiring and installation must be
                carried out by a licensed electrician in accordance with Australian standards.
              </p>
            </div>

            {/* Sections */}
            <div style={{ marginTop: "48px" }}>
              {sections.map((section) => (
                <section key={section.n} style={{ marginBottom: "44px" }}>
                  <h2
                    style={{
                      fontSize: "clamp(1.25rem, 3vw, 1.6rem)",
                      color: "var(--bone)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.25,
                      marginBottom: "20px",
                      paddingBottom: "12px",
                      borderBottom: "1px solid var(--ink-line)",
                    }}
                  >
                    <span style={{ color: "var(--bone-dim)", marginRight: "12px" }}>{section.n}.</span>
                    {section.title}
                  </h2>

                  {section.clauses.map((clause) => (
                    <div key={clause.id} style={{ marginBottom: "18px" }}>
                      <p style={{ fontSize: "0.9375rem", color: "var(--bone-dim)", lineHeight: 1.75 }}>
                        <span
                          style={{
                            color: "var(--bone-dim)",
                            fontWeight: 500,
                            fontVariantNumeric: "tabular-nums",
                            marginRight: "10px",
                          }}
                        >
                          {clause.id}
                        </span>
                        {clause.strong ? (
                          <strong style={{ color: "var(--bone)", fontWeight: 500 }}>{clause.strong}</strong>
                        ) : null}
                        {clause.text}
                      </p>
                      {clause.sub ? (
                        <div style={{ marginTop: "10px", paddingLeft: "28px" }}>
                          {clause.sub.map((item, i) => (
                            <p
                              key={i}
                              style={{
                                fontSize: "0.9375rem",
                                color: "var(--bone-dim)",
                                lineHeight: 1.75,
                                marginBottom: "8px",
                              }}
                            >
                              {item}
                            </p>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
