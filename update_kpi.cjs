const fs = require('fs');

let content = fs.readFileSync('src/components/KPICards.tsx', 'utf8');

content = content.replace(
  "title: 'Surveillance Field Submissions',",
  "title: t.kpiSurveillance,"
).replace(
  "subtext: `${zeroReports} zero-disease validations`",
  "subtext: `${zeroReports} ${t.kpiZeroDisease}`"
).replace(
  "title: 'Lab Confirmed vs Suspected',",
  "title: t.kpiLabConfirmed,"
).replace(
  "change: `${confirmationRatio}% Verified`,",
  "change: `${confirmationRatio}% ${t.kpiVerified}`,"
).replace(
  "badge: 'HRVL Diagnostic',",
  "badge: t.kpiHrvlDiagnostic,"
).replace(
  "subtext: 'Laboratory verified cases'",
  "subtext: t.kpiLabVerifiedCases"
).replace(
  "title: 'Active Outbreaks (Critical)',",
  "title: t.kpiActiveOutbreaks,"
).replace(
  "change: `${quarantineZonesCount} Quarantined`,",
  "change: `${quarantineZonesCount} ${t.kpiQuarantined}`,"
).replace(
  "badge: 'EMERGENCY ALERT',",
  "badge: t.kpiEmergencyAlert,"
).replace(
  "subtext: 'FMD, PPR, LSD, Newcastle, CBPP'",
  "subtext: t.kpiFmdPprLsd"
).replace(
  "title: 'Overall Case Fatality Rate',",
  "title: t.kpiOverallCfr,"
).replace(
  "change: totalDeaths > 50 ? 'Above WOAH Limit' : 'Within Threshold',",
  "change: totalDeaths > 50 ? t.kpiAboveLimit : t.kpiWithinThreshold,"
).replace(
  "badge: `${totalDeaths.toLocaleString()} Deaths`,",
  "badge: `${totalDeaths.toLocaleString()} ${t.kpiDeaths}`,"
).replace(
  "subtext: `Total animal cases: ${totalCases.toLocaleString()}`",
  "subtext: `${t.kpiTotalAnimalCases} ${totalCases.toLocaleString()}`"
).replace(
  "title: 'MEL Reporting Compliance',",
  "title: t.kpiMelReporting,"
).replace(
  "change: 'Target >= 80%',",
  "change: t.kpiTarget80,"
).replace(
  "badge: '36 Woredas',",
  "badge: t.kpiWoredas36,"
).replace(
  "subtext: 'Weekly submission completeness'",
  "subtext: t.kpiWeeklySubmission"
).replace(
  "title: 'Affected Woredas Ratio',",
  "title: t.kpiAffectedWoredas,"
).replace(
  "change: `${Math.round((activeWoredasCount / 36) * 100)}% Spread`,",
  "change: `${Math.round((activeWoredasCount / 36) * 100)}% ${t.kpiSpread}`,"
).replace(
  "badge: 'Spatial Index',",
  "badge: t.kpiSpatialIndex,"
).replace(
  "subtext: 'East (21) & West (15) Hararghe'",
  "subtext: t.kpiEastWestHararghe"
).replace(
  "HRVL Network Coverage",
  "{t.kpiNetworkCoverage}"
).replace(
  "MEL Compliance",
  "{t.kpiMelCompliance}"
).replace(
  "WAHO Benchmark: ≥80% weekly reporting completeness",
  "{t.kpiWahoBenchmark}"
).replace(
  "East Hararghe Zone",
  "{t.kpiEastZone}"
).replace(
  "Reporting Completeness",
  "{t.kpiReportingCompleteness}"
).replace(
  "High Density: Haramaya, Babile, Dadar, Girawa",
  "{t.kpiHighDensityEast}"
).replace(
  "West Hararghe Zone",
  "{t.kpiWestZone}"
).replace(
  "Reporting Completeness",
  "{t.kpiReportingCompleteness}"
).replace(
  "High Density: Chiro, Daro Lebu, Habro, Mieso",
  "{t.kpiHighDensityWest}"
);

// We need to replace the second "Reporting Completeness" because string replace only does first occurrence
content = content.replace(
  "Reporting Completeness",
  "{t.kpiReportingCompleteness}"
);

fs.writeFileSync('src/components/KPICards.tsx', content);
