# BattleShip 
This is a simple Battleship game I built as a personal project to deepen my understanding of JavaScript, especially in solving problems through DOM manipulation, drag-and-drop mechanics, and experimenting with test-driven development (TDD) concepts
## Challenges Faced & Solutions
1. Ships not disappearing after drop:
Solved by properly setting draggedShip.style.display = 'none' after placement.

2. Overlapping ships:
Introduced an OccupiedCells array to track filled cells and prevent overlaps with alerts.

3. Ship rotation issues:
Initially attempted dynamic orientation toggle. Paused that for future implementation after complexity and time management.

4. Event listener issues on game start:
Refactored code to avoid multiple listeners and ensured game start logic only executes once.

5. Issues in mapping the ships to the cells they are placed on :
Solved by mapping ship instances.

## Status
Core logic for placing ships and attacking the opponent grid is working. Future improvements could include:

- Adding ship rotation.

- Smarter computer AI or multiplayer mode
- Betterment in game CSS 
