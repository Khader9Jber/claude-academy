"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Award, Download, Share2, Lock } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { useProgressStore } from "@/lib/store";
import { ARC_DEFINITIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const CERTIFICATE_CONFIG: Record<
  string,
  { title: string; description: string; requiredModules: string[]; color: string }
> = {
  foundation: {
    title: "Foundation Certificate",
    description: "Completed all Foundation arc modules",
    requiredModules: [
      "claude-fundamentals",
      "prompt-engineering",
      "claude-code-basics",
      "commands-and-navigation",
    ],
    color: "#5cb870",
  },
  practitioner: {
    title: "Practitioner Certificate",
    description: "Completed all Practitioner arc modules",
    requiredModules: [
      "claude-md-and-config",
      "session-and-context",
      "git-and-workflows",
      "mcp-fundamentals",
    ],
    color: "#5e9ed6",
  },
  "power-user": {
    title: "Power User Certificate",
    description: "Completed all Power User arc modules",
    requiredModules: [
      "hooks-and-automation",
      "agents-and-skills",
      "advanced-workflows",
    ],
    color: "#a07ed6",
  },
  expert: {
    title: "Expert Certificate",
    description: "Completed all Expert arc modules",
    requiredModules: ["enterprise-and-production", "capstone"],
    color: "#d4a053",
  },
  full: {
    title: "Claude Academy Master",
    description: "Completed every module in the curriculum",
    requiredModules: [
      "claude-fundamentals",
      "prompt-engineering",
      "claude-code-basics",
      "commands-and-navigation",
      "claude-md-and-config",
      "session-and-context",
      "git-and-workflows",
      "mcp-fundamentals",
      "hooks-and-automation",
      "agents-and-skills",
      "advanced-workflows",
      "enterprise-and-production",
      "capstone",
    ],
    color: "#d4a053",
  },
};

interface CertificateData {
  id: string;
  certificate_type: string;
  issued_at: string;
  certificate_number: string;
}

export function CertificateClient() {
  const router = useRouter();
  const params = useParams();
  const certType = params.type as string;
  const { user, loading: authLoading } = useAuth();
  const store = useProgressStore();

  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);

  const config = CERTIFICATE_CONFIG[certType];

  // Derive eligibility from store (no effect needed for computed state)
  const eligible = useMemo(() => {
    if (!config) return false;
    const completedSlugs = store.completedLessons;
    return config.requiredModules.every((moduleSlug) =>
      completedSlugs.some((slug) => slug.startsWith(moduleSlug + "/") || slug.includes(moduleSlug))
    );
  }, [config, store.completedLessons]);

  useEffect(() => {
    if (!config) {
      router.push("/progress");
      return;
    }

    if (authLoading) return;

    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Check if certificate already issued
    async function checkCertificate() {
      const supabase = createClient();
      const { data } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", user!.id)
        .eq("certificate_type", certType)
        .single();

      if (data) {
        setCertificate(data as CertificateData);
      } else if (eligible) {
        // Issue certificate
        const { data: newCert } = await supabase
          .from("certificates")
          .insert({ user_id: user!.id, certificate_type: certType })
          .select()
          .single();

        if (newCert) {
          setCertificate(newCert as CertificateData);
        }
      }

      setLoading(false);
    }

    checkCertificate();
  }, [user, authLoading, certType, config, eligible, router]);

  if (!config) return null;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  if (!eligible || !certificate) {
    const arc = ARC_DEFINITIONS.find((a) => a.id === certType);

    return (
      <div className="min-h-screen bg-background">
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
            <Lock className="h-16 w-16 mx-auto text-muted mb-6" />
            <h1
              data-testid="certificate-locked-heading"
              className="font-serif italic text-3xl text-foreground mb-4"
            >
              Certificate Locked
            </h1>
            <p className="text-muted mb-2">
              Complete all modules in the{" "}
              <strong style={{ color: config.color }}>
                {arc?.name ?? certType}
              </strong>{" "}
              arc to earn this certificate.
            </p>
            <p className="text-sm text-muted/60 mb-8">
              Required modules: {config.requiredModules.join(", ")}
            </p>
            <Button
              data-testid="certificate-locked-cta"
              onClick={() => router.push("/curriculum")}
            >
              Go to Curriculum
            </Button>
          </div>
        </section>
      </div>
    );
  }

  const userName =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    "Academy Learner";
  const issuedDate = new Date(certificate.issued_at).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="min-h-screen bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Certificate card */}
        <div
          data-testid="certificate-card"
          className="relative rounded-2xl border-2 bg-surface overflow-hidden"
          style={{ borderColor: config.color }}
        >
          {/* Decorative top bar */}
          <div
            className="h-2 w-full"
            style={{ backgroundColor: config.color }}
          />

          <div className="p-8 sm:p-12 text-center">
            {/* Icon */}
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: `${config.color}20` }}
            >
              <Award className="h-8 w-8" style={{ color: config.color }} />
            </div>

            {/* Title */}
            <p className="text-sm uppercase tracking-widest text-muted mb-2">
              Certificate of Completion
            </p>
            <h1
              data-testid="certificate-title"
              className="font-serif italic text-3xl sm:text-4xl text-foreground mb-4"
              style={{ color: config.color }}
            >
              {config.title}
            </h1>

            {/* Recipient */}
            <p className="text-muted mb-1">This certifies that</p>
            <p
              data-testid="certificate-name"
              className="font-serif italic text-2xl text-foreground mb-4"
            >
              {userName}
            </p>

            {/* Description */}
            <p className="text-muted mb-8">{config.description}</p>

            {/* Divider */}
            <div
              className="mx-auto w-24 h-px mb-8"
              style={{ backgroundColor: config.color }}
            />

            {/* Details */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 text-sm text-muted">
              <div>
                <span className="block font-medium text-foreground" data-testid="certificate-date">
                  {issuedDate}
                </span>
                Date Issued
              </div>
              <div>
                <span className="block font-medium text-foreground" data-testid="certificate-number">
                  {certificate.certificate_number}
                </span>
                Certificate ID
              </div>
            </div>

            {/* Claude Academy branding */}
            <div className="mt-10 pt-6 border-t border-border">
              <p className="font-serif italic text-lg text-accent">
                Claude Academy
              </p>
              <p className="text-xs text-muted mt-1">
                Master Claude from Zero to Hero
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center gap-3">
          <Button
            data-testid="certificate-share-btn"
            variant="outline"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `${config.title} - Claude Academy`,
                  text: `I earned the ${config.title} from Claude Academy!`,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button
            data-testid="certificate-download-btn"
            variant="outline"
            onClick={() => window.print()}
          >
            <Download className="h-4 w-4" />
            Print / Save PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
