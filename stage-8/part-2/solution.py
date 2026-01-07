#!/usr/bin/env python3
"""
Day 8: Playground - Part 2
Connect junction boxes until all are in one circuit.
Find the product of X coordinates of the last two connected boxes.
"""

import sys
from math import sqrt
from collections import defaultdict


class UnionFind:
    """Union-Find data structure for tracking connected components."""
    
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.num_components = n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]
    
    def union(self, x, y):
        """Unite sets containing x and y. Returns True if they were different sets."""
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x == root_y:
            return False  # Already in the same circuit
        
        # Union by rank
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        
        self.num_components -= 1
        return True


def parse_input(filename):
    """Parse the input file and return list of (x, y, z) positions."""
    positions = []
    with open(filename, 'r') as f:
        for line in f:
            line = line.strip()
            if line:
                x, y, z = map(int, line.split(','))
                positions.append((x, y, z))
    return positions


def calculate_distance(p1, p2):
    """Calculate Euclidean distance between two 3D points."""
    return sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2 + (p1[2] - p2[2])**2)


def solve(positions):
    """
    Connect closest pairs until all boxes are in one circuit.
    Returns the product of X coordinates of the last two connected boxes.
    """
    n = len(positions)
    
    # Calculate all pairwise distances
    distances = []
    for i in range(n):
        for j in range(i + 1, n):
            dist = calculate_distance(positions[i], positions[j])
            distances.append((dist, i, j))
    
    # Sort by distance
    distances.sort(key=lambda x: x[0])
    
    # Use Union-Find to connect the closest pairs until all in one circuit
    uf = UnionFind(n)
    last_i, last_j = -1, -1
    
    for dist, i, j in distances:
        if uf.num_components == 1:
            break
        
        # Only count connections that actually unite different circuits
        if uf.union(i, j):
            last_i, last_j = i, j
    
    # Return product of X coordinates of the last two connected junction boxes
    return positions[last_i][0] * positions[last_j][0]


def main():
    if len(sys.argv) < 2:
        print("Usage: python solution.py <input_file>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    positions = parse_input(input_file)
    result = solve(positions)
    print(result)


if __name__ == "__main__":
    main()

