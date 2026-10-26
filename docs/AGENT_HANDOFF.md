# EcoQuest — Agent Handoff and Quality Gate Protocol

## 1. Purpose and Protocol Overview

This document specifies the mandatory communication, quality assurance, and execution gate procedures for coding agents working on EcoQuest.

EcoQuest development follows a strict **controlled, stage-by-stage workflow**. Under no circumstances should an agent attempt to run multiple stages or leap ahead without explicit user review and approval.

---

## 2. Standardized Stage Execution Sequence

Each stage must be performed according to the following cycle:

1. **Locate and Read Prompt**: Read the corresponding stage prompt in `docs/EcoQuest_Master_Prompts_and_Workflow.md`.
2. **Pre-Execution Inspection**: Verify the actual state of the workspace and toolchain.
3. **Execute Scope Only**: Perform only the authorized actions defined in that specific stage.
4. **Verification**: Execute diagnostic commands, unit tests, linters, or typecheckers to generate hard evidence.
5. **Produce Standard Execution Report**: Present the findings in the required 8-section format.
6. **Stop and Wait**: Halt execution immediately. Await user feedback or ChatGPT independent validation.

---

## 3. Required Report Structure

At the conclusion of every stage, the agent must output a report structured as follows:

```markdown
### A. Execution Summary
- Stage number and name.
- Task ID.
- Objective.
- Overall status: PASS, PARTIAL, BLOCKED, or FAIL.

### B. Actions Performed
List actual actions executed, clearly distinguishing read-only inspections from write modifications.

### C. Files Changed
For every file touched: path, action (created/modified/deleted), and reason. State explicitly if no files changed.

### D. Verification Evidence
Terminal commands executed, actual outputs, tests run, exit codes, and inspected files. Never state a test passed without terminal output evidence.

### E. Outstanding Issues
Errors, blockers, missing prerequisites, security concerns, or unresolved decisions.

### F. Acceptance Checklist
Mark each stage acceptance criterion as:
- PASS: Supported by direct evidence.
- FAIL: Evidence proves requirement is not satisfied.
- BLOCKED: Dependent on an unresolved blocker.
- NOT RUN: Not yet reached or executed.

### G. Recommended Next Action
Minimum work needed to address blockers or the exact next prompt in sequence.

### H. HANDOFF FOR INDEPENDENT REVIEW
(Exact heading required)
A concise, self-contained summary with raw terminal outputs and file changes formatted for copy-paste into ChatGPT for independent technical review. Secrets or credentials must NEVER be included.
```

---

## 4. Independent Review and Approval Gate

1. The user will take the content under `HANDOFF FOR INDEPENDENT REVIEW` and submit it to an independent reviewer (ChatGPT).
2. The independent reviewer will inspect the evidence against the stage acceptance criteria.
3. **If Approved**: The user will issue an authorization instruction to start the next eligible stage.
4. **If Defects Found**: The user will provide targeted feedback/correction instructions. The agent must fix only the cited issues, re-verify with terminal output, output an updated report, and stop again.

---

## 5. Security & Confidentiality Rules for Handoffs

- **No Secrets**: Never expose database passwords, Supabase service-role keys, private auth tokens, or private environment variables in handoff reports.
- **Sanitized Outputs**: Command outputs must be sanitized of private local directories or tokens where applicable.
- **Answer Key Protection**: Never include raw question answer keys or private scoring formulas in public or client-accessible reports.
