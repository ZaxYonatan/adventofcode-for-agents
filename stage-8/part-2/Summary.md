# Stage 8 - Part 2

## Problem
Continue connecting junction boxes by shortest distance until all boxes form a single circuit. Find the last connection that merges two separate circuits and return the product of the X coordinates of those two junction boxes.

## Approach
- Parse 3D coordinates for each junction box
- Calculate all pairwise distances and sort by distance
- Use Union-Find to track circuits, counting remaining circuits
- Connect pairs in order until only 1 circuit remains
- Track the last connection that actually merged two different circuits
- Return product of X coordinates of that pair

## Solution
The solution extends Part 1 by tracking the number of circuits and stopping when only one remains. The Union-Find's union operation returns whether a merge actually occurred (false if already in same circuit). The last successful merge before reaching 1 circuit gives us the answer.

## Answer
`22517595`

## Duration

| Implementation | durationMS |
|----------------|------------|
| Node.js        | 211.79     |
