#!/usr/bin/env python3
"""
Day 8: Playground - Part 1
Connect junction boxes and find the product of the three largest circuit sizes.
"""

import sys
from math import sqrt
from collections import defaultdict


class UnionFind:
    """Union-Find data structure for tracking connected components."""
    
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    
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
        
        return True
    
    def get_component_sizes(self, n):
        """Return list of sizes of all connected components."""
        sizes = defaultdict(int)
        for i in range(n):
            root = self.find(i)
            sizes[root] += 1
        return list(sizes.values())


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


def solve(positions, num_connections):
    """
    Connect the num_connections closest pairs of junction boxes.
    Returns the product of the three largest circuit sizes.
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
    
    # Use Union-Find to connect the closest pairs
    uf = UnionFind(n)
    connections_made = 0
    
    for dist, i, j in distances:
        if connections_made >= num_connections:
            break
        uf.union(i, j)  # Connect regardless of whether already in same circuit
        connections_made += 1
    
    # Get component sizes and find the three largest
    sizes = uf.get_component_sizes(n)
    sizes.sort(reverse=True)
    
    # Multiply the three largest
    result = 1
    for i in range(min(3, len(sizes))):
        result *= sizes[i]
    
    return result


def main():
    if len(sys.argv) < 2:
        print("Usage: python solution.py <input_file> [num_connections]")
        sys.exit(1)
    
    input_file = sys.argv[1]
    
    # Default: 10 connections for example, 1000 for real
    if len(sys.argv) >= 3:
        num_connections = int(sys.argv[2])
    else:
        # Auto-detect based on file size
        positions = parse_input(input_file)
        if len(positions) <= 20:
            num_connections = 10
        else:
            num_connections = 1000
        result = solve(positions, num_connections)
        print(result)
        return
    
    positions = parse_input(input_file)
    result = solve(positions, num_connections)
    print(result)


if __name__ == "__main__":
    main()

