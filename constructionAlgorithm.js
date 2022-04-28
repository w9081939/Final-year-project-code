//See section 3.4.1 for an explanation of how it works.

function construct(graph) {
  let done = false; //Setting done to false to begin a while loop
  let newGraph = new Graph(); //Creating a new empty graph
  let vertices = graph.getVertexDegreeTuple().sort((a, b) => b.degree - a.degree); //Sorting the vertices by their degree in descending order

  newGraph.addVertex(new Vertex(vertices[0].label)); //Adding the vertex of maximum degree to the new graph

  //Loops until done is update to true which will only occur when the solution is found
  while (!done) {
    let neighbours = new Map(); //Creates a map which will store possible candidates that can be added to the new graph

    //Loops over all neighbours of every vertex in the new graph
    newGraph.vertexSet.forEach((vertex, label) => {
      [...graph.vertexSet.get(label).neighbours.keys()].forEach((n, i) => {
        if(!newGraph.vertexSet.has(n)) { //If the new graph doesn't already contain the vertex continue, else go to the next vertex
          let neighbour = neighbours.get(n);

          //If the neighbour already has been found and added
          if(neighbour) neighbour.connections = neighbour.connections + 1; //Then increase its' number of connections
          //Else this is the first time it has been found so add it to the neighbours map
          else neighbours.set(n, {
            label: n,
            connections: 1,
            degree: graph.getDegree(n)
          });
        }
      });
    });

    if(neighbours.size == 0) break; //If there are no candidates to add to the graph, end the loop

    //Finds the best possible candidate, i.e., the one which has the most connections
    //NOTE: If multiple have the same number of maximum connections, then it is the one with the largest degree in the original graph
    let newVertexLabel = [...neighbours.values()]
        .sort((a, b) => b.connections - a.connections)
        .filter((v, i, a) => v.connections == a[0].connections)
        .sort((a, b) => b.degree - a.degree)[0].label;
    //Finds the new edges that adding the candidate vertex into the new graph will introduce
    let newEdges = [...graph.vertexSet.get(newVertexLabel).neighbours.keys()]
        .filter((n) => [...newGraph.vertexSet.keys()].includes(n))
        .map((n) => [newVertexLabel, n].sort((a, b) => b - a))

    //If the density of the new graph with the addition of the candidate vertex and the new edges is larger than the density of the new graph without them
    if(newGraph.density <= (newGraph.edgeSet.size + newEdges.length) / (newGraph.vertexSet.size + 1)) {
      newGraph.addVertex(new Vertex(newVertexLabel)) //Add the candidate vertex to the new graph

      //Add each new edge to the new graph
      newEdges.forEach((edge, i) => {
        newGraph.addEdge(edge);
      });

      //If the new graph is equal to the original graph end the loop
      if(newGraph.vertexSet.size == graph.vertexSet.size) break;
    }
    else done = true; //If the addition of the candidate vertex and its' edges doesn't improve density end the loop
  }

  //Once the loop has ended return the new graph which has been constructed
  return newGraph;
}

//USAGE:
//let result = construct(new Graph(generateBinomialRandomGraph(n, p))) or let result = construct(new Graph(generateUniformRandomGraph(n, m))) depending on what type of graph you want
