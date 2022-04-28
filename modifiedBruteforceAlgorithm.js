//See section 3.2.2 for an explanation of how it works.

function mbruteforce(graph, test = false) {
  let orderedEdgeFeasibilities = orderEdgeFeasibilities(graph); //See section 3.2.1 for an explanation of how it works (also see code commented in helperFunctions.js)
  let vertexSets = new Map(); //Stores the combinations for each vertex set size so they only have to be calculated once
  let numChecked = 0; //This is used when true is passed as a test parameter in order to see how many graphs are analysed

  //Loops over each feasibility which is just a pair of vertex set size and edge set size
  for(let i = 0; i < orderedEdgeFeasibilities.length; i++) {
    let feasibility = orderedEdgeFeasibilities[i];

    //If the combination of vertex sets for that size has not already been computed, compute it
    if(!vertexSets.has(feasibility.numOfVertices)) vertexSets.set(feasibility.numOfVertices, [...new Combinatorics.Combination([...graph.vertexSet.keys()], feasibility.numOfVertices)]);

    //Loops over each vertex set of the relevant size with respect to the feasibility
    for(let j = 0; j < vertexSets.get(feasibility.numOfVertices).length; j++) {
      let vertexSet = vertexSets.get(feasibility.numOfVertices)[j];

      if(test) numChecked = numChecked + 1; //If running a test then increase the number of graphs checked

      //If the vertices don't have enough degrees to facilitate such a graph specified by the feasibility move onto the next iteration
      if(Math.floor(graph.getDegrees(vertexSet).reduce((a, b) => a + b) / 2) < feasibility.numOfEdges) continue;

      let edgeSet = graph.getInducedSubgraph(vertexSet.slice()); //Compute the edge set of the induced subgraph on the vertex set

      //If the edge set is greater than or equal to the number of edge specified by the feasibility then a solution has been found
      //NOTE: Unlike the bruteforce algorithm we can terminate here because the search space is ordered in descending order of density
      if(edgeSet.size >= feasibility.numOfEdges) {
        if(test) return numChecked; //If it is a test just return the number of graphs checked
        else return new Graph({vertexSet: graph.getVertexSubset(vertexSet), edgeSet: edgeSet}); //Else return the solution
      }
    }
  }

  //If no solution has been found, i.e., the loop has terminated without finding a solution
  if(test) return numChecked; //If it is a test just return the number of graphs checked
  else return graph; //Else return the original graph
}

//USAGE:
//let result = mbruteforce(new Graph(generateBinomialRandomGraph(n, p))) or let result = mbruteforce(new Graph(generateUniformRandomGraph(n, m))) depending on what type of graph you want
