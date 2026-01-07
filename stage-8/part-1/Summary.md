# Stage 8 - Part 1

## Problem
Connect junction boxes in 3D space by their shortest distances. After making the specified number of connections (1000 for the real input), calculate the product of the three largest circuit sizes.

## Approach
- Parse 3D coordinates for each junction box
- Calculate all pairwise distances between boxes
- Sort pairs by distance (shortest first)
- Use Union-Find (Disjoint Set Union) data structure to efficiently track which boxes are in the same circuit
- Connect the specified number of closest pairs
- Find all circuit sizes and multiply the three largest

## Solution
The solution uses Union-Find with path compression and union by rank for O(α(n)) operations. All pairwise distances are computed and sorted, then connections are made in order of increasing distance. The Union-Find tracks circuit membership efficiently.

## Answer
`96672`

## Duration

| Implementation | durationMS |
|----------------|------------|
| Node.js        | 213.72     |
