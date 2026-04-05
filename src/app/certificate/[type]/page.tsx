import { CertificateClient } from "./certificate-client";

export function generateStaticParams() {
  return [
    { type: "foundation" },
    { type: "practitioner" },
    { type: "power-user" },
    { type: "expert" },
    { type: "full" },
  ];
}

export default function CertificatePage() {
  return <CertificateClient />;
}
