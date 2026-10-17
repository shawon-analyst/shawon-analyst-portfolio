import { ImageResponse } from "next/og";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.role} Portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0B1220",
          padding: "64px 72px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -160,
            width: 620,
            height: 620,
            borderRadius: 620,
            background: "radial-gradient(circle, rgba(59,130,246,0.55) 0%, rgba(11,18,32,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -260,
            left: -120,
            width: 520,
            height: 520,
            borderRadius: 520,
            background: "radial-gradient(circle, rgba(34,211,238,0.35) 0%, rgba(11,18,32,0) 70%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #3B82F6, #22D3EE)",
              color: "#0B1220",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            MI
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#F8FAFC", fontSize: 26, fontWeight: 600 }}>{site.name}</span>
            <span style={{ color: "#94A3B8", fontSize: 20 }}>{site.role}</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <span
            style={{
              color: "#F8FAFC",
              fontSize: 60,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              maxWidth: 980,
            }}
          >
            Dashboards that turn messy data into decisions.
          </span>
          <span style={{ color: "#94A3B8", fontSize: 28, maxWidth: 900 }}>
            Power BI · Advanced Excel · SQL (PostgreSQL) · Python
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#94A3B8", fontSize: 22 }}>{site.url.replace(/^https?:\/\//, "")}</span>
          <span style={{ color: "#22D3EE", fontSize: 22, fontWeight: 600 }}>
            {projects.length} featured case studies
          </span>
        </div>
      </div>
    ),
    size,
  );
}
