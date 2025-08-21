const fs = require("fs");
const path = require("path");

// Load JSON files
function loadMarkingData() {
  const schemePath = path.join(__dirname, "marking-scheme.json");
  const resultsPath = path.join(__dirname, "marking-export.json");

  const scheme = JSON.parse(fs.readFileSync(schemePath, "utf8"));
  const results = JSON.parse(fs.readFileSync(resultsPath, "utf8"));

  return { scheme, results };
}

// Generate percentage score for judgement aspects
function getJudgementScore(actualScore, maxMark) {
  if (maxMark === 0) return 0;
  return Math.round((actualScore / maxMark) * 3); // Convert to 0-3 scale
}

// Generate percentage display
function getPercentage(actualScore, maxMark) {
  if (maxMark === 0) return "0%";
  const percentage = Math.round((actualScore / maxMark) * 100);
  return `${percentage}%`;
}

// Generate status badge
function getStatusBadge(actualScore, maxMark) {
  if (maxMark === 0) return "❌ Not Scored";
  const percentage = actualScore / maxMark;
  if (percentage >= 0.9) return "🟢 Excellent";
  if (percentage >= 0.7) return "🟡 Good";
  if (percentage >= 0.5) return "🟠 Needs Improvement";
  return "🔴 Poor";
}

// Generate judgement details for table
function getJudgementDetails(aspect, actualScore) {
  if (
    aspect.type !== "judgement" ||
    !aspect.judgementScoreDescription ||
    aspect.maxMark === 0
  ) {
    return "-";
  }

  const judgementScore = getJudgementScore(actualScore, aspect.maxMark);
  const achievedLevel = aspect.judgementScoreDescription[judgementScore];
  return `**Level ${judgementScore}/3:** ${achievedLevel}`;
}

// Generate markdown report with table format
function generateMarkdownReport() {
  const { scheme, results } = loadMarkingData();

  // Calculate total scores
  let totalActualScore = 0;
  let totalMaxScore = scheme.totalMark;

  // Flatten aspects with their scores
  const allAspects = [];
  let aspectIndex = 0;

  scheme.subCriterions.forEach((criterion, criterionIndex) => {
    criterion.aspects.forEach((aspect) => {
      const actualScore = results.marking[criterionIndex][aspectIndex] || 0;
      allAspects.push({ aspect, actualScore, criterionName: criterion.name });
      totalActualScore += actualScore;
      aspectIndex = (aspectIndex + 1) % results.marking[criterionIndex].length;
    });
    aspectIndex = 0; // Reset for next criterion
  });

  // Calculate WSOS section totals
  const wsosActualTotals = {};
  const wsosMaxTotals = {};

  allAspects.forEach(({ aspect, actualScore }) => {
    const section = aspect.wsosSection;
    wsosActualTotals[section] = (wsosActualTotals[section] || 0) + actualScore;
    wsosMaxTotals[section] = (wsosMaxTotals[section] || 0) + aspect.maxMark;
  });

  const overallPercentage = Math.round(
    (totalActualScore / totalMaxScore) * 100
  );

  let report = `# Module A - Static Website Design - Assessment Report (Table Format)

## 📊 Competitor

| Name             | Country Code |
| ---------------- | ------------ |
| Clever Competitor | HU          |

## 📊 Overall Score

**${totalActualScore.toFixed(
    2
  )} / ${totalMaxScore} points (${overallPercentage}%)**

${
  getStatusBadge(totalActualScore, totalMaxScore)
    .replace("🟢 ", "🟢 **")
    .replace("🟡 ", "🟡 **")
    .replace("🟠 ", "🟠 **")
    .replace("🔴 ", "🔴 **") + "**"
}

---

## 🎯 WSOS Section Breakdown

| Section | Description | Score | Max | Percentage | Status |
|---------|-------------|-------|-----|------------|---------|
`;

  // Add WSOS section rows
  Object.keys(scheme.wsosSections).forEach((sectionKey) => {
    const sectionNum = parseInt(sectionKey);
    const sectionName = scheme.wsosSections[sectionKey];
    const actualScore = wsosActualTotals[sectionNum] || 0;
    const maxScore = wsosMaxTotals[sectionNum] || 0;
    const percentage = getPercentage(actualScore, maxScore);
    const status = getStatusBadge(actualScore, maxScore);

    report += `| ${sectionNum} | ${sectionName} | ${actualScore.toFixed(
      2
    )} | ${maxScore} | ${percentage} | ${status} |\n`;
  });

  report += `\n---\n\n## 📋 Detailed Assessment\n\n`;

  // Generate detailed table for each criterion
  scheme.subCriterions.forEach((criterion, criterionIndex) => {
    report += `### ${criterion.name}\n\n`;

    // Table header
    report += `| Aspect | Type | WSOS | Score | Max | % | Status | Details/Judgement |\n`;
    report += `|--------|------|------|-------|-----|---|--------|-----------------|\n`;

    let criterionTotal = 0;
    let criterionMax = 0;

    criterion.aspects.forEach((aspect, aspectIndex) => {
      const actualScore = results.marking[criterionIndex][aspectIndex] || 0;
      criterionTotal += actualScore;
      criterionMax += aspect.maxMark;

      const percentage = getPercentage(actualScore, aspect.maxMark);
      const status = getStatusBadge(actualScore, aspect.maxMark);
      const typeIcon = aspect.type === "measurement" ? "📏 M" : "⚖️ J";
      const wsosSection = `${aspect.wsosSection}`;

      // Get details or judgement info
      let details = "";
      if (
        aspect.type === "judgement" &&
        aspect.judgementScoreDescription &&
        aspect.maxMark > 0
      ) {
        details = getJudgementDetails(aspect, actualScore);
      } else if (aspect.extraDescription) {
        details =
          aspect.extraDescription.length > 500
            ? aspect.extraDescription.substring(0, 47) + "..."
            : aspect.extraDescription;
      } else {
        details = "-";
      }

      report += `| ${
        aspect.description
      } | ${typeIcon} | ${wsosSection} | ${actualScore.toFixed(2)} | ${
        aspect.maxMark
      } | ${percentage} | ${status} | ${details} |\n`;
    });

    const criterionPercentage = getPercentage(criterionTotal, criterionMax);
    const criterionStatus = getStatusBadge(criterionTotal, criterionMax);

    report += `\n**${criterion.name} Total**: ${criterionTotal.toFixed(
      2
    )} / ${criterionMax} points (${criterionPercentage}) ${criterionStatus}\n\n`;
    report += `---\n\n`;
  });

  // Add complete aspect details table
  report += `## 📊 Complete Assessment Overview\n\n`;
  report += `| Criterion | Aspect | Type | WSOS | Score | Max | % | Status |\n`;
  report += `|-----------|--------|------|------|-------|-----|---|--------|\n`;

  allAspects.forEach(({ aspect, actualScore, criterionName }) => {
    const percentage = getPercentage(actualScore, aspect.maxMark);
    const status = getStatusBadge(actualScore, aspect.maxMark);
    const typeIcon = aspect.type === "measurement" ? "📏" : "⚖️";

    const shortCriterion =
      criterionName.length > 25
        ? criterionName.substring(0, 22) + "..."
        : criterionName;
    const shortAspect =
      aspect.description.length > 35
        ? aspect.description.substring(0, 32) + "..."
        : aspect.description;

    report += `| ${shortCriterion} | ${shortAspect} | ${typeIcon} | ${
      aspect.wsosSection
    } | ${actualScore.toFixed(2)} | ${
      aspect.maxMark
    } | ${percentage} | ${status} |\n`;
  });

  // Add performance summary
  report += `\n---\n\n## 🎯 Performance Summary\n\n`;

  if (overallPercentage >= 90) {
    report += `🎉 **Outstanding Performance!** The submission demonstrates exceptional quality across all assessment criteria.\n\n`;
  } else if (overallPercentage >= 70) {
    report += `👍 **Good Performance!** The submission meets most requirements with room for minor improvements.\n\n`;
  } else if (overallPercentage >= 50) {
    report += `⚠️ **Needs Improvement** The submission addresses basic requirements but has several areas that need attention.\n\n`;
  } else {
    report += `🚨 **Significant Issues** The submission has major gaps that need to be addressed.\n\n`;
  }

  // Add quick improvement table
  report += `### 📈 Priority Improvements\n\n`;
  const lowScoringAspects = allAspects
    .filter(({ aspect, actualScore }) => {
      const percentage = actualScore / aspect.maxMark;
      return aspect.maxMark > 0 && percentage < 0.7;
    })
    .sort(
      (a, b) =>
        a.actualScore / a.aspect.maxMark - b.actualScore / b.aspect.maxMark
    )
    .slice(0, 10); // Top 10 priority items

  if (lowScoringAspects.length === 0) {
    report += `| Status |\n|--------|\n| ✅ All aspects performing well! |\n\n`;
  } else {
    report += `| Priority | Aspect | Current % | Impact | WSOS Section |\n`;
    report += `|----------|--------|-----------|--------|--------------|\n`;

    lowScoringAspects.forEach(({ aspect, actualScore }, index) => {
      const percentage = getPercentage(actualScore, aspect.maxMark);
      const impact =
        aspect.maxMark >= 1 ? "High" : aspect.maxMark >= 0.5 ? "Medium" : "Low";
      const shortAspect =
        aspect.description.length > 30
          ? aspect.description.substring(0, 27) + "..."
          : aspect.description;

      report += `| ${
        index + 1
      } | ${shortAspect} | ${percentage} | ${impact} | ${
        aspect.wsosSection
      } |\n`;
    });
    report += `\n`;
  }

  // Add strengths table
  report += `### 💪 Top Strengths\n\n`;
  const highScoringAspects = allAspects
    .filter(({ aspect, actualScore }) => {
      const percentage = actualScore / aspect.maxMark;
      return aspect.maxMark > 0 && percentage >= 0.9;
    })
    .sort((a, b) => b.aspect.maxMark - a.aspect.maxMark)
    .slice(0, 8); // Top 8 strengths

  if (highScoringAspects.length === 0) {
    report += `| Status |\n|--------|\n| ⚠️ Focus on improving overall performance |\n\n`;
  } else {
    report += `| Aspect | Score | WSOS Section |\n`;
    report += `|--------|-------|--------------|\n`;

    highScoringAspects.forEach(({ aspect, actualScore }) => {
      const shortAspect =
        aspect.description.length > 40
          ? aspect.description.substring(0, 37) + "..."
          : aspect.description;

      report += `| ${shortAspect} | ${actualScore.toFixed(2)}/${
        aspect.maxMark
      } | ${aspect.wsosSection} |\n`;
    });
    report += `\n`;
  }

  report += `---\n\n`;
  report += `*Report generated on ${new Date().toISOString().split("T")[0]}*\n`;

  return report;
}

// Main execution
function main() {
  try {
    const report = generateMarkdownReport();
    const outputPath = path.join(__dirname, "assessment-report-table.md");

    fs.writeFileSync(outputPath, report, "utf8");

    console.log("✅ Table-format assessment report generated successfully!");
    console.log(`📄 Report saved to: ${outputPath}`);

    // Also log a summary to console
    const { scheme, results } = loadMarkingData();
    let totalScore = 0;
    results.marking.forEach((criterion) => {
      criterion.forEach((score) => (totalScore += score));
    });

    const percentage = Math.round((totalScore / scheme.totalMark) * 100);
    console.log(
      `📊 Overall Score: ${totalScore.toFixed(2)}/${
        scheme.totalMark
      } (${percentage}%)`
    );
  } catch (error) {
    console.error("❌ Error generating report:", error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { generateMarkdownReport, loadMarkingData };
