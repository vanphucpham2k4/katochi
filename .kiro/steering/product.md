# Product Overview

KATOCHI is an AI-powered Chrome browser extension (Manifest V3) that lets users transform any website through natural-language commands.

## Core Concept

A floating ghost mascot is KATOCHI's primary interface. It drifts over the active webpage and exposes a chat bubble where users issue commands. The mascot reflects what's happening through five lifecycle states:

- **IDLE** - mascot not present on the page
- **SUMMONED** - mascot is floating on the viewport, ready for commands
- **POSSESSING** - mascot is actively applying a transformation to the page
- **CHAOS** - chaos mode runs a fixed set of effects for a set duration
- **EXORCISED** - all KATOCHI changes are being reverted; mascot fades out

## What Users Can Do

- Change background color, text color, and typography on page elements
- Create buttons and search bars
- Apply glitch and shake effects to elements
- Trigger chaos mode (a fixed bundle of effects)
- **Undo** the most recent change, or **Exorcise** to revert every KATOCHI-owned modification

## Key Design Principles

- Users never type CSS selectors. Targets are resolved internally from natural-language hints.
- KATOCHI never executes arbitrary AI-generated JavaScript. Only a fixed set of validated, structured actions exist.
- Every modification is tracked so it can be cleanly reverted. Undo/Exorcise must never overwrite changes the website made independently.
- The mascot UI is fully isolated inside a Shadow DOM so it never clashes with the host page.

## Status

Early-stage (v0.1.0). The mascot subsystem, state machine, movement, and type system are implemented. Several features (chat bubble, command parser, action engine, page context analyzer, target resolver, DOM controller) are planned in later tasks and referenced via TODOs in the code.
