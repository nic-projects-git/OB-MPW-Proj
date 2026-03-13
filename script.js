// Editable game configuration lives here so classroom tweaks stay simple.
const GAME_CONFIG = {
  decisionTimer: 32,
  startingStats: {
    mission: 68,
    morale: 64,
    time: 78,
    risk: 24
  },
  statMin: 0,
  statMax: 100,
  failAt: {
    mission: 0,
    morale: 0,
    time: 0,
    risk: 100
  },
  scoreWeights: {
    mission: 1.35,
    morale: 1.0,
    time: 0.8,
    riskBuffer: 1.2,
    coordination: 4,
    balancedTeam: 8,
    timeoutPenalty: 6
  }
};

// All team roles are defined in one array for easy editing or extension.
const TEAM_ROLES = [
  {
    name: "Mission Commander",
    description: "Sets direction, breaks deadlocks, and keeps the team moving when pressure rises.",
    strength: "Decisive leadership during ambiguity",
    blindSpot: "Can overvalue speed and silence dissent"
  },
  {
    name: "Systems Analyst",
    description: "Interprets technical signals, spots weak data, and questions hidden assumptions.",
    strength: "Finds patterns others miss",
    blindSpot: "Can get stuck seeking perfect information"
  },
  {
    name: "Communications Officer",
    description: "Translates complex updates clearly across teams, leaders, and mission stakeholders.",
    strength: "Builds shared understanding quickly",
    blindSpot: "May smooth over conflict before it is resolved"
  },
  {
    name: "Risk Assessor",
    description: "Pushes the team to slow down, surface threats, and test optimism against reality.",
    strength: "Prevents avoidable failure",
    blindSpot: "Can feel like a blocker when urgency is high"
  },
  {
    name: "Operations Specialist",
    description: "Turns plans into action, coordinates workflows, and keeps execution on track.",
    strength: "Strong operational follow-through",
    blindSpot: "May prioritize momentum over reflection"
  },
  {
    name: "External Liaison",
    description: "Represents outside stakeholders and keeps the team aware of reputation and partnerships.",
    strength: "Protects alignment beyond the room",
    blindSpot: "Can add pressure from external expectations"
  }
];

// All scenarios are centralized here. Each option includes the effects and the decision style tag.
const SCENARIOS = [
  {
    stage: "Pre-Launch",
    level: "Warning",
    title: "Fuel Sensor Drift",
    prompt: "Ten minutes into final checks, one fuel line sensor starts drifting outside its expected range. Engineering is split on whether it is a calibration glitch or a real reliability issue.",
    roleCue: "Operations will want pace; Systems and Risk will want proof.",
    timeoutChoice: 2,
    options: [
      {
        label: "Delay launch for a full sensor replacement",
        tradeoff: "Improves confidence but costs precious launch window time.",
        tag: "safety",
        outcome: "The sensor is replaced successfully, and the team regains confidence, but the schedule slips and frustration rises at the lost margin.",
        effects: { mission: 6, morale: -2, time: -14, risk: -10 }
      },
      {
        label: "Proceed and monitor the sensor in real time",
        tradeoff: "Keeps momentum but risks normalizing a warning sign.",
        tag: "action",
        outcome: "The team preserves momentum, yet unease spreads because leadership appears willing to gamble on shaky data.",
        effects: { mission: 2, morale: -4, time: 8, risk: 14 }
      },
      {
        label: "Run a rapid cross-check with manual verification",
        tradeoff: "Balances speed with scrutiny, but only partially resolves uncertainty.",
        tag: "coordination",
        outcome: "Manual checks create enough trust to continue, and the team feels heard, though some ambiguity remains in the system.",
        effects: { mission: 4, morale: 4, time: -6, risk: -4 }
      }
    ]
  },
  {
    stage: "Pre-Launch",
    level: "Advisory",
    title: "Crew Fatigue Reports",
    prompt: "Two crew members report poor sleep after a noisy night in quarantine. The medical team says they are cleared, but everyone knows fatigue changes performance under stress.",
    roleCue: "Commander and External Liaison may favor schedule; Risk and Comms may raise human factors.",
    timeoutChoice: 1,
    options: [
      {
        label: "Push the crew through with a motivational briefing",
        tradeoff: "Protects the timeline but puts strain on trust and performance.",
        tag: "action",
        outcome: "The crew complies, but the decision creates quiet resentment and increases the chance of mistakes later.",
        effects: { mission: 3, morale: -10, time: 10, risk: 10 }
      },
      {
        label: "Delay for a recovery cycle and reset the timeline",
        tradeoff: "Protects people but burns launch margin and external confidence.",
        tag: "safety",
        outcome: "The crew feels supported and sharper, although the delay creates external pressure and compresses downstream operations.",
        effects: { mission: 5, morale: 8, time: -12, risk: -6 }
      },
      {
        label: "Rotate support tasks and shorten noncritical procedures",
        tradeoff: "Shares the load, though it asks the team to coordinate tightly.",
        tag: "coordination",
        outcome: "The team adapts roles quickly, preserving moderate pace while showing that communication can offset fatigue risk.",
        effects: { mission: 6, morale: 6, time: -4, risk: -3 }
      }
    ]
  },
  {
    stage: "Pre-Launch",
    level: "Advisory",
    title: "Supply Drone Delay",
    prompt: "A late cargo drone carrying research samples and backup filters is still fifteen minutes out. Launching without it keeps the window alive, but it reduces margin for surprises.",
    roleCue: "External pressure favors speed; Systems and Operations see the downstream constraints.",
    timeoutChoice: 1,
    options: [
      {
        label: "Wait for the full payload before launch",
        tradeoff: "Increases preparedness but puts the schedule at risk.",
        tag: "safety",
        outcome: "The payload arrives and redundancy improves, but the room feels the stress of a tighter launch corridor.",
        effects: { mission: 7, morale: -1, time: -11, risk: -8 }
      },
      {
        label: "Launch on time without the backup supplies",
        tradeoff: "Saves time now by borrowing risk from the future.",
        tag: "action",
        outcome: "The launch pipeline stays clean, but everyone knows the mission now has less room for error if another system degrades.",
        effects: { mission: 1, morale: -3, time: 12, risk: 13 }
      },
      {
        label: "Transfer only the most critical items and launch slightly late",
        tradeoff: "Creates a compromise, though it requires fast coordination and clear priorities.",
        tag: "coordination",
        outcome: "A focused transfer secures the essentials, and the team sees how prioritization can rescue a schedule without going all-in on risk.",
        effects: { mission: 5, morale: 5, time: -5, risk: -2 }
      }
    ]
  },
  {
    stage: "Pre-Launch",
    level: "Warning",
    title: "Weather Corridor Shift",
    prompt: "Upper-atmosphere winds are shifting toward a microburst zone near the primary ascent corridor. The backup corridor is safe but less efficient and less rehearsed.",
    roleCue: "Risk wants margin; Commander and Operations may resist losing the launch slot.",
    timeoutChoice: 2,
    options: [
      {
        label: "Hold for ideal weather and risk losing the window",
        tradeoff: "Maximizes safety at the cost of momentum and time.",
        tag: "safety",
        outcome: "Conditions improve, but the team nearly misses the slot and feels the strain of waiting on uncertain conditions.",
        effects: { mission: 6, morale: -4, time: -15, risk: -12 }
      },
      {
        label: "Use the primary corridor before conditions worsen",
        tradeoff: "Protects time but exposes the mission to atmospheric volatility.",
        tag: "action",
        outcome: "The rocket clears the pad on schedule, but mission control absorbs a tense and riskier ascent profile.",
        effects: { mission: 4, morale: -5, time: 10, risk: 16 }
      },
      {
        label: "Switch to the backup corridor after a rapid coordination huddle",
        tradeoff: "Costs some time but turns shared awareness into a safer execution plan.",
        tag: "coordination",
        outcome: "The team aligns quickly around the alternate route, and the safer climb reinforces the value of coordinated adaptation.",
        effects: { mission: 7, morale: 3, time: -7, risk: -5 }
      }
    ]
  },
  {
    stage: "Launch Window",
    level: "Warning",
    title: "Countdown Comms Dropout",
    prompt: "With two minutes to launch, the encrypted voice loop begins cutting out between guidance and propulsion teams. The technical fix is possible, but the clock is running.",
    roleCue: "Communications can restore alignment; action-oriented roles may push through the noise.",
    timeoutChoice: 2,
    options: [
      {
        label: "Pause countdown until the comms loop is stable",
        tradeoff: "Improves coordination but burns launch energy and focus.",
        tag: "safety",
        outcome: "The pause restores clarity, though the launch room becomes visibly tense as everyone recalculates the shrinking margin.",
        effects: { mission: 6, morale: -3, time: -12, risk: -10 }
      },
      {
        label: "Continue using backup text protocols only",
        tradeoff: "Keeps the clock moving but weakens shared situational awareness.",
        tag: "action",
        outcome: "The launch proceeds, but misread signals create confusion and the team feels less synchronized than it should in a critical moment.",
        effects: { mission: 2, morale: -7, time: 9, risk: 14 }
      },
      {
        label: "Split roles: stabilize voice on critical loops and use manual callouts elsewhere",
        tradeoff: "Requires fast coordination but preserves both clarity and tempo.",
        tag: "coordination",
        outcome: "The hybrid protocol works because people know who owns each channel, strengthening the team's confidence under pressure.",
        effects: { mission: 7, morale: 5, time: -4, risk: -3 }
      }
    ]
  },
  {
    stage: "Launch Window",
    level: "Advisory",
    title: "Guidance Patch Debate",
    prompt: "A last-minute software patch promises to smooth ascent navigation. The code passed lab tests overnight, but it has not been run in the exact mission configuration.",
    roleCue: "Systems sees technical upside; Risk sees hidden interactions; Commander must decide how much uncertainty is acceptable.",
    timeoutChoice: 1,
    options: [
      {
        label: "Install the full patch now",
        tradeoff: "Could improve performance, but the timing increases change risk.",
        tag: "action",
        outcome: "The patch loads and the team gains capability, but the untested integration creates lingering anxiety throughout the room.",
        effects: { mission: 8, morale: -2, time: 6, risk: 12 }
      },
      {
        label: "Reject the patch and fly the known build",
        tradeoff: "Protects reliability but sacrifices possible performance gains.",
        tag: "safety",
        outcome: "The known build keeps the team grounded in proven routines, though some worry they left an advantage unused.",
        effects: { mission: 4, morale: 3, time: -3, risk: -6 }
      },
      {
        label: "Deploy only the constrained navigation fix and keep the rest unchanged",
        tradeoff: "Takes coordination to isolate the safest improvement without loading everything.",
        tag: "coordination",
        outcome: "A disciplined partial update improves confidence because the team separates what is helpful from what is merely tempting.",
        effects: { mission: 7, morale: 4, time: -1, risk: -2 }
      }
    ]
  },
  {
    stage: "Launch Window",
    level: "Critical",
    title: "Booster Temperature Spike",
    prompt: "Telemetry shows one booster chamber climbing above its expected temperature band. The spike may normalize during ascent, or it may signal a deeper instability.",
    roleCue: "Operations wants a clear executable path; Risk wants to avoid normalizing a red flag.",
    timeoutChoice: 0,
    options: [
      {
        label: "Scrub and inspect the booster immediately",
        tradeoff: "Protects the crew and vehicle, but the mission may lose the window.",
        tag: "safety",
        outcome: "The inspection prevents a potentially ugly failure mode, yet the team pays heavily in schedule and emotional strain.",
        effects: { mission: 7, morale: -5, time: -16, risk: -14 }
      },
      {
        label: "Accept the spike and commit to launch",
        tradeoff: "Saves the timeline by betting the anomaly is temporary.",
        tag: "action",
        outcome: "The booster powers through the spike, but the team experiences the kind of silent stress that can erode trust in leadership.",
        effects: { mission: 5, morale: -9, time: 11, risk: 18 }
      },
      {
        label: "Run a two-minute purge and revise thrust sequencing",
        tradeoff: "Costs some time, but coordination may reduce the thermal load without a full scrub.",
        tag: "coordination",
        outcome: "The purge lowers the temperature enough to continue, and the shared execution reinforces confidence in adaptive teamwork.",
        effects: { mission: 8, morale: 4, time: -6, risk: -4 }
      }
    ]
  },
  {
    stage: "Launch Window",
    level: "Warning",
    title: "VIP Pressure Call",
    prompt: "A senior sponsor calls insisting that the mission launch on time for a global broadcast window. The call reaches the room just as teams are juggling technical uncertainty.",
    roleCue: "External Liaison feels the pressure; Communications must prevent the room from fragmenting around status and optics.",
    timeoutChoice: 1,
    options: [
      {
        label: "Promise the sponsor an on-time launch",
        tradeoff: "Buys political capital now but may distort decision quality.",
        tag: "action",
        outcome: "The sponsor is pleased, but internal teams feel boxed into a timeline that now carries more emotional than technical logic.",
        effects: { mission: 2, morale: -8, time: 9, risk: 10 }
      },
      {
        label: "Reject the demand and protect decision independence",
        tradeoff: "Preserves mission discipline but may hurt external support.",
        tag: "safety",
        outcome: "The team regains autonomy, though the sharp stance creates external friction and a more defensive atmosphere.",
        effects: { mission: 5, morale: 2, time: -4, risk: -4 }
      },
      {
        label: "Give the sponsor a structured status update with decision gates",
        tradeoff: "Takes coordination effort but reduces panic on both sides.",
        tag: "coordination",
        outcome: "The room stabilizes because expectations are reframed around evidence and gates rather than raw urgency.",
        effects: { mission: 7, morale: 6, time: -2, risk: -3 }
      }
    ]
  },
  {
    stage: "In-Flight Crisis",
    level: "Critical",
    title: "Micrometeorite Strike",
    prompt: "A micrometeorite clips one solar wing, reducing power generation and scattering debris across the sensor array. The crew is safe, but the mission enters a fragile power posture.",
    roleCue: "Operations wants immediate stabilization; Systems and Risk need time to understand second-order failures.",
    timeoutChoice: 2,
    options: [
      {
        label: "Send the crew on an immediate exterior repair",
        tradeoff: "Could restore power quickly, but the EVA itself carries danger.",
        tag: "action",
        outcome: "The quick EVA recovers some output, yet the crew burns energy and the team absorbs new exposure to operational risk.",
        effects: { mission: 8, morale: -3, time: 6, risk: 15 }
      },
      {
        label: "Ration power and suspend all nonessential modules",
        tradeoff: "Protects safety but compromises mission ambition and morale.",
        tag: "safety",
        outcome: "The vehicle stabilizes, although the crew feels the weight of moving from exploration mode into survival mode.",
        effects: { mission: 3, morale: -7, time: -8, risk: -10 }
      },
      {
        label: "Run a remote repair script while preparing a delayed EVA backup",
        tradeoff: "Takes coordination across teams, but preserves options and reduces immediate exposure.",
        tag: "coordination",
        outcome: "The remote fix restores part of the wing and keeps the crew inside, showing how staged coordination can outperform a rushed first move.",
        effects: { mission: 7, morale: 4, time: -4, risk: -5 }
      }
    ]
  },
  {
    stage: "In-Flight Crisis",
    level: "Warning",
    title: "Medical Anomaly",
    prompt: "One astronaut reports dizziness and reduced fine motor control. The symptoms could be temporary adaptation, or the start of a more serious in-flight medical issue.",
    roleCue: "Commander may push to preserve objectives; Risk and Comms will want a shared care protocol.",
    timeoutChoice: 2,
    options: [
      {
        label: "Keep the mission plan and monitor the astronaut quietly",
        tradeoff: "Preserves mission pace but may signal that performance matters more than people.",
        tag: "action",
        outcome: "The task timeline holds, but the crew senses the organization is underweighting human risk and trust slips.",
        effects: { mission: 4, morale: -10, time: 7, risk: 12 }
      },
      {
        label: "Divert to a safer orbit and begin full medical observation",
        tradeoff: "Centers safety, though it costs mission progress and time.",
        tag: "safety",
        outcome: "The crew feels supported and stable, even as the mission sacrifices momentum to reduce uncertainty around the medical issue.",
        effects: { mission: 5, morale: 7, time: -11, risk: -8 }
      },
      {
        label: "Redistribute tasks, brief the crew transparently, and run targeted checks",
        tradeoff: "Requires strong communication, but balances care with continued operations.",
        tag: "coordination",
        outcome: "The crew adapts well because expectations are shared openly and workload is adjusted without panic.",
        effects: { mission: 7, morale: 8, time: -4, risk: -3 }
      }
    ]
  },
  {
    stage: "In-Flight Crisis",
    level: "Critical",
    title: "Navigation Drift Near Debris",
    prompt: "The spacecraft begins drifting toward a thin debris corridor. You can correct now with a fuel-heavy burn, wait for cleaner data, or coordinate a more complex shared solution.",
    roleCue: "Action saves time, safety saves margin, coordination saves optionality.",
    timeoutChoice: 0,
    options: [
      {
        label: "Execute an immediate correction burn",
        tradeoff: "Creates quick separation but burns future maneuver margin.",
        tag: "action",
        outcome: "The ship avoids the debris path, but fuel reserves tighten and the team knows later decisions will become harder.",
        effects: { mission: 6, morale: -2, time: 10, risk: 9 }
      },
      {
        label: "Hold position and collect more targeting data",
        tradeoff: "Improves certainty, but delay increases the danger window.",
        tag: "safety",
        outcome: "The extra data sharpens the picture, though the team spends tense minutes uncomfortably close to the hazard field.",
        effects: { mission: 4, morale: -4, time: -8, risk: -2 }
      },
      {
        label: "Run a dual-track response with simultaneous modeling and partial burn prep",
        tradeoff: "Coordination heavy, but it preserves flexibility while reducing panic.",
        tag: "coordination",
        outcome: "Shared modeling lets the team commit at the right moment, proving that coordinated preparation can beat either pure speed or pure delay.",
        effects: { mission: 8, morale: 5, time: -3, risk: -4 }
      }
    ]
  },
  {
    stage: "In-Flight Crisis",
    level: "Critical",
    title: "Oxygen Recycler Fault",
    prompt: "The oxygen recycler begins failing in cycles. A total breakdown is not certain, but if it happens the crew will be forced into emergency return procedures.",
    roleCue: "This is the ultimate execution-vs-reflection moment: move fast, think deeply, or coordinate both.",
    timeoutChoice: 2,
    options: [
      {
        label: "Trigger immediate emergency return",
        tradeoff: "Maximizes survival odds but ends most mission objectives.",
        tag: "safety",
        outcome: "The crew is protected and the system remains manageable, though the mission's scientific goals narrow sharply.",
        effects: { mission: 4, morale: 3, time: -14, risk: -12 }
      },
      {
        label: "Jury-rig the recycler and keep the mission on plan",
        tradeoff: "Protects objectives but depends on an unstable technical gamble.",
        tag: "action",
        outcome: "The workaround briefly succeeds, but the crew and control room both feel they are living on borrowed certainty.",
        effects: { mission: 9, morale: -6, time: 8, risk: 16 }
      },
      {
        label: "Shut down nonessential modules and run a disciplined repair-return hybrid plan",
        tradeoff: "Costs time and some objectives, but creates a controllable path forward.",
        tag: "coordination",
        outcome: "The hybrid plan reduces panic, protects the crew, and still salvages part of the mission through disciplined teamwork.",
        effects: { mission: 8, morale: 6, time: -6, risk: -6 }
      }
    ]
  }
];

// Surprise twists add drama and can change the rules for upcoming decisions.
const TWISTS = [
  {
    afterScenario: 4,
    title: "Surprise Twist: Solar Storm Front",
    message: "Radiation activity surges unexpectedly. The next two decision windows are shorter, and careful coordination earns extra stability.",
    immediateEffects: { mission: 0, morale: -2, time: -4, risk: 8 },
    modifier: {
      name: "Solar Storm",
      turns: 2,
      timerDelta: -6,
      tagBonuses: {
        coordination: { mission: 2, risk: -2 },
        safety: { risk: -1 }
      }
    }
  },
  {
    afterScenario: 8,
    title: "Surprise Twist: Global Broadcast Leak",
    message: "A leaked live feed puts the entire mission under public scrutiny. Collaborative communication helps recover trust, while unilateral action is judged harshly.",
    immediateEffects: { mission: 0, morale: -8, time: 0, risk: 4 },
    modifier: {
      name: "Public Scrutiny",
      turns: 2,
      timerDelta: -2,
      tagBonuses: {
        coordination: { morale: 4, mission: 2 },
        action: { morale: -2, risk: 2 }
      }
    }
  },
  {
    afterScenario: 10,
    title: "Surprise Twist: Deep-Space Signal Delay",
    message: "Signal latency spikes, making solo snap decisions less reliable. The final two crises reward shared planning over raw speed.",
    immediateEffects: { mission: 0, morale: -2, time: -3, risk: 5 },
    modifier: {
      name: "Signal Delay",
      turns: 2,
      timerDelta: -4,
      tagBonuses: {
        coordination: { mission: 3, risk: -1 },
        action: { mission: -2, risk: 2 }
      }
    }
  }
];

const STAGES = ["Pre-Launch", "Launch Window", "In-Flight Crisis"];

const state = {
  stats: {},
  roles: [],
  scenarioIndex: 0,
  timerRemaining: 0,
  timerId: null,
  activeModifiers: [],
  history: [],
  patterns: {
    action: 0,
    safety: 0,
    coordination: 0,
    timeouts: 0
  },
  failureReason: null
};

const refs = {
  views: {
    start: document.getElementById("start-screen"),
    game: document.getElementById("game-screen"),
    outcome: document.getElementById("outcome-screen"),
    debrief: document.getElementById("debrief-screen")
  },
  modal: document.getElementById("instructions-modal"),
  globalAlert: document.getElementById("global-alert"),
  stageLabel: document.getElementById("stage-label"),
  scenarioTitle: document.getElementById("scenario-title"),
  scenarioText: document.getElementById("scenario-text"),
  roleCue: document.getElementById("role-cue"),
  alertLevel: document.getElementById("alert-level"),
  roundLabel: document.getElementById("round-label"),
  stageTracker: document.getElementById("stage-tracker"),
  choiceContainer: document.getElementById("choice-container"),
  resolutionPanel: document.getElementById("resolution-panel"),
  resolutionText: document.getElementById("resolution-text"),
  effectSummary: document.getElementById("effect-summary"),
  modifierStrip: document.getElementById("modifier-strip"),
  roleGrid: document.getElementById("role-grid"),
  logList: document.getElementById("log-list"),
  timerDisplay: document.getElementById("timer-display"),
  timerFill: document.getElementById("timer-fill"),
  statValues: {
    mission: document.getElementById("mission-value"),
    morale: document.getElementById("morale-value"),
    time: document.getElementById("time-value"),
    risk: document.getElementById("risk-value")
  },
  statBars: {
    mission: document.getElementById("mission-bar"),
    morale: document.getElementById("morale-bar"),
    time: document.getElementById("time-bar"),
    risk: document.getElementById("risk-bar")
  },
  outcomeTitle: document.getElementById("outcome-title"),
  outcomeSummary: document.getElementById("outcome-summary"),
  finalScoreboard: document.getElementById("final-scoreboard"),
  teamPatterns: document.getElementById("team-patterns"),
  debriefInsights: document.getElementById("debrief-insights")
};

function init() {
  bindEvents();
  showView("start");
  showAlert("Mission control standing by. Open the briefing or begin the simulation.", "info");
}

function bindEvents() {
  document.getElementById("start-btn").addEventListener("click", startGame);
  document.getElementById("instructions-btn").addEventListener("click", openModal);
  document.getElementById("briefing-btn").addEventListener("click", openModal);
  document.getElementById("close-modal-btn").addEventListener("click", closeModal);
  document.getElementById("shuffle-roles-btn").addEventListener("click", () => {
    state.roles = shuffleArray([...TEAM_ROLES]);
    renderRoles();
    showAlert("Team roles reassigned. Rebalance the discussion before the next decision.", "info");
  });
  document.getElementById("next-btn").addEventListener("click", advanceScenario);
  document.getElementById("debrief-btn").addEventListener("click", () => showView("debrief"));
  document.getElementById("restart-btn").addEventListener("click", startGame);
  document.getElementById("play-again-btn").addEventListener("click", startGame);
  document.getElementById("back-to-results").addEventListener("click", () => showView("outcome"));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }

    if (refs.modal.classList.contains("hidden") && refs.views.game.hidden === false && refs.resolutionPanel.classList.contains("hidden")) {
      const optionIndex = Number(event.key) - 1;
      if (optionIndex >= 0 && optionIndex <= 2) {
        handleChoice(optionIndex, false);
      }
    }

    if (refs.modal.classList.contains("hidden") && refs.views.game.hidden === false && refs.resolutionPanel.classList.contains("hidden") === false) {
      if (event.key === "Enter") {
        advanceScenario();
      }
    }
  });

  refs.modal.addEventListener("click", (event) => {
    if (event.target === refs.modal) {
      closeModal();
    }
  });
}

function startGame() {
  clearTimer();

  state.stats = { ...GAME_CONFIG.startingStats };
  state.roles = shuffleArray([...TEAM_ROLES]);
  state.scenarioIndex = 0;
  state.activeModifiers = [];
  state.history = [];
  state.failureReason = null;
  state.patterns = {
    action: 0,
    safety: 0,
    coordination: 0,
    timeouts: 0
  };

  renderRoles();
  renderLog();
  updateStats();
  showView("game");
  showAlert("Roles assigned. Mission control is live.", "success");
  loadScenario();
}

function showView(viewName) {
  Object.entries(refs.views).forEach(([name, element]) => {
    const isActive = name === viewName;
    element.hidden = !isActive;
    element.classList.toggle("active", isActive);
  });
}

function openModal() {
  refs.modal.classList.remove("hidden");
}

function closeModal() {
  refs.modal.classList.add("hidden");
}

function renderRoles() {
  refs.roleGrid.innerHTML = "";

  state.roles.forEach((role, index) => {
    const card = document.createElement("article");
    card.className = "role-card";
    card.innerHTML = `
      <div class="role-seat">Seat ${index + 1}</div>
      <div class="role-name">${role.name}</div>
      <div class="role-copy">${role.description}</div>
      <div class="role-trait"><strong>Strength:</strong> ${role.strength}</div>
      <div class="role-trait"><strong>Blind Spot:</strong> ${role.blindSpot}</div>
    `;
    refs.roleGrid.appendChild(card);
  });
}

function renderStageTracker() {
  const currentStage = SCENARIOS[state.scenarioIndex]?.stage;

  refs.stageTracker.innerHTML = "";
  STAGES.forEach((stageName, index) => {
    const item = document.createElement("div");
    const currentIndex = STAGES.indexOf(currentStage);
    const completed = currentIndex > index || state.scenarioIndex >= SCENARIOS.length;
    const active = currentIndex === index && state.scenarioIndex < SCENARIOS.length;

    item.className = `stage-item${completed ? " completed" : ""}${active ? " active" : ""}`;
    item.innerHTML = `
      <span class="stage-title">${stageName}</span>
      <span class="stage-meta">Stage ${index + 1}</span>
    `;
    refs.stageTracker.appendChild(item);
  });
}

function loadScenario() {
  if (state.scenarioIndex >= SCENARIOS.length) {
    finishGame();
    return;
  }

  const scenario = SCENARIOS[state.scenarioIndex];
  refs.stageLabel.textContent = scenario.stage;
  refs.scenarioTitle.textContent = scenario.title;
  refs.scenarioText.textContent = scenario.prompt;
  refs.roleCue.textContent = scenario.roleCue;
  refs.roundLabel.textContent = `Event ${state.scenarioIndex + 1} / ${SCENARIOS.length}`;
  refs.alertLevel.textContent = scenario.level;
  refs.alertLevel.className = `alert-chip ${scenario.level === "Critical" ? "" : scenario.level === "Warning" ? "warning" : "stable"}`;
  refs.resolutionPanel.classList.add("hidden");
  renderChoices(scenario);
  renderStageTracker();
  renderModifierStrip();
  startDecisionTimer();

  if (state.scenarioIndex === 0) {
    showAlert("Stage 1 active: Pre-Launch. Build shared understanding before speed takes over.", "info");
  }
}

function renderChoices(scenario) {
  refs.choiceContainer.innerHTML = "";

  scenario.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "choice-card";
    button.type = "button";
    button.innerHTML = `
      <div class="choice-topline">
        <span class="choice-index">Option ${index + 1}</span>
        <span class="tag-chip ${option.tag}">${option.tag}</span>
      </div>
      <div class="choice-title">${option.label}</div>
      <div class="choice-copy">${option.tradeoff}</div>
    `;
    button.addEventListener("click", () => handleChoice(index, false));
    refs.choiceContainer.appendChild(button);
  });
}

function renderModifierStrip() {
  refs.modifierStrip.innerHTML = "";

  if (!state.activeModifiers.length) {
    return;
  }

  state.activeModifiers.forEach((modifier) => {
    const badge = document.createElement("span");
    badge.className = "modifier-chip";
    badge.textContent = `${modifier.name} - ${modifier.turns} turn${modifier.turns === 1 ? "" : "s"} left`;
    refs.modifierStrip.appendChild(badge);
  });
}

function startDecisionTimer() {
  clearTimer();

  const timerAdjustment = state.activeModifiers.reduce((sum, modifier) => sum + (modifier.timerDelta || 0), 0);
  const totalSeconds = Math.max(12, GAME_CONFIG.decisionTimer + timerAdjustment);
  state.timerRemaining = totalSeconds;
  updateTimerDisplay(totalSeconds, totalSeconds);

  state.timerId = window.setInterval(() => {
    state.timerRemaining -= 1;
    updateTimerDisplay(state.timerRemaining, totalSeconds);

    if (state.timerRemaining <= 0) {
      clearTimer();
      const scenario = SCENARIOS[state.scenarioIndex];
      showAlert("Countdown expired. Mission control defaulted to the contingency response.", "danger");
      handleChoice(scenario.timeoutChoice, true);
    }
  }, 1000);
}

function clearTimer() {
  if (state.timerId) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }
}

function updateTimerDisplay(remaining, total) {
  const safeRemaining = Math.max(0, remaining);
  const minutes = String(Math.floor(safeRemaining / 60)).padStart(2, "0");
  const seconds = String(safeRemaining % 60).padStart(2, "0");
  refs.timerDisplay.textContent = `${minutes}:${seconds}`;
  refs.timerFill.style.width = `${(safeRemaining / total) * 100}%`;
}

function handleChoice(optionIndex, timedOut) {
  if (!refs.resolutionPanel.classList.contains("hidden")) {
    return;
  }

  clearTimer();

  const scenario = SCENARIOS[state.scenarioIndex];
  const option = scenario.options[optionIndex];
  const modifierBonus = collectModifierEffects(option.tag);
  const finalEffects = mergeEffects(option.effects, modifierBonus);

  applyEffects(finalEffects);

  state.patterns[option.tag] += 1;
  if (timedOut) {
    state.patterns.timeouts += 1;
  }

  state.history.unshift({
    title: scenario.title,
    stage: scenario.stage,
    choice: option.label,
    outcome: option.outcome
  });

  consumeModifiers();

  let twistNote = "";
  const twist = TWISTS.find((item) => item.afterScenario === state.scenarioIndex + 1);
  if (twist) {
    activateTwist(twist);
    twistNote = `${twist.title}: ${twist.message}`;
  }

  updateStats();
  renderLog();
  renderModifierStrip();
  renderResolution(option, finalEffects, modifierBonus, twistNote, timedOut);

  const failure = getFailureReason();
  if (failure) {
    state.failureReason = failure;
    finishGame();
  }
}

function renderResolution(option, finalEffects, modifierBonus, twistNote, timedOut) {
  refs.resolutionPanel.classList.remove("hidden");
  refs.resolutionText.textContent = `${timedOut ? "Auto-response engaged. " : ""}${option.outcome}${twistNote ? ` ${twistNote}` : ""}`;
  refs.effectSummary.innerHTML = "";

  Object.entries(finalEffects).forEach(([stat, value]) => {
    if (value === 0) {
      return;
    }

    const pill = document.createElement("span");
    let isPositive = value > 0;

    if (stat === "risk") {
      isPositive = value < 0;
    }

    pill.className = `effect-pill ${isPositive ? "good" : "bad"}`;
    pill.textContent = `${formatStatName(stat)} ${value > 0 ? "+" : ""}${value}`;
    refs.effectSummary.appendChild(pill);
  });

  if (hasMeaningfulBonus(modifierBonus)) {
    const note = document.createElement("span");
    note.className = "effect-pill neutral";
    note.textContent = "Active twist modifier influenced this outcome";
    refs.effectSummary.appendChild(note);
  }

  document.querySelectorAll(".choice-card").forEach((card) => card.classList.add("disabled"));
  document.getElementById("next-btn").textContent = state.scenarioIndex === SCENARIOS.length - 1 ? "See Mission Outcome" : "Continue";
}

function renderLog() {
  refs.logList.innerHTML = "";

  if (!state.history.length) {
    refs.logList.innerHTML = `
      <div class="log-item">
        <strong>Mission log empty</strong>
        <p>Decisions and outcomes will appear here as the team works through the simulation.</p>
      </div>
    `;
    return;
  }

  state.history.slice(0, 5).forEach((entry) => {
    const item = document.createElement("article");
    item.className = "log-item";
    item.innerHTML = `
      <strong>${entry.stage} - ${entry.title}</strong>
      <p><strong>Decision:</strong> ${entry.choice}</p>
      <p>${entry.outcome}</p>
    `;
    refs.logList.appendChild(item);
  });
}

function updateStats() {
  Object.entries(state.stats).forEach(([key, rawValue]) => {
    const value = clamp(rawValue, GAME_CONFIG.statMin, GAME_CONFIG.statMax);
    refs.statValues[key].textContent = Math.round(value);
    refs.statBars[key].style.width = `${value}%`;
  });
}

function advanceScenario() {
  if (refs.views.outcome.hidden === false || refs.views.debrief.hidden === false) {
    return;
  }

  const previousStage = SCENARIOS[state.scenarioIndex]?.stage;
  state.scenarioIndex += 1;

  if (state.scenarioIndex >= SCENARIOS.length) {
    finishGame();
    return;
  }

  const nextStage = SCENARIOS[state.scenarioIndex].stage;
  if (previousStage !== nextStage) {
    showAlert(`${nextStage} initiated. Team coordination becomes even more important now.`, "info");
  }

  loadScenario();
}

function activateTwist(twist) {
  applyEffects(twist.immediateEffects);

  if (twist.modifier) {
    state.activeModifiers.push({
      name: twist.modifier.name,
      turns: twist.modifier.turns,
      timerDelta: twist.modifier.timerDelta,
      tagBonuses: twist.modifier.tagBonuses
    });
  }

  showAlert(twist.title, "danger");
}

function consumeModifiers() {
  state.activeModifiers = state.activeModifiers
    .map((modifier) => ({ ...modifier, turns: modifier.turns - 1 }))
    .filter((modifier) => modifier.turns > 0);
}

function collectModifierEffects(tag) {
  return state.activeModifiers.reduce((combined, modifier) => {
    const bonus = modifier.tagBonuses?.[tag];
    return mergeEffects(combined, bonus || {});
  }, createEmptyEffects());
}

function mergeEffects(baseEffects, bonusEffects) {
  return {
    mission: (baseEffects.mission || 0) + (bonusEffects.mission || 0),
    morale: (baseEffects.morale || 0) + (bonusEffects.morale || 0),
    time: (baseEffects.time || 0) + (bonusEffects.time || 0),
    risk: (baseEffects.risk || 0) + (bonusEffects.risk || 0)
  };
}

function createEmptyEffects() {
  return { mission: 0, morale: 0, time: 0, risk: 0 };
}

function applyEffects(effects) {
  state.stats.mission = clamp(state.stats.mission + (effects.mission || 0), GAME_CONFIG.statMin, GAME_CONFIG.statMax);
  state.stats.morale = clamp(state.stats.morale + (effects.morale || 0), GAME_CONFIG.statMin, GAME_CONFIG.statMax);
  state.stats.time = clamp(state.stats.time + (effects.time || 0), GAME_CONFIG.statMin, GAME_CONFIG.statMax);
  state.stats.risk = clamp(state.stats.risk + (effects.risk || 0), GAME_CONFIG.statMin, GAME_CONFIG.statMax);
}

function getFailureReason() {
  if (state.stats.risk >= GAME_CONFIG.failAt.risk) {
    return "Risk overloaded the mission. The team accepted more danger than the system could absorb.";
  }
  if (state.stats.time <= GAME_CONFIG.failAt.time) {
    return "Mission time ran out. Delay and indecision consumed the remaining window.";
  }
  if (state.stats.morale <= GAME_CONFIG.failAt.morale) {
    return "Team morale collapsed. The mission lost the trust and cohesion needed to function.";
  }
  if (state.stats.mission <= GAME_CONFIG.failAt.mission) {
    return "Mission success potential collapsed before the crew could stabilize the situation.";
  }
  return null;
}

function finishGame() {
  clearTimer();
  renderStageTracker();

  const outcome = evaluateOutcome();
  refs.outcomeTitle.textContent = outcome.title;
  refs.outcomeSummary.textContent = outcome.summary;

  refs.finalScoreboard.innerHTML = `
    <div class="result-stat"><span>Mission Success</span><strong>${Math.round(state.stats.mission)}</strong></div>
    <div class="result-stat"><span>Team Morale</span><strong>${Math.round(state.stats.morale)}</strong></div>
    <div class="result-stat"><span>Time Remaining</span><strong>${Math.round(state.stats.time)}</strong></div>
    <div class="result-stat"><span>Risk Level</span><strong>${Math.round(state.stats.risk)}</strong></div>
    <div class="result-stat"><span>Overall Score</span><strong>${outcome.score}</strong></div>
  `;

  refs.teamPatterns.innerHTML = `
    <span class="pattern-chip">Action choices: ${state.patterns.action}</span>
    <span class="pattern-chip">Safety choices: ${state.patterns.safety}</span>
    <span class="pattern-chip">Coordination choices: ${state.patterns.coordination}</span>
    <span class="pattern-chip">Timeouts: ${state.patterns.timeouts}</span>
  `;

  renderDebrief(outcome);
  showView("outcome");
  showAlert("Mission simulation complete. Review the outcome, then open the OB debrief.", "success");
}

function evaluateOutcome() {
  const balancedRange = Math.max(
    state.patterns.action,
    state.patterns.safety,
    state.patterns.coordination
  ) - Math.min(state.patterns.action, state.patterns.safety, state.patterns.coordination);

  const weightedScore =
    state.stats.mission * GAME_CONFIG.scoreWeights.mission +
    state.stats.morale * GAME_CONFIG.scoreWeights.morale +
    state.stats.time * GAME_CONFIG.scoreWeights.time +
    (100 - state.stats.risk) * GAME_CONFIG.scoreWeights.riskBuffer +
    state.patterns.coordination * GAME_CONFIG.scoreWeights.coordination +
    (balancedRange <= 2 ? GAME_CONFIG.scoreWeights.balancedTeam : 0) -
    state.patterns.timeouts * GAME_CONFIG.scoreWeights.timeoutPenalty;

  const score = Math.round(weightedScore);

  if (state.failureReason) {
    return {
      score,
      title: "Mission Loss",
      summary: `${state.failureReason} The simulation shows how technical strain becomes a team effectiveness problem when coordination, voice, and pacing break down.`
    };
  }

  if (score >= 360) {
    return {
      score,
      title: "Legendary Recovery",
      summary: "The mission survived extreme pressure because the team balanced action with reflection, kept communication visible, and coordinated trade-offs instead of hiding them."
    };
  }

  if (score >= 315) {
    return {
      score,
      title: "Controlled Success",
      summary: "The mission succeeded with manageable strain. The team adapted well, although several choices still exposed how fragile performance becomes when urgency dominates."
    };
  }

  if (score >= 275) {
    return {
      score,
      title: "Pyrrhic Success",
      summary: "The mission reached the finish line, but morale, time, or risk suffered. This is what success can look like when execution outpaces reflection."
    };
  }

  return {
    score,
    title: "Mission at the Edge",
    summary: "The crew made it through, but the team's coordination and trade-off management were stretched thin. Performance stayed alive mostly through resilience rather than robust team design."
  };
}

function renderDebrief(outcome) {
  const insightCards = buildDebriefInsights(outcome);
  refs.debriefInsights.innerHTML = "";

  insightCards.forEach((insight) => {
    const card = document.createElement("article");
    card.className = "insight-card";
    card.innerHTML = `
      <h3>${insight.title}</h3>
      <p>${insight.body}</p>
    `;
    refs.debriefInsights.appendChild(card);
  });
}

function buildDebriefInsights(outcome) {
  const dominantStyle = getDominantStyle();
  const coordinationShare = state.patterns.coordination;
  const timePressureIssue = state.patterns.timeouts > 0;
  const riskHigh = state.stats.risk >= 60;
  const moraleLow = state.stats.morale <= 45;
  const actionHeavy = state.patterns.action > state.patterns.safety + 1;
  const safetyHeavy = state.patterns.safety > state.patterns.action + 1;

  return [
    {
      title: "Role Balance Drives Team Effectiveness",
      body: `Your team leaned most often toward ${dominantStyle}. In organizational behavior terms, the strongest teams do not let one role logic dominate every crisis. Mission Commanders and Operations Specialists create momentum, Risk Assessors and Systems Analysts protect against blind spots, and Communications plus External Liaison keep the group aligned across boundaries.`
    },
    {
      title: "Communication and Coordination Are Critical",
      body: coordinationShare >= 4
        ? "The team repeatedly chose coordination-heavy responses, which is why morale and mission stability were easier to preserve under pressure. Shared mental models reduced confusion and helped imperfect options become workable."
        : "The mission shows what happens when coordination is underused. Even technically reasonable choices become harder to execute when people do not pause long enough to align on roles, information, and sequencing."
    },
    {
      title: "Pressure Reveals Group Dynamics",
      body: timePressureIssue || riskHigh || moraleLow
        ? "Under pressure, the team's hidden habits became visible. Timeouts, elevated risk, or morale damage suggest the group may have defaulted to urgency, caution, or hierarchy instead of consciously managing the social process."
        : "Pressure did not erase the team's process discipline. That usually means members were willing to challenge assumptions, surface concerns early, and keep the decision conversation structured even when the clock was loud."
    },
    {
      title: "Execution Needs Reflection",
      body: actionHeavy
        ? "This run tilted toward action. That can feel decisive, but high-performing teams still build in moments for reflection, dissent, and verification so speed does not become overconfidence."
        : safetyHeavy
          ? "This run tilted toward caution. Reflection improved safety, but top teams also know when to convert analysis into commitment so they do not lose momentum or exhaust the team."
          : `This run showed a relatively balanced mix of action, safety, and coordination. That is the core OB lesson of the simulation: high-performing teams need both execution and reflection, especially when the stakes are real and the options are all imperfect. Outcome: ${outcome.title}.`
    }
  ];
}

function getDominantStyle() {
  const entries = [
    ["action", state.patterns.action],
    ["safety", state.patterns.safety],
    ["coordination", state.patterns.coordination]
  ].sort((a, b) => b[1] - a[1]);

  return entries[0][0];
}

function hasMeaningfulBonus(effects) {
  return Object.values(effects).some((value) => value !== 0);
}

function formatStatName(name) {
  if (name === "time") {
    return "Time";
  }
  if (name === "risk") {
    return "Risk";
  }
  if (name === "mission") {
    return "Mission";
  }
  return "Morale";
}

function showAlert(message, tone) {
  refs.globalAlert.textContent = message;
  refs.globalAlert.className = `global-alert ${tone} show`;

  window.clearTimeout(showAlert.timeoutId);
  showAlert.timeoutId = window.setTimeout(() => {
    refs.globalAlert.className = "global-alert";
  }, 3200);
}

function shuffleArray(items) {
  const cloned = [...items];
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

init();

