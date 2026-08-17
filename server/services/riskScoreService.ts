import { IProject, ProjectStatus } from '../types.ts';

export interface IRiskScoreCalculation {
  score: number; // 0.0 - 10.0
  riskLevel: 'Very High Confidence' | 'Good' | 'Moderate' | 'High Risk' | 'Critical Risk';
  factors: {
    ageFactor: { score: number; label: string; details: string };
    monitorConsensus: { score: number; label: string; details: string };
    returnSustainability: { score: number; label: string; details: string };
    communitySentiment: { score: number; label: string; details: string };
    statusPenalty: { score: number; label: string; details: string };
  };
  disclaimer: string;
}

export function calculateRiskScore(project: Partial<IProject>): IRiskScoreCalculation {
  // If status is terminal or problem, hard set base limits
  if (project.status === 'CLOSED') {
    return {
      score: 0.5,
      riskLevel: 'Critical Risk',
      factors: {
        ageFactor: { score: 1, label: 'Closed Status', details: 'Project has permanently ceased operations.' },
        monitorConsensus: { score: 0, label: 'Consensus 0%', details: 'All monitors report terminated status.' },
        returnSustainability: { score: 0, label: 'N/A', details: 'No active investment plans.' },
        communitySentiment: { score: 1, label: 'Negative', details: 'Historical close.' },
        statusPenalty: { score: -9.5, label: 'Terminated', details: 'Status is explicitly CLOSED.' },
      },
      disclaimer:
        'This score is an informational indicator generated from available project and monitoring data. It is not financial advice and does not guarantee future performance.',
    };
  }

  if (project.status === 'NOT PAID') {
    return {
      score: 1.2,
      riskLevel: 'Critical Risk',
      factors: {
        ageFactor: { score: 2, label: 'Defaulted', details: 'Confirmed payout defaults.' },
        monitorConsensus: { score: 0, label: 'Consensus 0%', details: 'Active scam / non-payment alerts.' },
        returnSustainability: { score: 0, label: 'Defunct', details: 'Payout requests failing.' },
        communitySentiment: { score: 1, label: 'Critical', details: 'Multiple scam reports.' },
        statusPenalty: { score: -8.8, label: 'Non-Paying', details: 'Status is explicitly NOT PAID.' },
      },
      disclaimer:
        'This score is an informational indicator generated from available project and monitoring data. It is not financial advice and does not guarantee future performance.',
    };
  }

  if (project.status === 'PROBLEM') {
    return {
      score: 3.5,
      riskLevel: 'High Risk',
      factors: {
        ageFactor: { score: 3, label: 'Degraded', details: 'Selective or delayed payments detected.' },
        monitorConsensus: { score: 3, label: 'Consensus Conflict', details: 'One or more monitors report delays.' },
        returnSustainability: { score: 3, label: 'Unstable', details: 'Cashflow volatility detected.' },
        communitySentiment: { score: 3, label: 'Complaints', details: 'Pending withdrawal tickets observed.' },
        statusPenalty: { score: -6.5, label: 'Problem Alert', details: 'Status flagged as PROBLEM.' },
      },
      disclaimer:
        'This score is an informational indicator generated from available project and monitoring data. It is not financial advice and does not guarantee future performance.',
    };
  }

  let base = 5.0;

  // 1. Age Factor (max +2.5, min -1.0)
  const days = project.lifetimeDays || 0;
  let ageScore = 0;
  let ageDetails = '';
  if (days < 7) {
    ageScore = -0.8;
    ageDetails = 'Brand new platform (<7 days). High early failure risk.';
  } else if (days < 30) {
    ageScore = 0.5;
    ageDetails = 'Operating for under 30 days. Moderate early track record.';
  } else if (days < 90) {
    ageScore = 1.5;
    ageDetails = 'Stable 1-3 month operational history.';
  } else if (days < 180) {
    ageScore = 2.0;
    ageDetails = 'Established platform exceeding 90 days with continuous reports.';
  } else {
    ageScore = 2.4;
    ageDetails = 'Veteran platform (>180 days) with long-term monitoring stability.';
  }

  // 2. Monitor Consensus (max +2.5, min -2.0)
  const monitors = project.monitorStatuses || [];
  let monScore = 0;
  let monDetails = '';
  if (monitors.length === 0) {
    monScore = 0;
    monDetails = 'No independent monitors linked yet.';
  } else {
    const payingCount = monitors.filter((m) => m.status === 'PAYING').length;
    const problemCount = monitors.filter((m) => m.status === 'PROBLEM' || m.status === 'NOT PAID').length;
    const ratio = payingCount / monitors.length;

    if (problemCount > 0) {
      monScore = -1.5;
      monDetails = `Divergence: ${problemCount} of ${monitors.length} monitors report delays/problems.`;
    } else if (ratio === 1.0 && monitors.length >= 3) {
      monScore = 2.2;
      monDetails = `Full unanimous consensus across ${monitors.length} independent monitors.`;
    } else if (ratio === 1.0) {
      monScore = 1.2;
      monDetails = `All ${monitors.length} linked monitors report PAYING.`;
    } else {
      monScore = 0.5;
      monDetails = `Partial monitoring verification (${payingCount}/${monitors.length} active).`;
    }
  }

  // 3. Return Sustainability Factor
  let returnScore = 0;
  let returnDetails = '';
  const plans = project.plans || [];
  if (plans.length > 0) {
    const dailyPlan = plans.find((p) => p.advertisedReturn.toLowerCase().includes('daily'));
    if (dailyPlan) {
      const match = dailyPlan.advertisedReturn.match(/([\d.]+)%/);
      const rate = match ? parseFloat(match[1]) : 2.5;
      if (rate > 5.0) {
        returnScore = -1.8;
        returnDetails = `Advertised rate of ${rate}% daily is mathematically unsustainable and carries extreme risk.`;
      } else if (rate > 3.0) {
        returnScore = -0.5;
        returnDetails = `Advertised rate of ${rate}% daily is high risk.`;
      } else if (rate <= 1.5) {
        returnScore = 1.2;
        returnDetails = `Conservative advertised rate (${rate}% daily) offers relatively higher sustainability.`;
      } else {
        returnScore = 0.4;
        returnDetails = `Standard speculative yield tier (${rate}% daily).`;
      }
    } else {
      returnScore = 0.2;
      returnDetails = 'Fixed duration investment plan structure.';
    }
  } else {
    returnDetails = 'Standard monitoring defaults.';
  }

  // 4. Community Sentiment / Rating (max +1.5, min -1.0)
  let sentimentScore = 0;
  let sentimentDetails = '';
  const rating = project.rating || 5.0;
  if (rating >= 8.5) {
    sentimentScore = 1.2;
    sentimentDetails = `High community score (${rating.toFixed(1)}/10) with verified payment proof.`;
  } else if (rating >= 7.0) {
    sentimentScore = 0.6;
    sentimentDetails = `Favorable community feedback (${rating.toFixed(1)}/10).`;
  } else if (rating < 5.0) {
    sentimentScore = -1.0;
    sentimentDetails = `Below-average user rating (${rating.toFixed(1)}/10).`;
  } else {
    sentimentScore = 0.1;
    sentimentDetails = `Neutral community ratings (${rating.toFixed(1)}/10).`;
  }

  let finalScore = base + ageScore + monScore + returnScore + sentimentScore;
  finalScore = Math.max(0.1, Math.min(9.8, finalScore)); // Cap at 9.8 max to never imply 100% guarantee!

  // Map to risk level
  let riskLevel: 'Very High Confidence' | 'Good' | 'Moderate' | 'High Risk' | 'Critical Risk' = 'Moderate';
  if (finalScore >= 9.0) riskLevel = 'Very High Confidence';
  else if (finalScore >= 7.0) riskLevel = 'Good';
  else if (finalScore >= 5.0) riskLevel = 'Moderate';
  else if (finalScore >= 3.0) riskLevel = 'High Risk';
  else riskLevel = 'Critical Risk';

  return {
    score: parseFloat(finalScore.toFixed(1)),
    riskLevel,
    factors: {
      ageFactor: { score: ageScore, label: 'Program Lifetime', details: ageDetails },
      monitorConsensus: { score: monScore, label: 'Monitor Consensus', details: monDetails },
      returnSustainability: { score: returnScore, label: 'Yield Sustainability', details: returnDetails },
      communitySentiment: { score: sentimentScore, label: 'Community Rating', details: sentimentDetails },
      statusPenalty: { score: 0, label: 'Operational Status', details: `Current status is ${project.status || 'PAYING'}.` },
    },
    disclaimer:
      'This score is an informational indicator generated from available project and monitoring data. It is not financial advice and does not guarantee future performance.',
  };
}
