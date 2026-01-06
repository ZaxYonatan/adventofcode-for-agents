## Metadata
- Stage: 8
- Part: 1
- Language: TypeScript
- Model: Composer
- Start time: 26-12-2025 15:30:00
- End time: 26-12-2025 15:35:00
- Duration: ~5 minutes

## Problem recap

Connect junction boxes in 3D space using the shortest possible connections. After making 1000 shortest connections, find the three largest circuits (connected components) and multiply their sizes together.

## Input model
- Raw format: Each line contains X,Y,Z coordinates of a junction box
- Parsed structure: Array of Point objects with x, y, z coordinates

## Key insights

- This is a minimum spanning tree variant using union-find (disjoint set)
- Need to process exactly N shortest connections (not successful unions)
- Some connections may already be in the same circuit (no-op)
- After N connections, find circuit sizes and multiply the three largest

## Approach

1. Parse all junction box coordinates from input
2. Calculate all pairwise distances between boxes
3. Sort connections by distance (shortest first)
4. Process the first 1000 connections using union-find
5. After processing, collect all circuit sizes
6. Sort circuit sizes descending and multiply the three largest

## Correctness sketch

Union-find maintains connected components efficiently. Processing shortest connections first ensures we're connecting closest boxes. After exactly N connections, we get the final circuit state. The three largest circuits are found by sorting all circuit sizes.

## Complexity
- Time: O(n² log n) where n is number of boxes (n² pairs, n log n sort, n² union operations)
- Space: O(n²) for storing all pairwise connections

## Validation
- Example: expected 40, got 40
- Real answer: 96672

