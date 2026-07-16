import React from 'react';
import Head from 'next/head';
import { PageMeta } from '@/components/feature-card';
import { Heart, Zap, Coffee, Check, ExternalLink } from 'lucide-react';

const TIERS = [
  {
    name: 'Hobbyist',
    price: '$5',
    period: 'month',
    icon: Coffee,
    color: 'var(--brand-orange)',
    bg: 'rgba(255, 107, 53, 0.05)',
    border: 'rgba(255, 107, 53, 0.15)',
    description: 'Get the GitHub Sponsor badge and officially become part of the people powering this work.',
    subDescription: 'Your support helps me spend more time building and less time worrying about everything else.',
    features: [],
    buttonText: 'Become a Sponsor',
    link: 'https://github.com/sponsors/Vamshavardhan50',
  },
  {
    name: 'Professional',
    price: '$25',
    period: 'month',
    icon: Zap,
    color: 'var(--brand-indigo)',
    bg: 'rgba(99, 102, 241, 0.05)',
    border: 'rgba(99, 102, 241, 0.15)',
    description: 'You’re doing more than just supporting - you’re becoming part of the project’s identity.',
    subDescription: 'At this tier:',
    features: [
      'Your name or logo goes directly into the README of my main repositories.',
      'You’ll get priority review on your issues, because your voice carries extra weight.',
      'You’re helping cover the actual infrastructure and API costs that keep these tools running.',
      'It’s a serious way to show you believe in what we’re building here.',
    ],
    buttonText: 'Support Professional',
    link: 'https://github.com/sponsors/Vamshavardhan50',
    popular: true,
  },
];

export default function SponsorPage() {
  return (
    <>
      <Head>
        <title>Sponsor Crawlingo — Self-Healing Web Scraping Framework</title>
        <meta name="description" content="Support the development of Crawlingo. Choose a sponsorship tier to help maintain our self-healing DOM engine, proxy pools, and SDKs." />
      </Head>

      <PageMeta
        title="Sponsor the Project"
        description="Crawlingo is a free, open-source framework under the MIT License. Sponsorship helps fund development, testing infrastructure, and community support."
        readingTime="2 min"
        lastUpdated="July 2026"
        githubPath=".github/FUNDING.yml"
      />

      <div className="space-y-12 py-4">
        {/* Intro Section */}
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 h-36 w-36 rounded-full bg-[var(--brand-orange)] opacity-5 blur-2xl"></div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="rounded-full bg-red-500/10 p-4 text-[var(--brand-orange)] flex-shrink-0">
              <Heart className="h-8 w-8 fill-current" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2 text-[var(--foreground)]">Why Sponsor Crawlingo?</h2>
              <p className="text-[var(--foreground-muted)] text-sm leading-relaxed max-w-xl">
                Building a reliable, stealth-compliant, and self-healing scraper takes constant maintenance to keep up with browser changes, web standards, and bot detection systems. Your backing ensures the project remains active, robust, and free for developers worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div id="sponsor-tiers" className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8">
          {TIERS.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.name}
                className="relative flex flex-col justify-between rounded-2xl border transition-all duration-300 hover:-translate-y-1 p-6"
                style={{
                  backgroundColor: tier.bg,
                  borderColor: tier.popular ? 'var(--brand-orange)' : tier.border,
                  boxShadow: tier.popular ? '0 4px 20px rgba(255, 107, 53, 0.05)' : 'none',
                }}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--brand-orange)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Most Popular
                  </div>
                )}

                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-[var(--foreground-muted)] tracking-wide uppercase">
                      {tier.name}
                    </span>
                    <Icon className="h-5 w-5" style={{ color: tier.color }} />
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold tracking-tight text-[var(--foreground)]">
                      {tier.price}
                    </span>
                    <span className="text-xs text-[var(--foreground-subtle)] ml-1">
                      /{tier.period}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[var(--foreground-muted)] leading-relaxed mb-4">
                    {tier.description}
                  </p>

                  {tier.subDescription && (
                    <p className="text-xs text-[var(--foreground-muted)] leading-relaxed mb-6 font-medium">
                      {tier.subDescription}
                    </p>
                  )}

                  {tier.features && tier.features.length > 0 && (
                    <>
                      <hr className="border-[var(--border)]/60 my-4" />
                      {/* Features */}
                      <ul className="space-y-3 mb-6">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                {/* Call to Action Button */}
                <a
                  href={tier.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-semibold text-center transition-all duration-200 border"
                  style={{
                    backgroundColor: tier.popular ? 'var(--brand-orange)' : 'transparent',
                    borderColor: tier.popular ? 'var(--brand-orange)' : 'var(--border-strong)',
                    color: tier.popular ? 'white' : 'var(--foreground)',
                  }}
                >
                  {tier.buttonText}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            );
          })}
        </div>

        {/* Corporate Message */}
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center bg-transparent">
          <h3 className="text-base font-semibold text-[var(--foreground)] mb-2">Need a Custom Sponsorship Level or Invoicing?</h3>
          <p className="text-xs text-[var(--foreground-muted)] max-w-lg mx-auto mb-4">
            If your organization relies on Crawlingo and needs a custom support package, enterprise FFI licensing, or invoice-based payments, feel free to contact us privately.
          </p>
          <a
            href="mailto:sponsors@crawlingo.dev"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--brand-orange)] hover:underline"
          >
            Get in touch with maintainers
          </a>
        </div>
      </div>
    </>
  );
}
