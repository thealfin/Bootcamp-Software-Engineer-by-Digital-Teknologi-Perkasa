import { Link } from '@tanstack/react-router';
import {
  ArrowLeft,
  Envelope,
  FilePdf,
  Globe,
  Phone,
  Sparkle,
} from '@phosphor-icons/react';
import { useBootstrap } from '../../lib/api';

function getInitials(fullName: string): string {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function MentorProfilePage() {
  const { data, isLoading } = useBootstrap();

  if (isLoading || !data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mac-glass-card h-96 animate-pulse p-8" />
      </div>
    );
  }

  const { mentorProfile } = data;
  const initials = getInitials(mentorProfile.name) || 'AA';

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold text-[#111113] no-underline shadow-2xs transition-colors hover:bg-black/[0.04]"
        >
          <ArrowLeft size={14} weight="bold" />
          <span>Kembali ke Beranda</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF4D00]/10 px-3 py-1 text-xs font-bold tracking-wider text-[#FF4D00] uppercase">
          <Sparkle size={13} weight="fill" />
          Pengajar Utama &amp; Penyusun Kurikulum
        </span>
      </div>

      <section className="mac-glass-card overflow-hidden">
        <div className="border-b border-black/[0.07] bg-black/[0.02] px-6 py-5 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-[#111113] to-[#3F3F46] text-2xl font-extrabold text-white shadow-md">
                {initials}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-[#111113] sm:text-3xl">
                  {mentorProfile.name}
                </h1>
                <p className="mt-0.5 text-sm font-bold text-[#FF4D00]">
                  {mentorProfile.roleTitle}
                </p>
              </div>
            </div>
            <span className="rounded-full border border-black/10 bg-white px-3.5 py-1.5 font-mono text-xs font-semibold text-[#52525B]">
              {mentorProfile.company}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left Column: Identity, Specializations, Contacts */}
            <div className="lg:col-span-5">
              <div className="space-y-1.5 text-xs font-medium text-[#52525B] sm:text-sm">
                <p>
                  <strong className="text-[#111113]">Perusahaan:</strong> {mentorProfile.company}
                </p>
                <p>
                  <strong className="text-[#111113]">Divisi:</strong> {mentorProfile.division}
                </p>
              </div>

              <blockquote className="mt-5 rounded-2xl border-l-4 border-[#0071E3] bg-[#0071E3]/[0.06] px-4 py-3.5 text-sm italic leading-relaxed text-[#111113]">
                &ldquo;{mentorProfile.tagline}&rdquo;
              </blockquote>

              <div className="mt-6">
                <p className="text-[11px] font-bold tracking-wider text-[#8E8E93] uppercase">
                  Bidang Keahlian
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {mentorProfile.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-bold text-[#111113]"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact & Portfolio Links */}
              <div className="mt-6 space-y-2.5 border-t border-black/[0.07] pt-5">
                <p className="text-[11px] font-bold tracking-wider text-[#8E8E93] uppercase">
                  Portofolio dan Kontak
                </p>
                <div className="flex flex-wrap gap-2">
                  {mentorProfile.contacts.websites.map((site) => (
                    <a
                      key={site}
                      href={site}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-bold text-[#111113] no-underline transition-colors hover:border-[#0071E3] hover:text-[#0071E3]"
                    >
                      <Globe size={14} weight="bold" />
                      <span>{site.replace(/^https?:\/\//, '')}</span>
                    </a>
                  ))}
                  <a
                    href={mentorProfile.contacts.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#27C93F]/35 bg-[#27C93F]/12 px-3 py-1.5 text-xs font-bold text-[#146C24] no-underline transition-colors hover:bg-[#27C93F]/20"
                  >
                    <Phone size={14} weight="bold" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`mailto:${mentorProfile.contacts.email}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-bold text-[#111113] no-underline transition-colors hover:border-[#FF4D00] hover:text-[#FF4D00]"
                  >
                    <Envelope size={14} weight="bold" />
                    <span>{mentorProfile.contacts.email}</span>
                  </a>
                  <a
                    href={mentorProfile.contacts.cvUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#111113] px-3.5 py-1.5 text-xs font-bold text-white no-underline transition-colors hover:bg-[#FF4D00]"
                  >
                    <FilePdf size={14} weight="bold" />
                    <span>Unduh CV (PDF)</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Real-World Projects */}
            <div className="lg:col-span-7">
              <p className="text-[11px] font-bold tracking-wider text-[#8E8E93] uppercase">
                Studi Kasus Proyek Industri
              </p>
              <div className="mt-3 grid gap-3.5 sm:grid-cols-2">
                {mentorProfile.projects.map((project, idx) => (
                  <div
                    key={project.name}
                    className={`bento-mac-card p-4 ${
                      idx === 0 ? 'border-[#FF4D00]/25 bg-white sm:col-span-2' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-sm font-extrabold text-[#111113]">{project.name}</h2>
                      <span className="rounded-full bg-black/[0.05] px-2 py-0.5 font-mono text-[11px] font-bold text-[#52525B]">
                        {project.year}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-[#52525B]">
                      {project.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-[#F5F5F7] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#111113]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
