//See section 3.3.1 for an explanation of how it works.

function deconstruct(graph) {
  let done = false; //Setting done to false to begin a while loop

  //Loops until done is update to true which will only occur when the solution is found
  while(!done) {
    let vertices = graph.getVertexDegreeTuple().sort((a, b) => a.degree - b.degree); //Orders the vertices by degree in ascending order
    //Calculates the maximum possible degree that a single vertex can have so that when removed the density of the graph increases
    let maxDegree = graph.edgeSet.size - Math.ceil(graph.density*(graph.vertexSet.size - 1));
    let vertexLabel = false; //Preallocates memory to story the vertex label but also is a default value incase no such vertex is found

    //Loops through the vertices ordered in ascending order of degree
    for(let j = 0; j < vertices.length; j++) {
      //If the vertex degree exceeds the maximum possible degree such that it can be removed and improve the graphs density
      if(vertices[j].degree > maxDegree) {
        vertexLabel = j == 0 ? false : vertices[j - 1].label; //Select the previous vertex which must be of the largest valid degree
        break; //Terminate the loop (not the algorithm) because the vertex to delete has been found
      }
    }

    if(vertexLabel === false) done = true; //If the loop ends and no vertex is found that can be removed, terminate the loop
    else graph.removeVertex(vertexLabel); //Else remove the vertex found and move on to the next iteration
  }

  return graph; //Once the loop has been terminated return the graph
}

//let graph = new Graph(generateBinomialRandomGraph(n, p)) or let graph = generateUniformRandomGraph(n, m)) depending on what type of graph you want
//let result = deconstruct(structuredClone(graph))
//structuredClone makes a deep copy, otherwise the algorithm will modify the original graph due to its' deconstructive nature
