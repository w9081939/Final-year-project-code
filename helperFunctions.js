//This function gets all possible edges for a given vertex set
//An edge is represented as [x, y] where x and y are vertex labels and x > y
function getAllPossibleEdges(vertexSet) {
  let edges = [];

  for(let i = 1; i < vertexSet.length; i++) {
    for(let j = i - 1; j >= 0; j--) {
      edges.push([i, j]);
    }
  }

  return edges;
}

//This function gets the number of possible edges for a given vertex set size, i.e., returns |V| choose 2
function getMaximumNumberOfEdges(numOfVertices) {
  return (numOfVertices**2 - numOfVertices) / 2;
}

//This function approximates a lower bound for the number of edges given a specific vertex set size (see section 2.4.6 and section 3.2.1)
function getLowerBoundForEdgeSet(density, numOfVertices) {
  return Math.floor(density * numOfVertices) + 1;
}

//This function approximates a lower bound for the number of edges given a specific vertex set size (see section 3.2.1)
function getUpperBoundForEdgeSet(graph, numOfVertices) {
  return Math.floor(graph.getDegrees().sort((a, b) => b - a).splice(0, numOfVertices).reduce((a, b) => a + b) / 2);
}

//This functions sorts the search space into descending order of density (see section 3.2.1 for an explanation of how it works)
function orderEdgeFeasibilities(graph) {
  let edgeFeasibilities = [];

  //Loops over vertex set sizes from 2 to |V(G)| - 1
  for(let i = 2; i < graph.numOfVertices; i++) {
    let lowerbound = getLowerBoundForEdgeSet(graph.density, i); //Approximates a lowerbound for the number of edges needed to improve the density compared to the original graph
    let maximumNumOfEdges = getMaximumNumberOfEdges(i); //Calculates the maximum number of edges possible on this vertex set size

    //If the lowerbound is larger than the maximum number of possible edges then this solution is not feasible, so continue to the next iteration
    if(lowerbound > maximumNumOfEdges) continue;

    //Approximates an upperbound for the number of edges needed to improve the density compared to the original graph
    let upperbound = Math.min(maximumNumOfEdges, getUpperBoundForEdgeSet(graph, i));

    //Add everything between the lowerbound and upperbound (including both bounds) to the edgeFeasibilities array
    for(let j = lowerbound; j <= upperbound; j++) {
      edgeFeasibilities.push({numOfVertices: i, numOfEdges: j}); //Each feasibility is a pair of vertex set sizes and edge set sizes
    }
  }

  //Once the feasibilities for each vertex set size have been computed return the feasibilities sorted in descending order
  return edgeFeasibilities.sort((a, b) => (b.numOfEdges / b.numOfVertices) - (a.numOfEdges / a.numOfVertices));
}

//Calculates the factorial of n, only works for natural numbers, passing a negative number or quotient will lead to errors and questionable answers
function factorial(n) {
  if(n == 0) return 1;

  for(let i = n - 1; i >= 1; i--) {
    n = n * i;
  }

  return n;
}

//Calculates the number of graphs that are searched by the bruteforce algorithm for a given vertex set size (n)
function getNumberOfGraphsSearchedByBruteforceAlgorithm(n) {
  let numerator = factorial(n);
  let number = 0;

  //Loops between 2 and n - 1
  for(let k = 2; k < n; k++) {
    number = number + numerator / (factorial(k)*factorial(n-k)); //Calculates n choose k
  }

  return number; //Returns the sum of n choose k from k = 2 to n - 1;
}

//Generates all possible graphs for a given vertex set size (and optionally an edge set size, default is false)
function getAllPossibleGraphs(n, m = false) {
  let vertexSet = new Map([...Array(n).keys()].map((l) => [l, new Vertex(l)])); //Creates a vertex set of size n
  let possibleEdges = getAllPossibleEdges([...new Array(n)].map((e, i) => i)); //Finds all possible edges for the vertex set
  let edgeSets = [];
  let graphs = [];

  //Loops over all edge set sizes (or just one if m is specified)
  for(let i = m || 0; i <= Math.min(m || Infinity, possibleEdges.length); i++) {
    //Concatenates the edges sets (computed by E(G) choose i) to an array called edgeSets
    edgeSets = edgeSets.concat([...new Combinatorics.Combination(possibleEdges, i)]);
  }

  //For each edge set
  edgeSets.forEach((edgeSet, i) => {
    //Create a graph on the vertex set and add it to the array of graphs
    graphs.push(new Graph({vertexSet: new Map([...Array(n).keys()].map((l) => [l, new Vertex(l)]))}));

    //Add each edge to the graph
    edgeSet.forEach((edge, j) => {
      graphs[i].addEdge(edge);
    });
  });

  //Once all graphs have been created return them
  return graphs;
}
