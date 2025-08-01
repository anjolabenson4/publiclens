# PublicLens

A decentralized platform for citizen-driven governance of local budgets and public project funding through smart contracts, enabling transparent voting, milestone-based disbursement, and participatory audits.

## Overview

This system consists of ten main smart contracts that collectively power a participatory public funding and accountability network:

1. **Proposal Registry Contract** – Citizens propose and publish community improvement projects  
2. **Voting & Governance Contract** – Enables decentralized voting, delegation, and proposal execution  
3. **Citizen Identity Contract** – Verifies citizen participants and manages on-chain reputation  
4. **Public Treasury Contract** – Stores and distributes community funds  
5. **Milestone Validation Contract** – Manages proof-of-progress for funded projects  
6. **Dispute Resolution Contract** – Enables citizen-led fraud reporting and arbitration  
7. **Bounty Validator Contract** – Rewards users for verifying on-ground implementation  
8. **Audit Trail Contract** – Stores immutable records of proposals, votes, and fund flows  
9. **Neighborhood Pool Contract** – Allows smaller microDAOs to manage pooled local budgets  
10. **Matching Grant Contract** – Enables external sponsors to match funds for impactful initiatives

## Features

- Decentralized participatory budgeting
- Transparent public fund allocation
- Milestone-based project validation
- On-chain citizen reputation system
- Dispute resolution and fraud detection
- Incentivized verification and auditing
- Sponsor-based matching grants
- Local microDAO budget autonomy

## Smart Contracts

### Proposal Registry Contract

- Project proposal submission
- Community need tagging
- Budget and timeline estimation
- Proposal status tracking

### Voting & Governance Contract

- Stake or quadratic-based voting
- Proposal execution logic
- Delegated voting support
- Dynamic quorum thresholds

### Citizen Identity Contract

- KYC-linked DID verification
- Soulbound identity tokens
- Reputation scoring
- Participation history

### Public Treasury Contract

- On-chain fund custody
- Stage-based disbursements
- Budget allocation tracking
- Emergency freeze mechanisms

### Milestone Validation Contract

- Project milestone creation
- Citizen proof-of-progress submission
- Oracle-assisted verification
- Disbursement triggers

### Dispute Resolution Contract

- Anonymous fraud reporting
- Community voting on disputes
- Penalties and refund logic
- Escrow protection

### Bounty Validator Contract

- Citizen validator pool
- Task verification rewards
- Proof-of-civic-duty incentives
- Validator reputation tracking

### Audit Trail Contract

- Immutable logs of all actions
- Transparent spending records
- Traceable governance history

### Neighborhood Pool Contract

- MicroDAO formation
- Localized budget allocation
- Independent governance rules

### Matching Grant Contract

- Sponsor registration
- Match-ratio customization
- Automatic matching triggers

## Installation

1. Install [Clarinet CLI](https://docs.stacks.co/clarity/clarinet-cli)
2. Clone this repository
3. Run tests:
    ```bash
    npm test
    ```
4. Deploy contracts:
    ```bash
    clarinet deploy
    ```

## Usage

Each contract is modular and can be deployed independently or integrated within a full DAO suite. For example, small communities may only use the Proposal, Treasury, and Voting contracts, while large city districts can leverage all ten. See each contract’s documentation for full details and sample transactions.

## Testing

All contracts include unit tests written in Clarinet's testing framework with Vitest:
```bash
npm test
```

## License

MIT License

