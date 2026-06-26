import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageWrap } from "../components/index.jsx";
import { useLang } from "../context/LanguageContext.jsx";
import { TERMS, PRIVACY, COOKIES, ACCESSIBILITY, COMPANY } from "../data/legal.js";

/* Bilingual micro-copy for the legal pages themselves */
const UI = {
  en: {
    legal: "Legal",
    updated: "Last updated",
    contents: "Contents",
    download: "Download original (PDF)",
    view: "View bilingual original",
    note: "This page is available in English and Tiếng Việt — switch language using EN / VI in the top menu. In case of any discrepancy, the Vietnamese version of the contract prevails.",
    contactTitle: "Questions?",
    contactBody: "For any questions about these terms, contact us:",
    termsTitle: "Terms & Conditions",
    termsEyebrow: "Rental & Service Agreement",
    privacyTitle: "Privacy Policy",
    privacyEyebrow: "How we handle your data",
    cookiesTitle: "Cookie Policy",
    cookiesEyebrow: "How we use cookies",
    accessibilityTitle: "Accessibility",
    accessibilityEyebrow: "Our commitment to inclusive access",
    back: "← Back to home",
  },
  vi: {
    legal: "Pháp lý",
    updated: "Cập nhật lần cuối",
    contents: "Mục lục",
    download: "Tải bản gốc (PDF)",
    view: "Xem bản gốc song ngữ",
    note: "Trang này có sẵn bằng Tiếng Việt và English — đổi ngôn ngữ bằng EN / VI ở thanh menu trên cùng. Trong trường hợp có khác biệt, bản Tiếng Việt của hợp đồng được ưu tiên áp dụng.",
    contactTitle: "Có câu hỏi?",
    contactBody: "Mọi thắc mắc về điều khoản, vui lòng liên hệ:",
    termsTitle: "Điều Khoản & Điều Kiện",
    termsEyebrow: "Thỏa Thuận Thuê & Dịch Vụ",
    privacyTitle: "Chính Sách Bảo Mật",
    privacyEyebrow: "Cách chúng tôi xử lý dữ liệu của bạn",
    cookiesTitle: "Chính Sách Cookie",
    cookiesEyebrow: "Cách chúng tôi sử dụng cookie",
    accessibilityTitle: "Khả Năng Tiếp Cận",
    accessibilityEyebrow: "Cam kết về khả năng tiếp cận hòa nhập",
    back: "← Về trang chủ",
  },
};

const PDF_HREF = "/legal/HiLink-Terms-and-Conditions.pdf";

/* slug for anchor links */
const slug = (n) => `sec-${n}`;

function LegalLayout({ doc, kind }) {
  const { lang } = useLang();
  const t = UI[lang];
  const L = lang === "vi" ? "vi" : "en";
  const isTerms = kind === "terms";
  const titleByKind = { terms: t.termsTitle, privacy: t.privacyTitle, cookies: t.cookiesTitle, accessibility: t.accessibilityTitle };
  const eyebrowByKind = { terms: t.termsEyebrow, privacy: t.privacyEyebrow, cookies: t.cookiesEyebrow, accessibility: t.accessibilityEyebrow };
  const title = titleByKind[kind];
  const eyebrow = eyebrowByKind[kind];

  const goTo = (n) => {
    const el = document.getElementById(slug(n));
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: "smooth" });
  };

  return (
    <PageWrap>
      <div style={{ paddingTop: 64 }}>
        {/* ── Hero ── */}
        <section className="section-pad" style={{ background: "#1C1710", padding: "72px 48px 56px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "50%", right: "-80px", transform: "translateY(-50%)", width: 360, height: 360, background: "radial-gradient(circle, rgba(168,143,92,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative" }}>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 16 }}>{t.legal} · {eyebrow}</p>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(2.2rem,5vw,3.6rem)", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.05, marginBottom: 18 }}>
              {title}
            </motion.h1>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 24px" }}>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em" }}>
                {t.updated}: {doc.updated[L]}{isTerms ? ` · Ref ${TERMS.ref}` : ""}
              </span>
              {isTerms && (
                <a href={PDF_HREF} target="_blank" rel="noreferrer"
                  style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold)", textDecoration: "none", borderBottom: "1px solid var(--gold)", paddingBottom: 2 }}>
                  {t.download} ↗
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ── Body ── */}
        <section className="section-pad" style={{ background: "var(--bg)", padding: "56px 48px 88px" }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", gap: 56, alignItems: "flex-start" }}>

            {/* Table of contents (desktop) */}
            <aside className="hide-mob" style={{ width: 240, flexShrink: 0, position: "sticky", top: 88 }}>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 16 }}>{t.contents}</p>
              <nav style={{ display: "flex", flexDirection: "column", gap: 2, borderLeft: "1px solid var(--border)" }}>
                {doc.sections.map((s) => (
                  <button key={s.n} onClick={() => goTo(s.n)}
                    style={{ textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: "5px 0 5px 14px", marginLeft: -1, borderLeft: "1px solid transparent", fontFamily: "'Inter',sans-serif", fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.4, transition: "color 0.15s, border-color 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.borderLeftColor = "var(--gold)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-2)"; e.currentTarget.style.borderLeftColor = "transparent"; }}>
                    <span style={{ color: "var(--text-3)", marginRight: 6 }}>{s.n}</span>{s[L].title}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Article */}
            <article style={{ flex: 1, minWidth: 0, maxWidth: 760 }}>
              {/* Intro + language note */}
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, color: "var(--text-2)", lineHeight: 1.8, marginBottom: 24 }}>{doc.intro[L]}</p>
              <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderLeft: "3px solid var(--gold)", padding: "14px 18px", marginBottom: 48 }}>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: "var(--text-2)", lineHeight: 1.65, margin: 0 }}>{t.note}</p>
              </div>

              {doc.sections.map((s) => (
                <section key={s.n} id={slug(s.n)} style={{ marginBottom: 44, scrollMarginTop: 88 }}>
                  <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.3rem,2.6vw,1.7rem)", fontWeight: 400, color: "var(--text)", lineHeight: 1.2, marginBottom: 18, display: "flex", gap: 14, alignItems: "baseline" }}>
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, color: "var(--gold)", letterSpacing: "0.08em", flexShrink: 0, paddingTop: 4 }}>{s.n}</span>
                    {s[L].title}
                  </h2>
                  {s[L].body.map((para, i) => (
                    <p key={i} style={{ fontFamily: "'Inter',sans-serif", fontSize: 14.5, color: "var(--text-2)", lineHeight: 1.85, marginBottom: 14 }}>{para}</p>
                  ))}
                </section>
              ))}

              {/* Contact block */}
              <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--border)" }}>
                <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "1.3rem", fontWeight: 400, color: "var(--text)", marginBottom: 10 }}>{t.contactTitle}</h3>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "var(--text-2)", lineHeight: 1.7, marginBottom: 14 }}>{t.contactBody}</p>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "var(--text)", lineHeight: 1.9, margin: 0 }}>
                  {L === "vi" ? COMPANY.nameVi : COMPANY.name}<br />
                  {L === "vi" ? COMPANY.addressVi : COMPANY.address}<br />
                  {COMPANY.phone} · <a href={`mailto:${COMPANY.email}`} style={{ color: "var(--gold)", textDecoration: "none" }}>{COMPANY.email}</a> · {COMPANY.web}
                </p>
                <div style={{ marginTop: 28 }}>
                  <Link to="/" style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: "var(--text-3)", textDecoration: "none" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--gold)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-3)"}>
                    {t.back}
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </PageWrap>
  );
}

export const TermsPage = () => <LegalLayout doc={TERMS} kind="terms" />;
export const PrivacyPage = () => <LegalLayout doc={PRIVACY} kind="privacy" />;
export const CookiePage = () => <LegalLayout doc={COOKIES} kind="cookies" />;
export const AccessibilityPage = () => <LegalLayout doc={ACCESSIBILITY} kind="accessibility" />;
