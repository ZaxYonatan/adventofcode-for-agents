import math
import os

class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
        self.components = n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x == root_y:
            return False
        
        if self.size[root_x] < self.size[root_y]:
            self.parent[root_x] = root_y
            self.size[root_y] += self.size[root_x]
        else:
            self.parent[root_y] = root_x
            self.size[root_x] += self.size[root_y]
        
        self.components -= 1
        return True
    
    def is_connected(self):
        return self.components == 1

def parse_input(input_path):
    with open(input_path, 'r') as f:
        lines = f.read().strip().split('\n')
    points = []
    for line in lines:
        x, y, z = map(int, line.split(','))
        points.append((x, y, z))
    return points

def calculate_distance(p1, p2):
    dx = p1[0] - p2[0]
    dy = p1[1] - p2[1]
    dz = p1[2] - p2[2]
    return math.sqrt(dx * dx + dy * dy + dz * dz)

def solve(points):
    connections = []
    
    for i in range(len(points)):
        for j in range(i + 1, len(points)):
            distance = calculate_distance(points[i], points[j])
            connections.append((distance, i, j))
    
    connections.sort(key=lambda x: x[0])
    
    uf = UnionFind(len(points))
    last_connection = None
    
    for distance, i, j in connections:
        if uf.union(i, j):
            last_connection = (points[i][0], points[j][0])
            if uf.is_connected():
                break
    
    if last_connection:
        return last_connection[0] * last_connection[1]
    return 0

example_path = os.path.join(os.path.dirname(__file__), '../input.example')
real_path = os.path.join(os.path.dirname(__file__), '../input.real')

example_points = parse_input(example_path)
example_result = solve(example_points)
print(f'Example result: {example_result}')

if example_result != 25272:
    print(f'Example validation failed: expected 25272, got {example_result}')
    exit(1)

real_points = parse_input(real_path)
real_result = solve(real_points)
print(f'Real answer: {real_result}')

