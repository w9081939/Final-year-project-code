//Defines a vertex class
class Vertex {
  constructor(label) { //Creates a vertex with the label
    this.neighbours = new Map();
    this.label = label;
  }

  //Adds a neighbour to the vertex, useful to calulate the degree of the vertex
  addNeighbour(vertex) {
    this.neighbours.set(vertex, true);
  }
}
