// scripts/seedClusters.js
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  try {
    const p = path.join(process.cwd(), "config/ai/clusters_v1_adjusted.json");
    const clusters = JSON.parse(fs.readFileSync(p, "utf8"));

    for (const c of clusters) {
      await prisma.cluster.upsert({
        where: { slug: c.id },
        update: {
          label: c.label,
          blurb: c.blurb ?? null,
          emoji: c.visuals?.emoji ?? null,
          accentColor: c.visuals?.accent_color ?? c.visuals?.accentColor ?? null,
          priority: c.priority ?? 0,
          autoJoin: c.join_logic?.auto_join ?? false,
          unlockRules: c.unlock_rules ?? {},
          joinLogic: c.join_logic ?? {},
          activeHours: c.active_membership?.active_window_hours ?? 24,
          homeFeed: c.home_feed ?? {},
          moderation: c.moderation ?? {},
          analytics: c.analytics ?? {}
        },
        create: {
          slug: c.id,
          label: c.label,
          blurb: c.blurb ?? null,
          emoji: c.visuals?.emoji ?? null,
          accentColor: c.visuals?.accent_color ?? c.visuals?.accentColor ?? null,
          priority: c.priority ?? 0,
          autoJoin: c.join_logic?.auto_join ?? false,
          unlockRules: c.unlock_rules ?? {},
          joinLogic: c.join_logic ?? {},
          activeHours: c.active_membership?.active_window_hours ?? 24,
          homeFeed: c.home_feed ?? {},
          moderation: c.moderation ?? {},
          analytics: c.analytics ?? {}
        }
      });
    }

    const count = await prisma.cluster.count();
    console.log(`✅ Seed complete. Cluster count: ${count}`);
  } catch (e) {
    console.error("Seed failed:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
