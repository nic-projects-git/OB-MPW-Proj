const app = document.getElementById("app");
const modalRoot = document.getElementById("modalRoot");
const headerRolesButton = document.getElementById("headerRolesButton");
const headerResetButton = document.getElementById("headerResetButton");
const SCENARIO_TIMER_SECONDS = 35;
let scenarioTimerId = null;

// EDIT INDUSTRIES HERE
const industries = {
  event: {
    id: "event",
    name: "Event / Experience Brand",
    summary: "Premium live moments with visible execution pressure and fast-moving stakeholder expectations.",
    intro(companyName) {
      return [
        `${companyName} has built a reputation for high-impact premium experiences that generate enormous buzz in a short amount of time.`,
        "The next flagship launch is attracting demand, attention, and partner pressure faster than the operating system can absorb it.",
        "Momentum looks impressive from the outside, but vendor coordination, venue flow, and attendee readiness are starting to feel fragile beneath the surface."
      ];
    },
    terms: {
      operatingCore: "vendor coordination, venue flow, and attendee logistics",
      frontline: "event crews and vendor leads",
      audience: "attendees",
      reputationGroup: "attendees, partners, and sponsors",
      scaleAsset: "the experience footprint",
      publicOffer: "the premium launch experience",
      comebackIdentity: "a disciplined premium experience brand"
    }
  },
  fashion: {
    id: "fashion",
    name: "Fashion / Merchandise Brand",
    summary: "A viral drop machine balancing desirability, production strain, fulfillment quality, and brand credibility.",
    intro(companyName) {
      return [
        `${companyName} has become a fast-rising name in culture-driven fashion, with every flagship drop creating more anticipation than the last.`,
        "Demand is surging, the brand story is hot, and expectations around the next release are escalating across channels and partners.",
        "Behind that excitement, production discipline, fulfillment reliability, and quality control are becoming harder to keep aligned."
      ];
    },
    terms: {
      operatingCore: "suppliers, manufacturing, fulfillment, and quality control",
      frontline: "ops, production, and fulfillment teams",
      audience: "customers",
      reputationGroup: "customers, creators, and retail partners",
      scaleAsset: "the drop size and SKU complexity",
      publicOffer: "the flagship collection drop",
      comebackIdentity: "a sharper, more disciplined merchandise brand"
    }
  },
  coffee: {
    id: "coffee",
    name: "Coffee / Consumer Brand",
    summary: "A fast-expanding consumer brand balancing store growth, supplier strain, and consistent customer experience.",
    intro(companyName) {
      return [
        `${companyName} is expanding quickly, with strong campaign energy and growing customer demand across multiple locations.`,
        "Leadership has pushed the brand into a defining growth moment, and each new opening is raising the pressure to keep the story moving.",
        "At the same time, supplier strain, store readiness, and service consistency are becoming more unstable than the headline growth suggests."
      ];
    },
    terms: {
      operatingCore: "supplier capacity, store readiness, and service consistency",
      frontline: "store teams and operating managers",
      audience: "customers",
      reputationGroup: "customers, staff, and local partners",
      scaleAsset: "the rollout pace across stores",
      publicOffer: "the expansion rollout",
      comebackIdentity: "a more reliable consumer growth brand"
    }
  },
  tech: {
    id: "tech",
    name: "Tech Startup",
    summary: "A high-visibility product launch under pressure from engineering readiness, infrastructure stability, and user trust.",
    intro(companyName) {
      return [
        `${companyName} has captured serious attention as a fast-moving startup, and the next major release is being framed as a breakout moment.`,
        "The market story is strong, investors are watching, and the team feels pressure to translate momentum into visible scale.",
        "But product stability, infrastructure readiness, and support capacity are less mature than the launch narrative implies."
      ];
    },
    terms: {
      operatingCore: "engineering readiness, infrastructure stability, and support capacity",
      frontline: "product, engineering, and support teams",
      audience: "users",
      reputationGroup: "users, employees, and investors",
      scaleAsset: "the rollout footprint and feature scope",
      publicOffer: "the major product release",
      comebackIdentity: "a more disciplined and trustworthy product company"
    }
  }
};

// EDIT TEAM ROLES HERE
const roles = [
  {
    id: "coordinator",
    name: "Coordinator",
    description: "Aligns the team, clarifies priorities, and turns competing viewpoints into a decision path.",
    strength: "Creates shared focus when the room is fragmented or rushing.",
    blindSpot: "Can force closure too early if alignment becomes more important than challenge.",
    prompt: "What is the real issue we must solve now?"
  },
  {
    id: "contributor",
    name: "Contributor",
    description: "Pushes ideas, urgency, momentum, and the confidence to act under pressure.",
    strength: "Keeps the organization moving when hesitation could stall opportunity.",
    blindSpot: "Can overvalue speed, visibility, and action without enough restraint.",
    prompt: "What action keeps us moving?"
  },
  {
    id: "contractor",
    name: "Contractor",
    description: "Translates ambition into deliverables, execution plans, and practical next steps.",
    strength: "Brings structure, action, and operational realism to messy moments.",
    blindSpot: "Can keep building toward the wrong target if assumptions stay unchallenged.",
    prompt: "What is realistically deliverable?"
  },
  {
    id: "critic",
    name: "Critic",
    description: "Questions assumptions, spots weak logic, and identifies the risks others are normalizing.",
    strength: "Protects the team from blind enthusiasm and preventable mistakes.",
    blindSpot: "May be sidelined when the culture treats challenge as negativity.",
    prompt: "What are we overlooking?"
  },
  {
    id: "calibrator",
    name: "Calibrator",
    description: "Checks balance, sustainability, control, and the longer-term impact of today's choices.",
    strength: "Protects viability when growth pressure is pushing the system off center.",
    blindSpot: "Can sound cautious in environments that reward urgency over discipline.",
    prompt: "What long-term or system risk are we ignoring?"
  },
  {
    id: "communicator",
    name: "Communicator",
    description: "Protects trust, clarity, morale, inclusion, and how decisions land across stakeholders.",
    strength: "Keeps confidence from collapsing when stress and uncertainty rise.",
    blindSpot: "Can be dismissed when leaders reduce communication to optics instead of relationship.",
    prompt: "How will this affect trust and morale?"
  }
];

// EDIT SCENARIOS HERE
const scenarios = [
  {
    id: "collapse-1",
    phase: "collapse",
    title: "Hype Outpaces Readiness",
    timeline: "T-7 Days",
    breakingUpdate: "Social buzz rising",
    pressureNote: "The loudest voices in the room want to protect excitement. Critic and Calibrator perspectives are easy to wave off as slowing the moment.",
    description: {
      event: "The premium experience launch is taking off online, but on-ground readiness is weaker than the campaign implies. Demand is rising faster than the delivery system.",
      fashion: "The flagship collection drop is gaining huge attention, but production and fulfillment are falling behind the story. The brand looks ready before the system is ready.",
      coffee: "Expansion momentum is accelerating, but store readiness and quality consistency are slipping across the rollout. The campaign is moving faster than the operating reality.",
      tech: "Launch buzz is strong, but the product and systems are not stable enough for the incoming traffic. The story of scale is outpacing technical readiness."
    },
    options: [
      {
        label: "Keep the narrative hot and patch gaps in motion",
        copy: "Protect demand, stay on schedule, and trust teams to solve problems live as pressure rises.",
        lens: "Momentum first",
        dominantRoles: ["Contributor", "Contractor"],
        effects: { momentum: 2, trust: -1, control: -2, viability: -1 },
        consequence(industry) {
          return `The story around ${industry.terms.publicOffer} gets even louder, but ${industry.terms.frontline} begin improvising around missing guardrails. Energy rises faster than control.`;
        }
      },
      {
        label: "Slow the headline moment and stabilize core readiness",
        copy: "Accept a colder narrative now in order to reinforce the operating core before pressure peaks.",
        lens: "Control before optics",
        dominantRoles: ["Critic", "Calibrator", "Coordinator"],
        effects: { momentum: -1, trust: 1, control: 2, viability: 1 },
        consequence(industry) {
          return `Some excitement cools, but the team finally has room to reinforce ${industry.terms.operatingCore}. The organization feels steadier even as the hype dips.`;
        }
      },
      {
        label: "Narrow the promise and communicate a tighter launch scope",
        copy: "Keep the moment alive, but reduce exposure and set clearer boundaries around what will actually be delivered.",
        lens: "Focused compromise",
        dominantRoles: ["Coordinator", "Communicator", "Contractor"],
        effects: { momentum: 0, trust: 1, control: 1, viability: 1 },
        consequence(industry) {
          return "The market hears a more measured promise. It is less thrilling, but the team regains some discipline and can deliver a more believable version of the plan.";
        }
      }
    ]
  },
  {
    id: "collapse-2",
    phase: "collapse",
    title: "Vendor / Production / Scaling Strain",
    timeline: "T-5 Days",
    breakingUpdate: "Operational strain increasing",
    pressureNote: "Execution pressure is intensifying. The group is tempted to equate commitment with forcing the original scale through anyway.",
    description: {
      event: "Key vendors are stretched, venue logistics are slipping, and the attendee flow plan is showing cracks. The original launch scope now looks heavier than the system can carry.",
      fashion: "Suppliers and fulfillment partners are hitting their limits, and quality checks are getting thinner. The original drop plan is beginning to overload the production system.",
      coffee: "Supplier pressure is rising, store teams are unevenly trained, and rollout consistency is weakening. The expansion pace is starting to outrun what operations can support.",
      tech: "Infrastructure load testing is exposing weak points, support coverage is thin, and engineering is working around the clock. The original release scope is heavier than the system can sustain."
    },
    options: [
      {
        label: "Hold the original scale and push teams to deliver",
        copy: "Signal confidence by refusing to cut scope, even if it means squeezing the system harder.",
        lens: "Commit harder",
        dominantRoles: ["Contributor", "Contractor"],
        effects: { momentum: 1, trust: -1, control: -2, viability: -1 },
        consequence(industry) {
          return `The organization keeps its bold posture, but ${industry.terms.frontline} absorb the pressure through overtime and workarounds. Resilience starts turning into strain.`;
        }
      },
      {
        label: "Cut complexity fast and protect reliable delivery",
        copy: "Reduce the load now so the system can perform what remains with far fewer cracks.",
        lens: "Viability first",
        dominantRoles: ["Calibrator", "Contractor", "Coordinator"],
        effects: { momentum: -1, trust: 1, control: 2, viability: 1 },
        consequence() {
          return "The plan becomes less flashy, but the team can finally protect the pieces it still intends to deliver. Reliability begins to matter more than volume.";
        }
      },
      {
        label: "Bring partners into a transparent re-plan",
        copy: "Open the real constraints, reset commitments, and rebuild a workable version of the launch together.",
        lens: "Shared reset",
        dominantRoles: ["Communicator", "Coordinator", "Critic"],
        effects: { momentum: -1, trust: 2, control: 1, viability: 0 },
        consequence() {
          return "Some stakeholders are unsettled by the honesty, but the conversation becomes more real. The team gains credibility even before performance fully recovers.";
        }
      }
    ]
  },
  {
    id: "collapse-3",
    phase: "collapse",
    title: "Internal Red Flag",
    timeline: "T-72 Hours",
    breakingUpdate: "Internal concern spreading",
    pressureNote: "This is the moment when warning signs either get surfaced properly or rationalized away in the name of staying focused.",
    description: {
      event: "Crew leads are raising concerns about burnout, readiness gaps, and inconsistent contingency planning. The warning is internal for now, but the pattern is widening.",
      fashion: "Team members are flagging quality shortcuts, fulfillment risk, and rising exhaustion. The issue is still internal, but it points to a deeper operating problem.",
      coffee: "Store managers and support teams are raising concerns about training gaps, inconsistent execution, and mounting fatigue. The signal is internal, but it is getting harder to ignore.",
      tech: "Engineers and support leads are warning about unresolved defects, unstable systems, and team exhaustion. The red flag has not gone public yet, but the risk is escalating."
    },
    options: [
      {
        label: "Handle it quietly and keep the launch story intact",
        copy: "Treat the concerns as a morale issue, make a few targeted fixes, and avoid widening the discussion.",
        lens: "Contain and continue",
        dominantRoles: ["Contractor", "Contributor"],
        effects: { momentum: 1, trust: -2, control: -1, viability: -1 },
        consequence() {
          return "The issue stays quieter for a moment, but people notice that speaking up changes very little. Trust inside the system takes a deeper hit than the leadership team expected.";
        }
      },
      {
        label: "Pause, investigate, and protect the people raising concern",
        copy: "Surface the signal fully, slow decisions, and use it to challenge what the organization has been normalizing.",
        lens: "Listen before damage spreads",
        dominantRoles: ["Critic", "Communicator", "Calibrator"],
        effects: { momentum: -1, trust: 2, control: 2, viability: 1 },
        consequence() {
          return "The room feels the tension of slowing down, but the team starts addressing the real problem instead of its symptoms. People become more willing to tell the truth.";
        }
      },
      {
        label: "Fix the most visible issue and give a limited acknowledgement",
        copy: "Address the obvious problem, but keep the response narrow so momentum is not heavily disrupted.",
        lens: "Partial correction",
        dominantRoles: ["Coordinator", "Contractor", "Communicator"],
        effects: { momentum: 0, trust: 1, control: 1, viability: 0 },
        consequence() {
          return "The team buys some breathing room, but not full confidence. The organization has improved the surface without fully resolving the pattern underneath.";
        }
      }
    ]
  },
  {
    id: "collapse-4",
    phase: "collapse",
    title: "Public Crack",
    timeline: "Release Day",
    breakingUpdate: "Stakeholder confidence unstable",
    pressureNote: "The breakdown is now visible. Momentum still matters, but trust and control are no longer abstract issues. The team has to decide what kind of response it will become known for.",
    description: {
      event: "Guests, partners, and online observers are now seeing delays, confusion, and uneven delivery in real time. The launch has become publicly unstable.",
      fashion: "Customers are posting delayed orders, quality complaints, and fulfillment failures. The drop is now visibly cracking in public view.",
      coffee: "Customers are encountering inconsistent experiences, overloaded locations, and rollout failures that are spreading quickly online. The expansion story is visibly breaking.",
      tech: "Users are hitting outages, defects, and overloaded support channels, and backlash is spreading publicly. The release has become a visible failure event."
    },
    options: [
      {
        label: "Defend the launch and keep pushing through",
        copy: "Frame the situation as a rough patch, protect the headline, and keep the system moving publicly.",
        lens: "Protect the image",
        dominantRoles: ["Contributor", "Communicator"],
        effects: { momentum: 1, trust: -2, control: -2, viability: -2 },
        consequence() {
          return "The leadership message sounds confident, but the gap between words and lived reality becomes obvious. The organization keeps moving while confidence starts collapsing.";
        }
      },
      {
        label: "Acknowledge failure, pause the rollout, and compensate affected people",
        copy: "Accept a visible hit now in order to protect the organization from a deeper spiral later.",
        lens: "Trust repair over pride",
        dominantRoles: ["Communicator", "Calibrator", "Critic"],
        effects: { momentum: -2, trust: 2, control: 2, viability: 1 },
        consequence() {
          return "The short-term damage is unmistakable, but the team begins regaining legitimacy by responding like adults to a real breakdown.";
        }
      },
      {
        label: "Issue a partial apology while trying to preserve pace",
        copy: "Offer some accountability, but avoid a full pause in hopes that the problem remains manageable.",
        lens: "Manage the optics",
        dominantRoles: ["Coordinator", "Communicator", "Contractor"],
        effects: { momentum: -1, trust: 0, control: 0, viability: 0 },
        consequence() {
          return "The response sounds measured, but it leaves people unsure whether the company truly understands the depth of the problem. The system survives the moment, but not cleanly.";
        }
      }
    ]
  },
  {
    id: "recovery-1",
    phase: "recovery",
    title: "Leadership Reset",
    timeline: "Week 1",
    breakingUpdate: "Recovery window opening",
    pressureNote: "Recovery starts with leadership design, not just effort. This phase rewards balance much more than raw momentum.",
    description: {
      event: "The launch has broken trust internally and externally. Before anything else, the team needs a new way to lead through repair rather than adrenaline.",
      fashion: "The failed drop exposed leadership habits that prized velocity over discipline. Recovery now depends on resetting how decisions get made.",
      coffee: "The expansion breakdown has exposed weak coordination and uneven accountability. A leadership reset is now unavoidable if recovery is going to be credible.",
      tech: "The release failure showed that the company's decision rhythm was built for hype more than resilience. Recovery begins with a different leadership structure."
    },
    options: [
      {
        label: "Swap visible leaders fast and return to execution mode",
        copy: "Change faces quickly, but keep most of the same decision habits underneath.",
        lens: "Signal change without redesign",
        dominantRoles: ["Contributor", "Contractor"],
        effects: { momentum: 1, trust: 0, control: 0, viability: 0 },
        consequence() {
          return "The organization moves quickly again, but the deeper operating pattern feels familiar. People see movement before they see proof of learning.";
        }
      },
      {
        label: "Rebuild the leadership table with clearer roles and challenge rights",
        copy: "Reset accountability, oversight, and who gets heard before the next major move is approved.",
        lens: "Structure the recovery",
        dominantRoles: ["Coordinator", "Calibrator", "Communicator"],
        effects: { momentum: 0, trust: 2, control: 2, viability: 1 },
        consequence() {
          return "The pace becomes more deliberate, but decisions become more coherent. Recovery starts to look like governance, not just hustle.";
        }
      },
      {
        label: "Create a crisis taskforce while keeping most routines intact",
        copy: "Add a repair layer on top of the current system without fully redesigning it yet.",
        lens: "Temporary patch",
        dominantRoles: ["Coordinator", "Contractor"],
        effects: { momentum: 0, trust: 1, control: 1, viability: 0 },
        consequence() {
          return "The company gains a useful bridge, but some old habits remain embedded. It is a step forward, though not a full reset.";
        }
      }
    ]
  },
  {
    id: "recovery-2",
    phase: "recovery",
    title: "Scale Back or Double Down",
    timeline: "Week 3",
    breakingUpdate: "Strategic pressure returning",
    pressureNote: "The temptation is to win back momentum immediately. The harder move is deciding what scale the system can actually carry now.",
    description: {
      event: "There is pressure to announce an ambitious comeback quickly, but the experience system is still rebuilding. The team must decide what scale is now responsible.",
      fashion: "The market is still watching, and leadership is split between a bold return and a narrower recovery drop. The real question is how much the system can carry cleanly.",
      coffee: "Executives want to regain growth energy, but the operating base is still uneven. The next move will reveal whether the company has learned anything from the collapse.",
      tech: "Investors and users want a comeback story, but the platform is still stabilizing. The team must choose between attention and sustainable readiness."
    },
    options: [
      {
        label: "Relaunch aggressively to win attention back",
        copy: "Use speed and boldness to reclaim the narrative before the window closes.",
        lens: "Momentum recovery",
        dominantRoles: ["Contributor", "Contractor"],
        effects: { momentum: 2, trust: -1, control: -1, viability: -1 },
        consequence() {
          return "Attention returns quickly, but the organization feels the old gravitational pull toward overreach. The system is moving before it is fully ready.";
        }
      },
      {
        label: "Reduce scope and protect disciplined delivery",
        copy: "Accept a smaller comeback so the operating base can recover while performance becomes reliable again.",
        lens: "Sustainable reset",
        dominantRoles: ["Calibrator", "Contractor", "Critic"],
        effects: { momentum: -1, trust: 1, control: 2, viability: 2 },
        consequence() {
          return "The comeback is less dramatic, but the system becomes measurably healthier. Leadership begins proving that restraint can also be strategic.";
        }
      },
      {
        label: "Pilot a narrower return before rebuilding scale",
        copy: "Test the next move in a controlled footprint, then decide what should earn expansion.",
        lens: "Evidence-based return",
        dominantRoles: ["Coordinator", "Calibrator", "Contributor"],
        effects: { momentum: 0, trust: 1, control: 1, viability: 1 },
        consequence() {
          return "The company does not regain maximum buzz immediately, but it creates a cleaner path to learn, adjust, and scale with evidence instead of optimism.";
        }
      }
    ]
  },
  {
    id: "recovery-3",
    phase: "recovery",
    title: "Rebuilding Trust",
    timeline: "Week 6",
    breakingUpdate: "External confidence still fragile",
    pressureNote: "Trust does not recover because the company says it has moved on. It recovers when people believe the organization understands what it broke.",
    description: {
      event: "Guests, partners, and staff want more than a relaunch plan. They want to know whether the company understands how confidence was damaged and what has changed.",
      fashion: "Customers and partners are watching for signs of real accountability. They are not only judging the next drop, but also whether the brand has learned anything.",
      coffee: "Customers, teams, and local partners are waiting to see whether the company will repair confidence with honesty or simply move back into promotion.",
      tech: "Users, employees, and investors want evidence that the company has learned from the release failure. Technical fixes alone will not settle the trust question."
    },
    options: [
      {
        label: "Let stronger performance speak for itself",
        copy: "Focus on doing better next time and avoid revisiting the breakdown in too much detail.",
        lens: "Performance will fix it",
        dominantRoles: ["Contributor", "Contractor"],
        effects: { momentum: 1, trust: -1, control: 0, viability: 0 },
        consequence() {
          return "The team sounds eager to move forward, but stakeholders still feel that the hardest truths remain mostly unspoken. Confidence improves only at the margins.";
        }
      },
      {
        label: "Explain what failed, what changed, and how people are now protected",
        copy: "Use transparent communication to connect accountability, redesign, and the human impact of the crisis.",
        lens: "Earn trust back",
        dominantRoles: ["Communicator", "Critic", "Coordinator"],
        effects: { momentum: -1, trust: 2, control: 1, viability: 1 },
        consequence() {
          return "The story is less glossy, but it lands as more credible. People begin seeing the company as capable of reflection instead of just reaction.";
        }
      },
      {
        label: "Offer incentives and goodwill gestures without deeper explanation",
        copy: "Ease frustration with visible concessions while keeping the broader narrative upbeat.",
        lens: "Repair the mood",
        dominantRoles: ["Communicator", "Contributor"],
        effects: { momentum: 0, trust: 1, control: -1, viability: 0 },
        consequence() {
          return "The gesture softens frustration for some people, but it does not fully answer whether the company has rebuilt the underlying system.";
        }
      }
    ]
  },
  {
    id: "recovery-4",
    phase: "recovery",
    title: "Long-Term Identity",
    timeline: "Quarter Ahead",
    breakingUpdate: "Future identity decision point",
    pressureNote: "This is the strategic test after the crisis. Will the team rebuild the same imbalance, or define a stronger identity around balanced performance?",
    description: {
      event: "Recovery is stabilizing, and the company now has to choose what kind of experience brand it wants to become after the breakdown.",
      fashion: "The brand is regaining footing, but its future identity is still unsettled. The next decision will shape whether growth discipline becomes real culture.",
      coffee: "The company can now see a path forward, but it still has to decide what kind of growth brand it wants to be after the crisis.",
      tech: "The startup has a second chance, but its future identity is still open. The next choice determines whether it returns to hype-led habits or builds a healthier model."
    },
    options: [
      {
        label: "Chase growth again while attention is returning",
        copy: "Use the recovery momentum to accelerate aggressively before competitors or fatigue close the window.",
        lens: "Return to velocity",
        dominantRoles: ["Contributor", "Contractor"],
        effects: { momentum: 2, trust: -1, control: -1, viability: -1 },
        consequence() {
          return "The room feels a familiar surge of ambition, but the organization also feels closer to the pattern that caused the original collapse.";
        }
      },
      {
        label: "Commit to disciplined growth with explicit guardrails",
        copy: "Choose a clearer identity, slower expansion, and stronger challenge norms even if it limits short-term excitement.",
        lens: "Guardrails define the future",
        dominantRoles: ["Calibrator", "Coordinator", "Critic"],
        effects: { momentum: 0, trust: 1, control: 2, viability: 2 },
        consequence() {
          return "The future becomes less cinematic and more credible. The company starts looking like a system built to last, not just to surge.";
        }
      },
      {
        label: "Build a balanced model that protects innovation and trust together",
        copy: "Keep ambition alive, but make role balance, challenge, and operating discipline part of how the company now scales.",
        lens: "Balanced turnaround",
        dominantRoles: ["Coordinator", "Communicator", "Contributor", "Contractor"],
        effects: { momentum: 1, trust: 2, control: 1, viability: 2 },
        consequence() {
          return "The company does not reject ambition. It reframes ambition around a healthier operating identity, creating a more believable path to durable recovery.";
        }
      }
    ]
  }
];

// EDIT SCORING LOGIC HERE
const metricMeta = {
  momentum: {
    label: "Momentum",
    meaning: "Energy, hype, growth, and speed."
  },
  trust: {
    label: "Trust",
    meaning: "Internal and external confidence in the team and the company."
  },
  control: {
    label: "Control",
    meaning: "Readiness, governance, systems, and operational balance."
  },
  viability: {
    label: "Viability",
    meaning: "Whether the organization can survive and function sustainably."
  }
};

const defaultMetrics = {
  momentum: 5,
  trust: 5,
  control: 5,
  viability: 5
};

// EDIT ENDINGS HERE
const endings = {
  totalBreakdown: {
    category: "Total Breakdown",
    title: "Momentum Survived Longer Than the System",
    narrative(companyName, industry, roleSummary) {
      return `${companyName} never rebuilt enough trust, control, or viability to recover from the crisis. In the ${industry.name.toLowerCase()} context, the organization kept paying for the same imbalance: high drive without enough challenge, calibration, and trust-building. ${roleSummary.dominant} shaped the rhythm most often, while ${roleSummary.ignoredLabel} stayed too quiet to change the outcome.`;
    }
  },
  fragileSurvival: {
    category: "Fragile Survival",
    title: "The Company Endured, but Confidence Stayed Thin",
    narrative(companyName, industry) {
      return `${companyName} remains standing, but the recovery is still fragile. The team avoided full collapse, yet the system has not fully proven it can sustain healthier performance in ${industry.name.toLowerCase()} conditions. The recovery improved when more roles were heard, but the organization still shows signs of old habits under pressure.`;
    }
  },
  partialRecovery: {
    category: "Partial Recovery",
    title: "Repair Worked, but the New Model Is Still Forming",
    narrative(companyName, industry) {
      return `${companyName} has regained a workable path forward and restored meaningful confidence after the breakdown. The team learned that recovery in ${industry.name.toLowerCase()} conditions required more than effort: it required better balance across coordination, communication, critique, and calibration. The company is not fully transformed yet, but it is no longer running on hype alone.`;
    }
  },
  strongTurnaround: {
    category: "Strong Turnaround",
    title: "Balanced Leadership Became the Turnaround",
    narrative(companyName, industry) {
      return `${companyName} achieved a strong turnaround by rebuilding the organization around balanced team roles rather than raw momentum. In a high-pressure ${industry.name.toLowerCase()} environment, the team proved that sustainable recovery came from combining drive with challenge, discipline, coordination, and trust. The result feels less like a rebound and more like a healthier organizational identity.`;
    }
  }
};

// EDIT DEBRIEF TEXT HERE
const debriefContent = {
  title: "Why Breakpoint Matters",
  paragraphs: [
    "Collapse in this simulation was not caused by pressure alone. It was accelerated when certain roles became louder than others, especially when Contributor and Contractor energy overwhelmed Critic and Calibrator challenge.",
    "Recovery worked best when the team rebuilt role balance. Coordinator, Communicator, Critic, and Calibrator help teams slow down the right decisions, surface ignored risk, protect trust, and create a healthier operating rhythm.",
    "Contributor and Contractor still matter. Organizations need momentum and execution. But without challenge, calibration, communication, and alignment, those strengths can drive teams faster into avoidable failure.",
    "The lesson extends beyond this fictional company. Real organizational teams often fail not because people lack talent, but because the wrong voices dominate under stress and the most needed roles go underused."
  ],
  discussionQuestions: [
    "Which role seemed easiest for your team to listen to during collapse, and why?",
    "Which role perspective became more valuable once the breakdown was visible?",
    "How did your team balance short-term momentum against long-term viability?",
    "What warning signs felt easy to rationalize away in Phase 1?",
    "What would you change about a real leadership team after seeing how role imbalance shaped the outcome?"
  ]
};

const appState = createInitialState();

function createInitialState() {
  return {
    screen: "start",
    companyName: "Northstar Collective",
    industryId: "event",
    metrics: { ...defaultMetrics },
    currentScenarioIndex: 0,
    currentTimer: SCENARIO_TIMER_SECONDS,
    timerExpired: false,
    awaitingContinue: false,
    selectedOptionIndex: null,
    lastDecision: null,
    history: [],
    roleUsage: createRoleUsage(),
    modal: null
  };
}

function createRoleUsage() {
  return roles.reduce((accumulator, role) => {
    accumulator[role.name] = 0;
    return accumulator;
  }, {});
}

function getCurrentIndustry() {
  return industries[appState.industryId];
}

function getCompanyName() {
  return escapeHtml(appState.companyName.trim() || "Northstar Collective");
}

function clampMetric(value) {
  return Math.max(0, Math.min(10, value));
}

function formatCountdown(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getMetricStatus(value) {
  if (value >= 8) {
    return "Strong";
  }
  if (value >= 5) {
    return "Stable";
  }
  if (value >= 3) {
    return "Fragile";
  }
  return "Critical";
}

function formatDelta(metricKey, delta) {
  const sign = delta > 0 ? "+" : "";
  const style = delta > 0 ? "positive" : delta < 0 ? "negative" : "neutral";
  return `<span class="delta-pill ${style}">${metricMeta[metricKey].label} ${sign}${delta}</span>`;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sumMetrics(metrics) {
  return Object.values(metrics).reduce((sum, value) => sum + value, 0);
}

function getRoleSummary() {
  const entries = Object.entries(appState.roleUsage);
  const maxCount = Math.max(...entries.map((entry) => entry[1]));
  const minCount = Math.min(...entries.map((entry) => entry[1]));
  const dominantRoles = entries.filter((entry) => entry[1] === maxCount).map((entry) => entry[0]);
  const ignoredRoles = entries.filter((entry) => entry[1] === minCount).map((entry) => entry[0]);
  const engagedRoles = entries.filter((entry) => entry[1] > 0).length;

  return {
    dominant: dominantRoles.join(" / "),
    ignored: ignoredRoles,
    ignoredLabel: ignoredRoles.join(" / "),
    engagedRoles,
    balanceLabel: engagedRoles >= 5 ? "Broad role balance" : engagedRoles >= 4 ? "Mixed role balance" : "Narrow role balance"
  };
}

function evaluateOutcome() {
  const metrics = appState.metrics;
  const total = sumMetrics(metrics);
  const minimum = Math.min(...Object.values(metrics));
  const roleSummary = getRoleSummary();
  const adjustedTotal = total + (roleSummary.engagedRoles >= 5 ? 2 : roleSummary.engagedRoles >= 4 ? 1 : 0);

  if (metrics.viability <= 2 || adjustedTotal <= 14 || (metrics.trust <= 2 && metrics.control <= 2)) {
    return endings.totalBreakdown;
  }

  if (adjustedTotal <= 23 || minimum <= 3) {
    return endings.fragileSurvival;
  }

  if (adjustedTotal <= 31 || roleSummary.engagedRoles <= 3) {
    return endings.partialRecovery;
  }

  return endings.strongTurnaround;
}

function resetGame() {
  stopScenarioTimer();
  const freshState = createInitialState();
  Object.assign(appState, freshState);
  closeModal();
  render();
}

function replayGame() {
  stopScenarioTimer();
  appState.metrics = { ...defaultMetrics };
  appState.currentScenarioIndex = 0;
  appState.currentTimer = SCENARIO_TIMER_SECONDS;
  appState.timerExpired = false;
  appState.awaitingContinue = false;
  appState.selectedOptionIndex = null;
  appState.lastDecision = null;
  appState.history = [];
  appState.roleUsage = createRoleUsage();
  appState.screen = "intro";
  closeModal();
  render();
}

function selectIndustry(industryId) {
  appState.industryId = industryId;
  render();
}

function startGame() {
  stopScenarioTimer();
  appState.screen = "setup";
  appState.awaitingContinue = false;
  appState.selectedOptionIndex = null;
  appState.lastDecision = null;
  render();
}

function continueFromSetup() {
  const input = document.getElementById("companyNameInput");
  const enteredName = input ? input.value.trim() : "";
  appState.companyName = enteredName || "Northstar Collective";
  appState.screen = "intro";
  render();
}

function beginSimulation() {
  stopScenarioTimer();
  appState.screen = "roles";
  render();
}

function launchScenarios() {
  stopScenarioTimer();
  appState.screen = "scenario";
  appState.currentScenarioIndex = 0;
  appState.currentTimer = SCENARIO_TIMER_SECONDS;
  appState.timerExpired = false;
  appState.awaitingContinue = false;
  appState.selectedOptionIndex = null;
  appState.lastDecision = null;
  render();
}

function chooseOption(optionIndex) {
  if (appState.awaitingContinue) {
    return;
  }

  stopScenarioTimer();

  const scenario = scenarios[appState.currentScenarioIndex];
  const option = scenario.options[optionIndex];

  Object.keys(option.effects).forEach((metricKey) => {
    appState.metrics[metricKey] = clampMetric(appState.metrics[metricKey] + option.effects[metricKey]);
  });

  option.dominantRoles.forEach((roleName) => {
    if (appState.roleUsage[roleName] !== undefined) {
      appState.roleUsage[roleName] += 1;
    }
  });

  appState.history.push({
    scenarioId: scenario.id,
    optionIndex,
    dominantRoles: option.dominantRoles.slice(),
    effects: { ...option.effects }
  });
  appState.awaitingContinue = true;
  appState.selectedOptionIndex = optionIndex;
  appState.lastDecision = {
    scenarioId: scenario.id,
    title: option.label,
    consequence: option.consequence(getCurrentIndustry()),
    update: scenario.breakingUpdate
  };
  render();
}

function advanceFromScenario() {
  stopScenarioTimer();
  const currentIndex = appState.currentScenarioIndex;
  appState.awaitingContinue = false;
  appState.selectedOptionIndex = null;
  appState.lastDecision = null;

  if (currentIndex === 3) {
    appState.screen = "midpoint";
    render();
    return;
  }

  if (currentIndex === scenarios.length - 1) {
    appState.screen = "results";
    render();
    return;
  }

  appState.currentScenarioIndex += 1;
  appState.screen = "scenario";
  appState.currentTimer = SCENARIO_TIMER_SECONDS;
  appState.timerExpired = false;
  render();
}

function moveIntoRecovery() {
  stopScenarioTimer();
  appState.screen = "scenario";
  appState.currentScenarioIndex = 4;
  appState.currentTimer = SCENARIO_TIMER_SECONDS;
  appState.timerExpired = false;
  appState.awaitingContinue = false;
  appState.selectedOptionIndex = null;
  appState.lastDecision = null;
  render();
}

function openDebrief() {
  stopScenarioTimer();
  appState.screen = "debrief";
  render();
}

function showModal(type) {
  stopScenarioTimer();
  appState.modal = type;
  renderModal();
}

function closeModal() {
  appState.modal = null;
  renderModal();
  syncScenarioTimer();
}

function renderMetricCards() {
  return Object.entries(metricMeta)
    .map(([key, meta]) => {
      const value = appState.metrics[key];
      return `
        <div class="metric-card">
          <div class="metric-head">
            <div>
              <div class="metric-label">${meta.label}</div>
              <div class="metric-copy">${meta.meaning}</div>
            </div>
            <div class="metric-value">${value}/10</div>
          </div>
          <div class="metric-bar" aria-hidden="true">
            <span style="width: ${value * 10}%;"></span>
          </div>
          <div class="metric-state">${getMetricStatus(value)}</div>
        </div>
      `;
    })
    .join("");
}

function renderRoleCards(includeSubtle = false) {
  return roles
    .map((role) => {
      const subtleClass = includeSubtle && (role.name === "Critic" || role.name === "Calibrator") ? " subtle" : "";
      return `
        <article class="role-card${subtleClass}">
          <div class="role-meta">
            <span class="badge">${role.name}</span>
          </div>
          <div>
            <h3>${role.name}</h3>
            <p class="role-copy">${role.description}</p>
          </div>
          <div class="compact-list">
            <div class="compact-item">
              <strong>Strength</strong>
              <span>${role.strength}</span>
            </div>
            <div class="compact-item">
              <strong>Blind Spot</strong>
              <span>${role.blindSpot}</span>
            </div>
            <div class="compact-item">
              <strong>Discussion Prompt</strong>
              <span>${role.prompt}</span>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderRolePromptGrid(phase) {
  return roles
    .map((role) => {
      const subtleClass = phase === "collapse" && (role.name === "Critic" || role.name === "Calibrator") ? " subtle" : "";
      return `
        <div class="prompt-card${subtleClass}">
          <h4>${role.name}</h4>
          <p>${role.prompt}</p>
        </div>
      `;
    })
    .join("");
}

function renderRoleSidebarPrompts(phase) {
  return roles
    .map((role) => {
      const subtleClass = phase === "collapse" && (role.name === "Critic" || role.name === "Calibrator") ? " subtle" : "";
      return `
        <div class="role-sidebar-item${subtleClass}">
          <strong>${role.name}</strong>
          <span>${role.prompt}</span>
        </div>
      `;
    })
    .join("");
}

function renderScenarioOptions(scenario) {
  return scenario.options
    .map((option, optionIndex) => {
      const selectedClass = appState.awaitingContinue && appState.selectedOptionIndex === optionIndex ? " selected" : "";
      const ctaLabel = appState.awaitingContinue && appState.selectedOptionIndex === optionIndex
        ? "Decision Selected"
        : "Select Decision";
      const ctaIcon = appState.awaitingContinue && appState.selectedOptionIndex === optionIndex ? "OK" : "GO";

      return `
        <button class="option-button${selectedClass}" type="button" data-action="choose-option" data-index="${optionIndex}" ${appState.awaitingContinue ? "disabled" : ""}>
          <div>
            <div class="card-kicker">${option.lens}</div>
            <h3 class="option-title">${option.label}</h3>
            <p class="option-copy">${option.copy}</p>
          </div>
          <div class="option-stats">
            <div class="option-cta" aria-hidden="true">
              <span class="option-cta-label">${ctaLabel}</span>
              <span class="option-cta-icon">${ctaIcon}</span>
            </div>
          </div>
        </button>
      `;
    })
    .join("");
}

function renderScenarioSidebar(phase) {
  return `
    <div class="phase-side">
      <div class="scenario-sticky">
        <div class="role-guide-card">
          <div class="section-kicker">Live Facilitation Guide</div>
          <p class="section-copy">Use these prompts while discussing the decision. The scenario stays on the left. The team-role lenses stay visible here.</p>
          <div class="role-sidebar-list">${renderRoleSidebarPrompts(phase)}</div>
        </div>

        <div class="panel-card">
          <div class="section-kicker">Live Metrics</div>
          <div class="metric-stack">${renderMetricCards()}</div>
        </div>
      </div>
    </div>
  `;
}

function renderConsequenceCard() {
  if (!appState.awaitingContinue || !appState.lastDecision) {
    return "";
  }

  return `
    <div class="consequence-card">
      <div class="update-banner">Breaking update: ${appState.lastDecision.update}</div>
      <div>
        <div class="card-kicker">Immediate Consequence</div>
        <h3 class="option-title">${appState.lastDecision.title}</h3>
        <p class="consequence-copy">${appState.lastDecision.consequence}</p>
      </div>
      <div class="option-actions">
        <button class="primary-button" type="button" data-action="continue-scenario">Continue</button>
      </div>
    </div>
  `;
}

function getTimerPresentation() {
  const timerRatio = Math.max(0, (appState.currentTimer / SCENARIO_TIMER_SECONDS) * 100);
  const timerStateClass = appState.timerExpired
    ? "expired"
    : appState.currentTimer <= 7
      ? "danger"
      : appState.currentTimer <= 15
        ? "warning"
        : "stable";
  const timerNote = appState.timerExpired
    ? "Time's up - decide now."
    : appState.currentTimer <= 10
      ? "Pressure is rising. Commit to a direction."
      : "Discuss quickly, then make the call.";

  return {
    timerRatio,
    timerStateClass,
    timerNote
  };
}

function renderTimerBlock() {
  const { timerRatio, timerStateClass, timerNote } = getTimerPresentation();

  return `
    <div class="decision-timer ${timerStateClass}" id="decisionTimer">
      <div class="timer-head">
        <div>
          <div class="section-kicker">Decision Timer</div>
          <div class="timer-note" data-timer-note>${timerNote}</div>
        </div>
        <div class="timer-value" data-timer-value>${formatCountdown(appState.currentTimer)}</div>
      </div>
        <div class="timer-track" aria-hidden="true">
          <span data-timer-fill style="width: ${timerRatio}%;"></span>
        </div>
      </div>
    `;
}

function updateTimerUI() {
  const timerElement = document.getElementById("decisionTimer");
  if (!timerElement) {
    return;
  }

  const { timerRatio, timerStateClass, timerNote } = getTimerPresentation();
  timerElement.classList.remove("stable", "warning", "danger", "expired");
  timerElement.classList.add(timerStateClass);

  const valueElement = timerElement.querySelector("[data-timer-value]");
  const noteElement = timerElement.querySelector("[data-timer-note]");
  const fillElement = timerElement.querySelector("[data-timer-fill]");

  if (valueElement) {
    valueElement.textContent = formatCountdown(appState.currentTimer);
  }
  if (noteElement) {
    noteElement.textContent = timerNote;
  }
  if (fillElement) {
    fillElement.style.width = `${timerRatio}%`;
  }
}

function renderSummaryBadges(labels, variant = "") {
  return labels
    .map((label) => `<span class="summary-badge ${variant}">${label}</span>`)
    .join("");
}

function getFutureIdentitySummary(industry) {
  const cleaned = industry.terms.comebackIdentity.replace(/^(a|an)\s+/i, "");
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function renderResultsSummaryCards(roleSummary, industry) {
  return `
    <div class="summary-card compact">
      <div class="metric-label">Dominant Role Signal</div>
      <div class="summary-badge-row">${renderSummaryBadges(roleSummary.dominant.split(" / "), "accent")}</div>
      <p class="summary-note">Most frequently amplified across team decisions.</p>
    </div>
    <div class="summary-card compact">
      <div class="metric-label">Least Heard Role</div>
      <div class="summary-badge-row">${renderSummaryBadges(roleSummary.ignored)}</div>
      <p class="summary-note">The perspective your team used least often under pressure.</p>
    </div>
    <div class="summary-card compact">
      <div class="metric-label">Role Balance</div>
      <div class="summary-badge-row"><span class="summary-badge balance">${roleSummary.balanceLabel}</span></div>
      <p class="summary-note">How broadly influence was distributed across the six OBR roles.</p>
    </div>
    <div class="summary-card compact">
      <div class="metric-label">Future Identity</div>
      <div class="summary-highlight">${getFutureIdentitySummary(industry)}</div>
      <p class="summary-note">The post-crisis direction suggested by your recovery path.</p>
    </div>
  `;
}

function renderStartScreen() {
  return `
    <section class="screen hero-screen">
      <div class="hero-stage">
        <div class="hero-copy hero-copy-centered">
          <div class="hero-eyebrow-row">
            <span class="status-pill">Collapse</span>
            <span class="status-pill">Recovery</span>
            <span class="status-pill">Team Simulation</span>
          </div>
          <div>
            <div class="hero-kicker">A Collapse and Recovery Team Simulation</div>
            <h2 class="hero-title">Breakpoint</h2>
            <p class="hero-subtitle">Lead the company. Hold the system together.</p>
            <p class="hero-minimal-copy">Eight decisions. Two phases. One leadership team trying to survive the moment when momentum stops being enough.</p>
          </div>

          <div class="hero-actions">
            <button class="primary-button" type="button" data-action="start-game">Start Game</button>
            <button class="secondary-button" type="button" data-action="open-how-to-play">How to Play</button>
            <button class="ghost-button" type="button" data-action="open-roles-modal">View Team Roles</button>
            <button class="ghost-button" type="button" data-action="reset-game">Reset</button>
          </div>

            <div class="hero-facts">
              <span class="hero-fact">6 OBR roles</span>
              <span class="hero-fact">Hidden trade-offs</span>
              <span class="hero-fact">Built for group play</span>
            </div>
        </div>
      </div>
    </section>
  `;
}

function renderSetupScreen() {
  const selectedIndustry = getCurrentIndustry();
  const industryCards = Object.values(industries)
    .map((industry) => {
      const activeClass = appState.industryId === industry.id ? " active" : "";
      return `
        <button class="select-card${activeClass}" type="button" data-action="select-industry" data-industry="${industry.id}">
          <strong>${industry.name}</strong>
          <span>${industry.summary}</span>
        </button>
      `;
    })
    .join("");

  return `
    <section class="screen">
      <div class="section-header">
        <div>
          <div class="section-kicker">Setup</div>
          <h2 class="section-title">Define the Company You'll Lead</h2>
          <p class="section-copy">Choose the fictional company context. The storyline stays the same, but the intro and scenario wording adapt to the industry you select.</p>
        </div>
      </div>

      <div class="setup-grid">
        <div class="setup-card">
          <div class="field-group">
            <label class="field-label" for="companyNameInput">Company Name</label>
            <input class="text-input" id="companyNameInput" type="text" maxlength="42" value="${escapeHtml(appState.companyName)}" placeholder="Enter a fictional company name">
            <div class="setup-help">If left blank, the simulation will use <strong>Northstar Collective</strong>.</div>
          </div>

          <div class="field-group">
            <div class="field-label">Choose Industry</div>
            <div class="industry-grid">${industryCards}</div>
          </div>

          <div class="screen-actions">
            <button class="primary-button" type="button" data-action="continue-setup">Continue</button>
            <button class="secondary-button" type="button" data-action="back-to-start">Back</button>
          </div>
        </div>

        <aside class="info-stack">
          <div class="info-card">
            <div class="section-kicker">Current Context</div>
            <h3>${selectedIndustry.name}</h3>
            <p class="body-copy">${selectedIndustry.summary}</p>
          </div>
          <div class="info-card">
            <div class="section-kicker">Teaching Signal</div>
            <p class="body-copy">Strong growth narratives can hide weak readiness. This simulation makes that tension visible by forcing trade-offs between momentum, trust, control, and viability.</p>
          </div>
        </aside>
      </div>
    </section>
  `;
}

function renderIntroScreen() {
  const industry = getCurrentIndustry();
  const introParagraphs = industry.intro(getCompanyName())
    .map((paragraph) => `<p class="body-copy">${paragraph}</p>`)
    .join("");

  return `
    <section class="screen">
      <div class="section-header">
        <div>
          <div class="section-kicker">Company Intro</div>
          <h2 class="section-title">${getCompanyName()} Is Hitting Its Breakpoint</h2>
          <p class="section-copy">Warning signs are emerging beneath the surface. Your team will first navigate collapse, then attempt recovery.</p>
        </div>
      </div>

      <div class="intro-grid">
        <div class="intro-card">
          <div class="badge">${industry.name}</div>
          ${introParagraphs}
          <div class="intro-highlight">
            <div class="highlight-card">
              <div class="metric-label">Collapse</div>
              <strong>Momentum outruns readiness</strong>
            </div>
            <div class="highlight-card">
              <div class="metric-label">Breakpoint</div>
              <strong>Visible failure forces reflection</strong>
            </div>
            <div class="highlight-card">
              <div class="metric-label">Recovery</div>
              <strong>Balanced roles rebuild the system</strong>
            </div>
          </div>
          <div class="screen-actions">
            <button class="primary-button" type="button" data-action="begin-simulation">Continue to Team Roles</button>
          </div>
        </div>

        <aside class="info-stack">
          <div class="info-card">
            <div class="section-kicker">Company Pressure</div>
            <p class="body-copy">Excitement is real. Internal readiness, control, and trust are fragile. What happens next depends on which team-role perspectives get heard when the pressure spikes.</p>
          </div>
          <div class="info-card">
            <div class="section-kicker">Simulation Note</div>
            <p class="body-copy">There is no perfect answer. Strong decisions still involve trade-offs, and fast wins can damage the deeper operating system.</p>
          </div>
        </aside>
      </div>
    </section>
  `;
}

function renderRolesScreen() {
  return `
    <section class="screen">
      <div class="section-header">
        <div>
          <div class="section-kicker">OBR Team Roles</div>
          <h2 class="section-title">Six Lenses, One Leadership Table</h2>
          <p class="section-copy">Use these perspectives before each decision. The game is about more than outcomes. It is about which roles shape those outcomes.</p>
        </div>
      </div>

      <div class="roles-onboarding">
        <div class="roles-guidance-strip">
          <div class="roles-guide-card">
            <div class="section-kicker">How To Use Them</div>
            <p class="body-copy">Discuss as one team, compare role perspectives quickly, then commit to a choice together.</p>
          </div>
          <div class="roles-guide-card">
            <div class="section-kicker">Simulation Goal</div>
            <p class="body-copy">The strongest teams do not just move fast. They balance drive, challenge, trust, and coordination under pressure.</p>
          </div>
          <div class="roles-guide-card action">
            <div>
              <div class="section-kicker">Ready To Begin</div>
              <p class="body-copy">Use the six lenses below as your leadership table for the simulation.</p>
            </div>
            <button class="primary-button" type="button" data-action="launch-scenarios">Begin Phase 1: Collapse</button>
          </div>
        </div>

        <div class="roles-grid">${renderRoleCards(false)}</div>
      </div>
    </section>
  `;
}

function renderScenarioScreen() {
  const scenario = scenarios[appState.currentScenarioIndex];
  const phaseNumber = scenario.phase === "collapse" ? appState.currentScenarioIndex + 1 : appState.currentScenarioIndex - 3;
  const phaseTitle = scenario.phase === "collapse" ? "Phase 1: Collapse" : "Phase 2: Recovery";
  const phaseSubcopy = scenario.phase === "collapse"
    ? "Escalating pressure makes momentum tempting and challenge easy to discount."
    : "The company has already broken. Recovery now depends on better balance across roles.";
  const overallProgress = ((appState.currentScenarioIndex + (appState.awaitingContinue ? 1 : 0)) / scenarios.length) * 100;

  return `
      <section class="screen">
        <div class="phase-grid">
          <div class="phase-main">
          <div class="progress-row">
            <div class="phase-topline">
              <div class="status-pill-row">
                <span class="phase-tag">${phaseTitle}</span>
                <span class="timeline-pill">${scenario.timeline}</span>
              </div>
              <div class="progress-meta">
                <span>Current scenario: ${appState.currentScenarioIndex + 1} of ${scenarios.length}</span>
                <span>${scenario.phase === "collapse" ? `Collapse scenario ${phaseNumber} of 4` : `Recovery scenario ${phaseNumber} of 4`}</span>
              </div>
            </div>
              <div class="progress-track" aria-hidden="true">
                <div class="progress-fill" style="width: ${Math.max(12.5, overallProgress)}%;"></div>
              </div>
            </div>

            <div class="scenario-card">
              ${renderTimerBlock()}
              <div>
                <div class="section-kicker">${phaseSubcopy}</div>
                <h2 class="scenario-title">${scenario.title}</h2>
              <p class="scenario-description">${scenario.description[appState.industryId]}</p>
            </div>
              <div class="pressure-note">${scenario.pressureNote}</div>
            </div>

            <div class="panel-card">
              <div class="section-kicker">Decision Options</div>
              <div class="options-grid">${renderScenarioOptions(scenario)}</div>
            </div>

            ${renderConsequenceCard()}
          </div>

          ${renderScenarioSidebar(scenario.phase)}
        </div>
      </section>
    `;
}

function renderMidpointScreen() {
  const roleSummary = getRoleSummary();
  const currentIndustry = getCurrentIndustry();
  const collapseNarrative = appState.metrics.control <= 3 || appState.metrics.trust <= 3
    ? `The breakdown is now visible. ${getCompanyName()} hit a public collapse because the system could no longer carry the story around ${currentIndustry.terms.publicOffer}.`
    : `Even where some scores held, the collapse is now visible. ${getCompanyName()} has learned that momentum alone cannot hold a fragile system together.`;

  return `
    <section class="screen">
      <div class="reflection-card alert">
        <div class="section-kicker">Breakpoint Reached</div>
        <h2 class="section-title">The Collapse Is Now Public</h2>
        <p class="section-copy">${collapseNarrative}</p>
      </div>

      <div class="results-summary">
        <div class="panel-card">
          <div class="section-kicker">Stat Status</div>
          <div class="metric-stack">${renderMetricCards()}</div>
        </div>

        <div class="reflection-card">
          <div class="section-kicker">Reflection</div>
          <div class="reflection-grid">
            <div class="reflection-item">
              <strong>Which role drove most of your decisions?</strong>
              <span class="body-copy">${roleSummary.dominant}</span>
            </div>
            <div class="reflection-item">
              <strong>Which role was ignored?</strong>
              <span class="body-copy">${roleSummary.ignoredLabel}</span>
            </div>
            <div class="reflection-item">
              <strong>Did you prioritize momentum over control?</strong>
              <span class="body-copy">${appState.metrics.momentum > appState.metrics.control ? "Mostly yes. Momentum stayed louder than operational balance." : "Not entirely. Control held some space against pressure."}</span>
            </div>
            <div class="reflection-item">
              <strong>What warning signs did you rationalize away?</strong>
              <span class="body-copy">Consider how early readiness gaps, internal red flags, or trust signals were treated when the story still felt salvageable.</span>
            </div>
          </div>
          <div class="screen-actions">
            <button class="primary-button" type="button" data-action="move-into-recovery">Begin Phase 2: Recovery</button>
            <button class="secondary-button" type="button" data-action="open-roles-modal">Review Team Roles</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderResultsScreen() {
  const outcome = evaluateOutcome();
  const roleSummary = getRoleSummary();
  const industry = getCurrentIndustry();

  return `
    <section class="screen">
      <div class="results-grid">
        <div class="outcome-card highlight">
          <div class="section-kicker">Final Results</div>
          <h2 class="outcome-title">${outcome.category}</h2>
          <div class="score-pill">Total Score: ${sumMetrics(appState.metrics)} / 40</div>
          <p class="result-copy">${outcome.narrative(getCompanyName(), industry, roleSummary)}</p>
          <div class="summary-grid">${renderResultsSummaryCards(roleSummary, industry)}</div>
          <div class="outcome-actions">
            <button class="primary-button" type="button" data-action="open-debrief">Open Debrief</button>
            <button class="secondary-button" type="button" data-action="replay-game">Replay</button>
          </div>
        </div>

        <aside class="info-stack">
          <div class="info-card">
            <div class="section-kicker">Final Scores</div>
            <div class="metric-stack">${renderMetricCards()}</div>
          </div>
          <div class="info-card">
            <div class="section-kicker">Outcome Narrative</div>
            <h3>${outcome.title}</h3>
            <p class="body-copy">The ending reflects both the final metric profile and how broadly your team distributed decision influence across roles.</p>
          </div>
        </aside>
      </div>
    </section>
  `;
}

function renderDebriefScreen() {
  const paragraphs = debriefContent.paragraphs
    .map((paragraph) => `<p class="body-copy">${paragraph}</p>`)
    .join("");
  const questions = debriefContent.discussionQuestions
    .map((question) => `<div class="discussion-item"><strong>Discussion Question</strong><span>${question}</span></div>`)
    .join("");

  return `
    <section class="screen">
      <div class="debrief-grid">
        <div class="debrief-card">
          <div class="section-kicker">Debrief</div>
          <h2 class="section-title">${debriefContent.title}</h2>
          ${paragraphs}
          <div class="debrief-points">
            <div class="debrief-point">
              <strong>Contributor and Contractor are not enough</strong>
              <span>They create motion and execution, but they do not automatically create judgment, balance, trust, or healthy challenge.</span>
            </div>
            <div class="debrief-point">
              <strong>Critic and Calibrator matter before the crisis</strong>
              <span>They surface risk early enough to prevent the team from normalizing dangerous trade-offs.</span>
            </div>
            <div class="debrief-point">
              <strong>Communicator protects trust under stress</strong>
              <span>Recovery becomes harder when people feel managed, minimized, or ignored.</span>
            </div>
            <div class="debrief-point">
              <strong>Coordinator turns viewpoints into a real operating choice</strong>
              <span>Without alignment and decision discipline, strong perspectives stay fragmented and reactive.</span>
            </div>
          </div>
        </div>

        <aside class="discussion-card">
          <div class="section-kicker">Class Discussion</div>
          <div class="discussion-list">${questions}</div>
          <div class="outcome-actions">
            <button class="primary-button" type="button" data-action="replay-game">Replay Simulation</button>
            <button class="secondary-button" type="button" data-action="back-to-start">Home</button>
            <button class="ghost-button" type="button" data-action="reset-game">Reset</button>
          </div>
        </aside>
      </div>
    </section>
  `;
}

function renderModal() {
  if (!appState.modal) {
    modalRoot.classList.add("hidden");
    modalRoot.setAttribute("aria-hidden", "true");
    modalRoot.innerHTML = "";
    return;
  }

  modalRoot.classList.remove("hidden");
  modalRoot.setAttribute("aria-hidden", "false");

  if (appState.modal === "howToPlay") {
    modalRoot.innerHTML = `
      <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <div class="modal-header">
          <div>
            <div class="section-kicker">How To Play</div>
            <h2 class="modal-title" id="modalTitle">Run the Simulation as One Team</h2>
          </div>
          <button class="modal-close" type="button" data-action="close-modal" aria-label="Close modal">X</button>
        </div>
        <div class="modal-body">
          <div class="feature-list">
            <div class="feature-item">
              <strong>This is a team discussion simulation</strong>
              <span>One group plays together on one device, discussing each scenario before selecting an option.</span>
            </div>
            <div class="feature-item">
              <strong>There is no perfect answer</strong>
              <span>Each choice changes the company through trade-offs across Momentum, Trust, Control, and Viability.</span>
            </div>
            <div class="feature-item">
              <strong>The lesson is about roles, not just outcomes</strong>
              <span>Use the Coordinator, Contributor, Contractor, Critic, Calibrator, and Communicator prompts before deciding.</span>
            </div>
            <div class="feature-item">
              <strong>Collapse and recovery teach different things</strong>
              <span>Phase 1 tempts the team toward speed and hype. Phase 2 rewards stronger balance and better organizational judgment.</span>
            </div>
          </div>
          <div class="modal-actions">
            <button class="primary-button" type="button" data-action="close-modal">Back to Game</button>
          </div>
        </div>
      </div>
    `;
    return;
  }

  modalRoot.innerHTML = `
      <div class="modal-panel roles-modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <div class="modal-header">
          <div>
            <div class="section-kicker">Team Roles</div>
            <h2 class="modal-title" id="modalTitle">OBR Role Reference</h2>
            <p class="section-copy">Use these six roles as discussion lenses before each decision. The strongest teams do not just move quickly. They hear the right voices at the right time.</p>
          </div>
          <button class="modal-close" type="button" data-action="close-modal" aria-label="Close modal">X</button>
        </div>
      <div class="modal-body">
        <div class="modal-roles-grid">${renderRoleCards(false)}</div>
        <div class="modal-actions">
          <button class="primary-button" type="button" data-action="close-modal">Close</button>
        </div>
      </div>
    </div>
  `;
}

function stopScenarioTimer() {
  if (scenarioTimerId) {
    clearInterval(scenarioTimerId);
    scenarioTimerId = null;
  }
}

function syncScenarioTimer() {
  stopScenarioTimer();

  if (appState.screen !== "scenario" || appState.awaitingContinue || appState.currentTimer <= 0 || appState.modal) {
    return;
  }

  scenarioTimerId = window.setInterval(() => {
    if (appState.screen !== "scenario" || appState.awaitingContinue) {
      stopScenarioTimer();
      return;
    }

    if (appState.currentTimer > 0) {
      appState.currentTimer -= 1;
      if (appState.currentTimer === 0) {
        appState.timerExpired = true;
        stopScenarioTimer();
      }
      updateTimerUI();
    }
  }, 1000);
}

function render(options = {}) {
  const preserveScroll = Boolean(options.preserveScroll);
  let html = "";

  if (appState.screen === "start") {
    html = renderStartScreen();
  } else if (appState.screen === "setup") {
    html = renderSetupScreen();
  } else if (appState.screen === "intro") {
    html = renderIntroScreen();
  } else if (appState.screen === "roles") {
    html = renderRolesScreen();
  } else if (appState.screen === "scenario") {
    html = renderScenarioScreen();
  } else if (appState.screen === "midpoint") {
    html = renderMidpointScreen();
  } else if (appState.screen === "results") {
    html = renderResultsScreen();
  } else if (appState.screen === "debrief") {
    html = renderDebriefScreen();
  } else {
    html = `<section class="screen"><div class="empty-state">Unable to render the current screen.</div></section>`;
  }

  app.innerHTML = html;
  renderModal();
  syncScenarioTimer();
  if (!preserveScroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

document.addEventListener("click", (event) => {
  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) {
    return;
  }

  const action = actionTarget.dataset.action;

  if (action === "start-game") {
    startGame();
  }

  if (action === "open-how-to-play") {
    showModal("howToPlay");
  }

  if (action === "open-roles-modal") {
    showModal("roles");
  }

  if (action === "close-modal") {
    closeModal();
  }

  if (action === "reset-game") {
    resetGame();
  }

  if (action === "continue-setup") {
    continueFromSetup();
  }

  if (action === "select-industry") {
    selectIndustry(actionTarget.dataset.industry);
  }

  if (action === "back-to-start") {
    appState.screen = "start";
    closeModal();
    render();
  }

  if (action === "begin-simulation") {
    beginSimulation();
  }

  if (action === "launch-scenarios") {
    launchScenarios();
  }

  if (action === "choose-option") {
    chooseOption(Number(actionTarget.dataset.index));
  }

  if (action === "continue-scenario") {
    advanceFromScenario();
  }

  if (action === "move-into-recovery") {
    moveIntoRecovery();
  }

  if (action === "open-debrief") {
    openDebrief();
  }

  if (action === "replay-game") {
    replayGame();
  }
});

document.addEventListener("input", (event) => {
  if (event.target && event.target.id === "companyNameInput") {
    appState.companyName = event.target.value;
  }
});

headerRolesButton.addEventListener("click", () => {
  showModal("roles");
});

headerResetButton.addEventListener("click", () => {
  resetGame();
});

modalRoot.addEventListener("click", (event) => {
  if (event.target === modalRoot) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && appState.modal) {
    closeModal();
  }
});

render();
