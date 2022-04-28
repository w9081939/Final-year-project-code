//See section 3.1.1 for an explanation of how it works.

function bruteforce(graph) {
  let vertexSets = []
  let solution = {vertexSet: [...graph.vertexSet.keys()], edgeSet: graph.edgeSet, density: graph.density} //Initially the solution is the original graph

  //Loops through from 2 to |V(G)|-1
  for(let i = 2; i < graph.vertexSet.size; i++) {
    let combinations = [...new Combinatorics.Combination([...graph.vertexSet.keys()], i)]; //Computes V(G) choose i

    vertexSets = vertexSets.concat(combinations); //Concatenates V(G) choose i to vertexSets array
  }

  //Loops through all graphs in vertexSets array
  for(let j = 0; j < vertexSets.length; j++) {
    let vertexSet = vertexSets[j];
    let edgeSet = graph.getInducedSubgraph(vertexSet.slice()); //Computes the edgeSet of the induced subgraph on the vertexSet
    let density = edgeSet.size / vertexSet.length; //Computes the density of the induced subgraph

    //If the density of the induced subgraph is larger than the current solution the solution is updated to the induced subgraph
    //NOTE: the algorithm can't terminate here as there is no guarantee that this new solution is optimal because the search space (vertexSets) is not ordered in such a way
    if(density > solution.density) solution = {vertexSet, edgeSet, density};
  }

  //Once all vertex sets have been analysed the algorithm can terminate and return the solution found
  return new Graph({vertexSet: graph.getVertexSubset(solution.vertexSet), edgeSet: solution.edgeSet});
}

//USAGE:
//let result = bruteforce(new Graph(generateBinomialRandomGraph(n, p))) or let result = bruteforce(new Graph(generateUniformRandomGraph(n, m))) depending on what type of graph you want
