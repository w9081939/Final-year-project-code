//Defines a graph class
class Graph {
  constructor(graph = {}) { //Creates a graph, either empty if no vertex set or edge set is given or on said sets
    this.vertexSet = graph.vertexSet || new Map();
    this.edgeSet = graph.edgeSet || new Map();
  }

  //Adds a vertex to the graph
  addVertex(vertex) {
    this.vertexSet.set(vertex.label, vertex);
  }

  addEdge(edge) {
    //Adds the edge to the graph
    this.edgeSet.set(JSON.stringify(edge), true);

    //Sets the endpoints of the edge to be neighbours of each other
    this.vertexSet.get(edge[0]).addNeighbour(edge[1]);
    this.vertexSet.get(edge[1]).addNeighbour(edge[0]);
  }

  //Gets the degree of a vertex by returning the size of its' neighbours map
  getDegree(vertex) {
    return this.vertexSet.get(vertex).neighbours.size;
  }

  //Gets the degrees of a subset of vertices (or all if no set is provided)
  getDegrees(vertices) {
    let vertexSet = vertices || [...this.vertexSet.keys()]; //If a subset is provided use that otherwise, use the entire vertex set

    return vertexSet.map((v) => this.getDegree(v)); //Return an array of the degree for each vertex
  }

  //Gets a tuple of vertex label and degree for a subset of vertices (or all if no set is provided)
  getVertexDegreeTuple(vertices) {
    let vertexSet = vertices || [...this.vertexSet.keys()]; //If a subset is provided use that otherwise, use the entire vertex set

    //Return an array of vertex label and degree tuples for each vertex
    return vertexSet.map((v) => ({
      label: v,
      degree: this.getDegree(v)
    }));
  }

  //Gets the edge set of the subgraph induced on a given vertex subset
  getInducedSubgraph(vertexSet) {
    let edgeSet = new Map(); //Creates an empty edge set

    //Loops from |V(H)| - 1 to 0 (H is a the subgraph)
    //NOTE: It loops backwards so the edges are of the desired for [x, y], x > y (consistency of how edges are represented is important to avoid errors/bugs)
    for(let i = vertexSet.length - 1; i >= 0; i--) {
      let source = vertexSet.splice(i, 1)[0]; //Removes the vertex from the vertex set and sets it as the source
      let neighbours = this.vertexSet.get(source).neighbours; //Finds all neighbours of the source
      let targets = vertexSet.filter(v => [...neighbours.keys()].includes(v)); //Filters the neighbours, discarding any that are not in the vertex set

      //For each viable neighbour (i.e., one in the vertex set)
      targets.map((target) => [source, target]).forEach((edge, i) => {
        edgeSet.set(JSON.stringify(edge), true); //Add the edge to the edge set
      });
    }

    //Once all edges have been found return the edge set
    return edgeSet;
  }

  //Formats the vertex set given, changes it from an array of vertex labels to a map of vertex objects (again for consistency reasons and to prevent errors)
  getVertexSubset(vertexSet) {
    let subset = new Map(); //Creates an empty vertex subset

    //For each vertex label in the given vertex set
    vertexSet.forEach((vertex, i) => {
      subset.set(vertex, this.vertexSet.get(vertex)); //Get the vertex object that corresponds to the vertex label and store it in the subset map
    });

    return subset; //Return the correctly formatted vertex set once each vertex label has been processed
  }

  //Removes a vertex that corresponds to a given label
  removeVertex(label) {
    let vertex = this.vertexSet.get(label); //Gets the vertex that corresponds to said label

    //For each neighbour of the vertex
    [...vertex.neighbours.keys()].forEach((neighbour, i) => {
      let edge = [neighbour, label].sort((a, b) => b - a); //Find the edge that corresponds to them

      this.vertexSet.get(neighbour).neighbours.delete(label); //Remove the vertex from being the neighbour of its' neighbour
      this.edgeSet.delete(JSON.stringify(edge)); //Remove the edge from the graph
    });

    //Once all edges and neighbours have been updated remove the vertex from the graph
    this.vertexSet.delete(label);
  }

  get numOfVertices() {
    return this.vertexSet.size; //Returns the size of the vertex set, i.e., the number of vertices of the graph
  }

  get density() {
    return this.edgeSet.size / this.vertexSet.size; //Returns the density of the graph, i.e., the ratio of number of edges to number of vertices
  }
}
